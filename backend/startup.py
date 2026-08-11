import logging

from sqlalchemy.exc import SQLAlchemyError

from db import Base, SessionLocal, engine
from services.user_service import ensure_sample_users


logger = logging.getLogger(__name__)


def initialize_database() -> None:
    logger.info("Initializing database")

    try:
        Base.metadata.create_all(bind=engine)
    except SQLAlchemyError:
        logger.exception("Failed to create database tables")
        raise

    with SessionLocal() as db:
        try:
            users_added = ensure_sample_users(db)
            db.commit()
            if users_added:
                logger.info("Created %d sample user(s)", users_added)
        except SQLAlchemyError:
            db.rollback()
            logger.exception("Failed to initialize sample user data")
            raise

    logger.info("Database initialization complete")
