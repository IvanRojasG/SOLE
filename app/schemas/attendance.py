from datetime import date
from uuid import UUID

from pydantic import BaseModel


class AttendanceSessionCreate(BaseModel):
    session_date: date


class AttendanceCheckInRequest(BaseModel):
    athlete_id: UUID


class AttendanceSessionResponse(BaseModel):
    id: UUID
    session_date: date
    coach_id: UUID


class AttendanceRecordResponse(BaseModel):
    id: UUID
    session_id: UUID
    athlete_id: UUID


class AttendanceRecordDetailedResponse(BaseModel):
    id: UUID
    session_id: UUID
    athlete_id: UUID
    session_date: date


class AttendanceSessionSummaryResponse(BaseModel):
    id: UUID
    session_date: date
    coach_id: UUID
    checked_in_count: int
