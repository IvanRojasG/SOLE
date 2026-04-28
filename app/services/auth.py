from datetime import datetime, timedelta
from hashlib import sha256
from secrets import token_urlsafe

from fastapi import HTTPException, status
from sqlmodel import Session, select

from app.core.security import create_access_token, hash_password, verify_password
from app.models.all_models import Athlete, PasswordResetToken, User
from app.schemas.auth import ChangePasswordRequest, LoginRequest, RegisterRequest, ResetPasswordRequest


RESET_TOKEN_EXPIRE_MINUTES = 30


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


def change_password(session: Session, user: User, payload: ChangePasswordRequest) -> None:
    if not verify_password(payload.current_password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is invalid")

    user.password_hash = hash_password(payload.new_password)
    session.add(user)
    session.commit()


def _hash_reset_token(token: str) -> str:
    return sha256(token.encode("utf-8")).hexdigest()


def create_password_reset_token(session: Session, email: str) -> str | None:
    user = session.exec(select(User).where(User.email == email)).first()
    if not user or not user.is_active:
        return None

    token = token_urlsafe(32)
    reset_token = PasswordResetToken(
        user_id=user.id,
        token_hash=_hash_reset_token(token),
        expires_at=datetime.utcnow() + timedelta(minutes=RESET_TOKEN_EXPIRE_MINUTES),
    )
    session.add(reset_token)
    session.commit()
    return token


def reset_password(session: Session, payload: ResetPasswordRequest) -> None:
    token_hash = _hash_reset_token(payload.token)
    reset_token = session.exec(
        select(PasswordResetToken).where(PasswordResetToken.token_hash == token_hash)
    ).first()

    if (
        not reset_token
        or reset_token.used_at is not None
        or reset_token.expires_at < datetime.utcnow()
    ):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset token")

    user = session.get(User, reset_token.user_id)
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset token")

    user.password_hash = hash_password(payload.new_password)
    reset_token.used_at = datetime.utcnow()
    session.add(user)
    session.add(reset_token)
    session.commit()
