from datetime import datetime
from sqlalchemy import Column, DateTime, Integer, JSON, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database.session import Base

class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    site_id = Column(Integer, ForeignKey("heritage_sites.id"), nullable=True)
    dynasty = Column(String(100), nullable=False)
    question = Column(Text, nullable=False)
    option_a = Column(String(255), nullable=False)
    option_b = Column(String(255), nullable=False)
    option_c = Column(String(255), nullable=False)
    option_d = Column(String(255), nullable=False)
    correct_option = Column(String(10), nullable=False)  # "A", "B", "C", or "D"
    explanation = Column(Text, nullable=False)
    difficulty = Column(String(50), default="Medium")
    language = Column(String(10), default="en")
    topic = Column(String(100), nullable=False, default="Tamil Culture")
    question_ta = Column(Text, nullable=True)
    options_ta = Column(JSON, nullable=True)
    explanation_ta = Column(Text, nullable=True)

    site = relationship("HeritageSite", back_populates="quizzes")


class QuizSubmission(Base):
    __tablename__ = "quiz_submissions"

    id = Column(Integer, primary_key=True, index=True)
    participant_name = Column(String(150), nullable=False, default="Heritage Explorer")
    difficulty = Column(String(50), nullable=False)
    score = Column(Integer, nullable=False)
    total = Column(Integer, nullable=False)
    percentage = Column(Integer, nullable=False)
    rank_title_en = Column(String(100), nullable=False)
    rank_title_ta = Column(String(100), nullable=False)
    feedback = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
