from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class QuizQuestionResponse(BaseModel):
    id: int
    site_id: Optional[int] = None
    dynasty: str
    topic: str
    question_en: str
    question_ta: str
    options_en: List[str] = Field(min_length=4, max_length=4)
    options_ta: List[str] = Field(min_length=4, max_length=4)
    difficulty: str

    model_config = {"from_attributes": True}

class SingleAnswerCheck(BaseModel):
    question_id: int = Field(ge=1)
    selected_option_index: int = Field(ge=0, le=3)

class QuizSubmitRequest(BaseModel):
    participant_name: str = Field(default="Heritage Explorer", max_length=150)
    difficulty: Optional[str] = Field(default=None, pattern="^(Beginner|Intermediate|Advanced)$")
    answers: List[SingleAnswerCheck] = Field(min_length=1)

class AnswerCheckRequest(SingleAnswerCheck):
    pass

class QuestionFeedback(BaseModel):
    question_id: int
    correct: bool
    correct_index: int
    selected_index: Optional[int] = None
    explanation_en: str
    explanation_ta: str

class QuizResultResponse(BaseModel):
    submission_id: Optional[int] = None
    score: int
    total: int
    percentage: int
    rank_title_en: str
    rank_title_ta: str
    feedback: List[QuestionFeedback]
    difficulty: Optional[str] = None
    created_at: Optional[datetime] = None

class AnswerFeedback(BaseModel):
    question_id: int
    correct: bool
    correct_index: int
    selected_index: int
    explanation_en: str
    explanation_ta: str
