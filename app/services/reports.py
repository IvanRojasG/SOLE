from datetime import UTC, datetime
from decimal import Decimal
from io import BytesIO

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle
from sqlmodel import Session, select

from app.models.all_models import Achievement, Athlete, Challenge


def format_time(seconds: int | None) -> str:
    if seconds is None:
        return "-"
    minutes = seconds // 60
    remaining_seconds = seconds % 60
    return f"{minutes}:{remaining_seconds:02d}"


def format_decimal(value: Decimal | None) -> str:
    if value is None:
        return "-"
    normalized = value.normalize()
    return f"{normalized:f}"


def format_score(achievement: Achievement) -> str:
    if achievement.weight_lbs is not None:
        reps = f"{achievement.reps_completed} reps · " if achievement.reps_completed is not None else ""
        return f"{reps}{format_decimal(achievement.weight_lbs)} lb"

    if achievement.completed:
        return format_time(achievement.time_seconds)

    if achievement.reps_completed is not None:
        return f"{achievement.reps_completed} reps"

    return "Sin score"


def format_result_format(value: str) -> str:
    return "RX" if value == "rx" else "Escalado"


def get_classifier_wod_report(session: Session) -> dict:
    rows = session.exec(
        select(Achievement, Athlete, Challenge)
        .join(Athlete, Achievement.athlete_id == Athlete.id)
        .join(Challenge, Achievement.challenge_id == Challenge.id)
        .where(
            Achievement.status == "approved",
            Achievement.rank_points.is_not(None),
        )
        .order_by(
            Athlete.full_name.asc(),
            Challenge.end_date.asc(),
            Challenge.title.asc(),
            Achievement.result_format.asc(),
        )
    ).all()

    report_rows = [
        {
            "athlete_id": athlete.id,
            "athlete_name": athlete.full_name,
            "athlete_level": athlete.level,
            "challenge_id": challenge.id,
            "challenge_title": challenge.title,
            "challenge_end_date": challenge.end_date,
            "result_format": achievement.result_format,
            "score_label": format_score(achievement),
            "completed": achievement.completed,
            "time_seconds": achievement.time_seconds,
            "reps_completed": achievement.reps_completed,
            "weight_lbs": achievement.weight_lbs,
            "tie_break_order": achievement.tie_break_order,
            "rank_points": achievement.rank_points,
            "achievement_date": achievement.achievement_date,
        }
        for achievement, athlete, challenge in rows
        if achievement.rank_points is not None
    ]

    return {
        "generated_at": datetime.now(UTC),
        "total_rows": len(report_rows),
        "rows": report_rows,
    }


def build_classifier_wod_report_pdf(report: dict) -> bytes:
    buffer = BytesIO()
    document = SimpleDocTemplate(
        buffer,
        pagesize=landscape(letter),
        leftMargin=0.35 * inch,
        rightMargin=0.35 * inch,
        topMargin=0.4 * inch,
        bottomMargin=0.4 * inch,
    )
    styles = getSampleStyleSheet()
    story = [
        Paragraph("Reporte WODs clasificatorios", styles["Title"]),
        Paragraph(
            f"Generado: {report['generated_at'].strftime('%Y-%m-%d %H:%M')} UTC · "
            f"{report['total_rows']} registros",
            styles["Normal"],
        ),
        Spacer(1, 0.18 * inch),
    ]

    table_data = [
        [
            "Atleta",
            "Nivel",
            "WOD",
            "Cierre",
            "Formato",
            "Score",
            "Tie-break",
            "Puntos",
            "Registro",
        ]
    ]
    for row in report["rows"]:
        table_data.append(
            [
                row["athlete_name"],
                row["athlete_level"],
                row["challenge_title"],
                row["challenge_end_date"].isoformat(),
                format_result_format(row["result_format"]),
                row["score_label"],
                row["tie_break_order"] if row["tie_break_order"] is not None else "-",
                row["rank_points"],
                row["achievement_date"].isoformat(),
            ]
        )

    if len(table_data) == 1:
        table_data.append(["Sin registros clasificatorios", "", "", "", "", "", "", "", ""])

    table = Table(
        table_data,
        repeatRows=1,
        colWidths=[1.4 * inch, 0.72 * inch, 1.55 * inch, 0.72 * inch, 0.72 * inch, 0.9 * inch, 0.72 * inch, 0.58 * inch, 0.78 * inch],
    )
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0f172a")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 8),
                ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#cbd5e1")),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 4),
                ("RIGHTPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    story.append(table)
    document.build(story)
    return buffer.getvalue()
