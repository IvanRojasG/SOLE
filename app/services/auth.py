from fastapi import HTTPException, status
from sqlmodel import Session, select

from app.core.security import create_access_token, hash_password, verify_password
from app.models.all_models import Athlete, User
from app.schemas.auth import LoginRequest, RegisterRequest


def register_athlete(session: Session, payload: RegisterRequest) -> User:
    existing_user = session.exec(select(User).where(User.email == payload.email)).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    user = User(email=payload.email, password_hash=hash_password(payload.password), role="athlete")
    session.add(user)
    session.flush()

    athlete = Athlete(user_id=user.id, full_name=payload.full_name, level=payload.level)
    session.add(athlete)
    session.commit()
    session.refresh(user)
    return user


def login_user(session: Session, payload: LoginRequest) -> str:
    user = session.exec(select(User).where(User.email == payload.email)).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Inactive user")
    return create_access_token(user.id)
