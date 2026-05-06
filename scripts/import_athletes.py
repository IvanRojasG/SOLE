from __future__ import annotations

import argparse
import json
from dataclasses import dataclass
from pathlib import Path
import sys
from typing import Any

from email_validator import EmailNotValidError, validate_email
from sqlmodel import Session, select

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.core.db import engine
from app.core.security import hash_password
from app.models.all_models import Athlete, User


DEFAULT_PASSWORD = "Sole12345!"
DEFAULT_LEVEL = "scaled"


@dataclass(frozen=True)
class AthleteImportRecord:
    full_name: str
    email: str


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Import existing athletes from a JSON file into users and athletes.",
    )
    parser.add_argument(
        "json_path",
        type=Path,
        help="Path to a JSON file containing a list of athletes with name and email.",
    )
    return parser.parse_args()


def normalize_email(value: str) -> str:
    validation = validate_email(value, check_deliverability=False)
    return validation.normalized.lower()


def load_records(json_path: Path) -> list[AthleteImportRecord]:
    if not json_path.exists():
        raise ValueError(f"JSON file not found: {json_path}")

    try:
        payload = json.loads(json_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise ValueError(f"Invalid JSON: {exc.msg} at line {exc.lineno}, column {exc.colno}") from exc

    if not isinstance(payload, list):
        raise ValueError("Invalid JSON: expected a list of athlete objects.")

    records: list[AthleteImportRecord] = []
    errors: list[str] = []
    seen_emails: set[str] = set()

    for index, item in enumerate(payload, start=1):
        if not isinstance(item, dict):
            errors.append(f"Item {index}: expected an object with name and email.")
            continue

        name_value = item.get("name")
        email_value = item.get("email")

        full_name = name_value.strip() if isinstance(name_value, str) else ""
        raw_email = email_value.strip() if isinstance(email_value, str) else ""

        if not full_name:
            errors.append(f"Item {index}: name is required.")

        if not raw_email:
            errors.append(f"Item {index}: email is required.")
            continue

        try:
            email = normalize_email(raw_email)
        except EmailNotValidError as exc:
            errors.append(f"Item {index}: invalid email {raw_email!r}: {exc}")
            continue

        if email in seen_emails:
            errors.append(f"Item {index}: duplicate email in JSON: {email}")
            continue

        seen_emails.add(email)

        if full_name:
            records.append(AthleteImportRecord(full_name=full_name, email=email))

    if errors:
        error_text = "\n".join(f"- {error}" for error in errors)
        raise ValueError(f"Import validation failed:\n{error_text}")

    return records


def import_records(records: list[AthleteImportRecord]) -> dict[str, Any]:
    created: list[str] = []
    skipped: list[str] = []

    with Session(engine) as session:
        for record in records:
            existing_user = session.exec(select(User).where(User.email == record.email)).first()
            if existing_user:
                skipped.append(record.email)
                continue

            user = User(
                email=record.email,
                password_hash=hash_password(DEFAULT_PASSWORD),
                role="athlete",
                is_active=True,
            )
            session.add(user)
            session.flush()

            athlete = Athlete(
                user_id=user.id,
                full_name=record.full_name,
                level=DEFAULT_LEVEL,
            )
            session.add(athlete)
            created.append(record.email)

        session.commit()

    return {
        "created": created,
        "skipped": skipped,
    }


def main() -> None:
    args = parse_args()

    try:
        records = load_records(args.json_path)
    except ValueError as exc:
        print(exc)
        raise SystemExit(1) from exc

    result = import_records(records)

    print("athlete import complete")
    print(f"- source: {args.json_path}")
    print(f"- created: {len(result['created'])}")
    print(f"- skipped existing: {len(result['skipped'])}")
    print(f"- default password: {DEFAULT_PASSWORD}")
    print(f"- default level: {DEFAULT_LEVEL}")

    if result["skipped"]:
        print("skipped emails:")
        for email in result["skipped"]:
            print(f"- {email}")


if __name__ == "__main__":
    main()
