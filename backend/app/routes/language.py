from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database.session import get_db
from app.database import crud

router = APIRouter(prefix="/api/languages", tags=["Languages"])

class LanguageResponse(BaseModel):
    id: int
    code: str
    name: str
    is_active: bool

    class Config:
        from_attributes = True

@router.get("", response_model=List[LanguageResponse])
def get_supported_languages(db: Session = Depends(get_db)):
    """
    Retrieve all active supported languages in HeritageAI.
    """
    return crud.get_all_languages(db)
