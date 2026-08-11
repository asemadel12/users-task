import logging
import os
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from db import Base, SessionLocal, engine, get_db
from model import User
from schema import UserResponse


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SAMPLE_USERS = (
    {"name": "Demo User", "email": "demo@example.com"},
    {"name": "Sample User", "email": "sample@example.com"},
)


def initialize_database() -> None:
    logger.info("Initializing database")

    try:
        Base.metadata.create_all(bind=engine)
    except SQLAlchemyError:
        logger.exception("Failed to create database tables")
        raise

    with SessionLocal() as db:
        try:
            sample_emails = [user["email"] for user in SAMPLE_USERS]
            existing_emails = set(
                db.scalars(
                    select(User.email).where(User.email.in_(sample_emails))
                ).all()
            )
            missing_users = [
                User(name=user["name"], email=user["email"])
                for user in SAMPLE_USERS
                if user["email"] not in existing_emails
            ]

            if missing_users:
                db.add_all(missing_users)
                db.commit()
                logger.info("Created %d sample user(s)", len(missing_users))
        except SQLAlchemyError:
            db.rollback()
            logger.exception("Failed to initialize sample user data")
            raise

    logger.info("Database initialization complete")


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    initialize_database()
    yield


app = FastAPI(title="MAKE WORK FLOW Users API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["Accept"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/users", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)) -> list[User]:
    try:
        return list(db.scalars(select(User).order_by(User.id)).all())
    except SQLAlchemyError:
        db.rollback()
        logger.exception("Failed to fetch users")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to fetch users",
        ) from None
