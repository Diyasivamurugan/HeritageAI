from sqlalchemy import Column, Integer, String, Text, Float, Boolean
from sqlalchemy.orm import relationship
from app.database.session import Base

class HeritageSite(Base):
    __tablename__ = "heritage_sites"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=False)
    historical_background = Column(Text, nullable=False)
    architecture = Column(Text, nullable=False)
    cultural_significance = Column(Text, nullable=False)
    location = Column(String(255), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    image_url = Column(String(500), nullable=False)
    information_source = Column(String(255), nullable=False, default="Archaeological Survey of India (ASI) / UNESCO")

    # Companion fields for rich UI & filter routing
    slug = Column(String(100), unique=True, index=True, nullable=False)
    name_ta = Column(String(255), nullable=True)
    dynasty = Column(String(100), index=True, nullable=False)
    century_ce = Column(Integer, nullable=False)
    is_unesco = Column(Boolean, default=False)

    # Relational associations
    stories = relationship("HeritageStory", back_populates="site", cascade="all, delete-orphan")
    facts = relationship("HistoricalFact", back_populates="site", cascade="all, delete-orphan")
    quizzes = relationship("QuizQuestion", back_populates="site", cascade="all, delete-orphan")
