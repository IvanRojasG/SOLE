from fastapi import APIRouter, Depends, Response
from sqlmodel import Session

from app.core.db import get_session
from app.core.deps import require_role
from app.models.all_models import User
from app.schemas.report import ClassifierWodReportResponse
from app.services.reports import build_classifier_wod_report_pdf, get_classifier_wod_report


router = APIRouter()


@router.get("/classifier-wods", response_model=ClassifierWodReportResponse)
def classifier_wod_report(
    _: User = Depends(require_role("coach")),
    session: Session = Depends(get_session),
):
    return ClassifierWodReportResponse(**get_classifier_wod_report(session))


@router.get("/classifier-wods.pdf")
def classifier_wod_report_pdf(
    _: User = Depends(require_role("coach")),
    session: Session = Depends(get_session),
):
    pdf = build_classifier_wod_report_pdf(get_classifier_wod_report(session))
    return Response(
        content=pdf,
        media_type="application/pdf",
        headers={"Content-Disposition": 'attachment; filename="reporte-wods-clasificatorio.pdf"'},
    )
