from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from app.core.db import get_session
from app.core.deps import get_current_user
from app.core.config import settings
from app.models.all_models import User
from app.schemas.auth import (
    ChangePasswordRequest,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    LoginRequest,
    MessageResponse,
    RegisterRequest,
    ResetPasswordRequest,
    TokenResponse,
    UserResponse,
)
from app.services.auth import change_password, create_password_reset_token, login_user, register_athlete, reset_password


router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, session: Session = Depends(get_session)):
    return register_athlete(session, payload)


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, session: Session = Depends(get_session)):
    token = login_user(session, payload)
    return TokenResponse(access_token=token)


@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/change-password", response_model=MessageResponse)
def change_my_password(
    payload: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    change_password(session, current_user, payload)
    return MessageResponse(message="Password updated")


@router.post("/forgot-password", response_model=ForgotPasswordResponse)
def forgot_password(payload: ForgotPasswordRequest, session: Session = Depends(get_session)):
    reset_token = create_password_reset_token(session, str(payload.email))
    return ForgotPasswordResponse(
        message="If the email exists, password reset instructions were generated.",
        reset_token=reset_token if settings.expose_password_reset_token else None,
    )


@router.post("/reset-password", response_model=MessageResponse)
def reset_password_with_token(payload: ResetPasswordRequest, session: Session = Depends(get_session)):
    reset_password(session, payload)
    return MessageResponse(message="Password updated")
