from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

class HistoricalFactResponse(BaseModel):
    id: int
    site_id: int
    category: str
    fact_text: str
    source_reference: str

    class Config:
        from_attributes = True


class HeritageStoryResponse(BaseModel):
    id: int
    site_id: int
    title: str
    persona: str
    narrative: str
    language: str
    audio_url: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class QuizQuestionResponse(BaseModel):
    id: int
    site_id: Optional[int]
    dynasty: str
    question: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_option: str
    explanation: str
    difficulty: str
    language: str

    class Config:
        from_attributes = True


class HeritageSiteBase(BaseModel):
    name: str
    description: str
    historical_background: str
    architecture: str
    cultural_significance: str
    location: str
    latitude: float
    longitude: float
    image_url: str
    information_source: str
    slug: str
    name_ta: Optional[str] = None
    dynasty: str
    century_ce: int
    is_unesco: bool = False


class HeritageSiteCreate(HeritageSiteBase):
    pass


class HeritageSiteUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    historical_background: Optional[str] = None
    architecture: Optional[str] = None
    cultural_significance: Optional[str] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    image_url: Optional[str] = None
    information_source: Optional[str] = None
    dynasty: Optional[str] = None
    is_unesco: Optional[bool] = None


class HeritageSiteResponse(HeritageSiteBase):
    id: int
    facts: List[HistoricalFactResponse] = []
    stories: List[HeritageStoryResponse] = []
    quizzes: List[QuizQuestionResponse] = []

    class Config:
        from_attributes = True
