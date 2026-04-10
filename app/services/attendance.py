from fastapi import HTTPException, status
from sqlmodel import Session, select

from app.models.all_models import Athlete, AttendanceRecord, AttendanceSession, Coach
from app.schemas.attendance import AttendanceSessionCreate


def create_session(session: Session, coach: Coach, payload: AttendanceSessionCreate) -> AttendanceSession:
    existing = session.exec(
        select(AttendanceSession).where(
            AttendanceSession.session_date == payload.session_date,
            AttendanceSession.coach_id == coach.id,
        )
    ).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Session already exists")

    attendance_session = AttendanceSession(session_date=payload.session_date, coach_id=coach.id)
    session.add(attendance_session)
    session.commit()
    session.refresh(attendance_session)
    return attendance_session


def check_in_athlete(session: Session, session_id, athlete_id) -> AttendanceRecord:
    attendance_session = session.get(AttendanceSession, session_id)
    if not attendance_session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Attendance session not found")

    athlete = session.get(Athlete, athlete_id)
    if not athlete:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Athlete not found")

    existing = session.exec(
        select(AttendanceRecord).where(
            AttendanceRecord.session_id == session_id,
            AttendanceRecord.athlete_id == athlete_id,
        )
    ).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Attendance already recorded")

    record = AttendanceRecord(session_id=session_id, athlete_id=athlete_id)
    session.add(record)
    session.commit()
    session.refresh(record)
    return record
