from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database.session import Base

class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    id = Column(Integer, primary_key=True, index=True)
    monument_id = Column(Integer, ForeignKey("heritage_monuments.id"), nullable=True)
    dynasty = Column(String(100), nullable=False)
    question_en = Column(Text, nullable=False)
    question_ta = Column(Text, nullable=False)
    options_en = Column(JSON, nullable=False)       # List of 4 string options
    options_ta = Column(JSON, nullable=False)       # List of 4 string options
    correct_index = Column(Integer, nullable=False)  # 0 to 3
    explanation_en = Column(Text, nullable=False)
    explanation_ta = Column(Text, nullable=False)
    difficulty = Column(String(50), default="Medium")

    monument = relationship("HeritageMonument", back_populates="quizzes")


class QuizSubmission(Base):
    __tablename__ = "quiz_submissions"

    id = Column(Integer, primary_key=True, index=True)
    participant_name = Column(String(150), default="Heritage Explorer")
    score = Column(Integer, nullable=False)
    total = Column(Integer, nullable=False)
    percentage = Column(Integer, nullable=False)
    rank_title_en = Column(String(100), nullable=False)
    rank_title_ta = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
