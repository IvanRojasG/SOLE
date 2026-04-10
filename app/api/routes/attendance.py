from uuid import UUID

from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.core.db import get_session
from app.core.deps import get_current_athlete, get_current_coach
from app.models.all_models import AttendanceRecord, AttendanceSession, Athlete, Coach
from app.schemas.attendance import (
    AttendanceCheckInRequest,
    AttendanceRecordDetailedResponse,
    AttendanceRecordResponse,
    AttendanceSessionCreate,
    AttendanceSessionResponse,
    AttendanceSessionSummaryResponse,
)
from app.services.attendance import check_in_athlete, create_session


router = APIRouter()


@router.post("/session", response_model=AttendanceSessionResponse)
def create_attendance_session(
    payload: AttendanceSessionCreate,
    coach: Coach = Depends(get_current_coach),
    session: Session = Depends(get_session),
):
    return create_session(session, coach, payload)


@router.post("/session/{id}/checkin", response_model=AttendanceRecordResponse)
def checkin(
    id: UUID,
    payload: AttendanceCheckInRequest,
    _: Coach = Depends(get_current_coach),
    session: Session = Depends(get_session),
):
    return check_in_athlete(session, id, payload.athlete_id)


@router.get("/me", response_model=list[AttendanceRecordResponse])
def my_attendance(
    athlete: Athlete = Depends(get_current_athlete),
    session: Session = Depends(get_session),
):
    records = session.exec(select(AttendanceRecord).where(AttendanceRecord.athlete_id == athlete.id)).all()
    return records


@router.get("/me/detailed", response_model=list[AttendanceRecordDetailedResponse])
def my_attendance_detailed(
    athlete: Athlete = Depends(get_current_athlete),
    session: Session = Depends(get_session),
):
    records = session.exec(select(AttendanceRecord).where(AttendanceRecord.athlete_id == athlete.id)).all()
    sessions = {
        attendance_session.id: attendance_session
        for attendance_session in session.exec(select(AttendanceSession)).all()
    }
    return [
        AttendanceRecordDetailedResponse(
            id=record.id,
            session_id=record.session_id,
            athlete_id=record.athlete_id,
            session_date=sessions[record.session_id].session_date,
        )
        for record in records
        if record.session_id in sessions
    ]


@router.get("/sessions", response_model=list[AttendanceSessionSummaryResponse])
def list_attendance_sessions(
    _: Coach = Depends(get_current_coach),
    session: Session = Depends(get_session),
):
    attendance_sessions = session.exec(select(AttendanceSession).order_by(AttendanceSession.session_date.desc())).all()
    return [
        AttendanceSessionSummaryResponse(
            id=attendance_session.id,
            session_date=attendance_session.session_date,
            coach_id=attendance_session.coach_id,
            checked_in_count=len(
                session.exec(
                    select(AttendanceRecord).where(AttendanceRecord.session_id == attendance_session.id)
                ).all()
            ),
        )
        for attendance_session in attendance_sessions
    ]
