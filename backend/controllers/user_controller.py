import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from db import get_db
from model import User
from schemas.user_schema import UserResponse
from services.user_service import get_users


logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/users", response_model=list[UserResponse])
def list_users(db: Session = Depends(get_db)) -> list[User]:
    try:
        return get_users(db)
    except SQLAlchemyError:
        db.rollback()
        logger.exception("Failed to fetch users")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to fetch users",
        ) from None
