from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, select

from app.core.db import get_session
from app.core.security import decode_token
from app.models.all_models import Athlete, Coach, User


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(session: Session = Depends(get_session), token: str = Depends(oauth2_scheme)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_token(token)
        user_id = UUID(str(payload.get("sub")))
    except (ValueError, TypeError):
        raise credentials_exception

    user = session.get(User, user_id)
    if not user or not user.is_active:
        raise credentials_exception
    return user


def require_role(expected_role: str):
    def dependency(user: User = Depends(get_current_user)) -> User:
        if user.role != expected_role:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
        return user

    return dependency


def get_current_athlete(
    user: User = Depends(require_role("athlete")),
    session: Session = Depends(get_session),
) -> Athlete:
    athlete = session.exec(select(Athlete).where(Athlete.user_id == user.id)).first()
    if not athlete:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Athlete profile not found")
    return athlete


def get_current_coach(
    user: User = Depends(require_role("coach")),
    session: Session = Depends(get_session),
) -> Coach:
    coach = session.exec(select(Coach).where(Coach.user_id == user.id)).first()
    if not coach:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Coach profile not found")
    return coach
