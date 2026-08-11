from sqlalchemy import select
from sqlalchemy.orm import Session

from model import User
from seeds.users import SAMPLE_USERS


def get_users(db: Session) -> list[User]:
    return list(db.scalars(select(User).order_by(User.id)).all())


def ensure_sample_users(db: Session) -> int:
    sample_emails = [user["email"] for user in SAMPLE_USERS]
    existing_emails = set(
        db.scalars(select(User.email).where(User.email.in_(sample_emails))).all()
    )
    missing_users = [
        User(name=user["name"], email=user["email"])
        for user in SAMPLE_USERS
        if user["email"] not in existing_emails
    ]

    if missing_users:
        db.add_all(missing_users)

    return len(missing_users)
