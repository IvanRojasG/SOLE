from uuid import UUID

from pydantic import BaseModel


class PublicAthleteResponse(BaseModel):
    id: UUID
    full_name: str
    level: str
    baseline_locked: bool
    points: int
