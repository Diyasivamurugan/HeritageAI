from sqlalchemy import Column, Integer, String, Text, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database.session import Base

class HeritageMonument(Base):
    __tablename__ = "heritage_monuments"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    name_en = Column(String(200), nullable=False)
    name_ta = Column(String(200), nullable=False)
    dynasty = Column(String(100), index=True, nullable=False)
    built_by_en = Column(String(200), nullable=False)
    built_by_ta = Column(String(200), nullable=False)
    century_ce = Column(Integer, nullable=False)
    period = Column(String(100), nullable=False)
    district = Column(String(100), index=True, nullable=False)
    state = Column(String(100), default="Tamil Nadu")
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    is_unesco = Column(Boolean, default=False)
    architectural_style_en = Column(String(200), nullable=False)
    architectural_style_ta = Column(String(200), nullable=False)
    hero_image = Column(String(500), nullable=False)
    short_desc_en = Column(Text, nullable=False)
    short_desc_ta = Column(Text, nullable=False)
    full_history_en = Column(Text, nullable=False)
    full_history_ta = Column(Text, nullable=False)
    significance_en = Column(Text, nullable=False)
    significance_ta = Column(Text, nullable=False)

    # Relationships
    highlights = relationship("ArchitecturalHighlight", back_populates="monument", cascade="all, delete-orphan")
    facts = relationship("HistoricalFact", back_populates="monument", cascade="all, delete-orphan")
    stories = relationship("StoryArchive", back_populates="monument", cascade="all, delete-orphan")
    quizzes = relationship("QuizQuestion", back_populates="monument", cascade="all, delete-orphan")


class ArchitecturalHighlight(Base):
    __tablename__ = "architectural_highlights"

    id = Column(Integer, primary_key=True, index=True)
    monument_id = Column(Integer, ForeignKey("heritage_monuments.id"), nullable=False)
    title_en = Column(String(255), nullable=False)
    title_ta = Column(String(255), nullable=False)
    description_en = Column(Text, nullable=False)
    description_ta = Column(Text, nullable=False)
    image_url = Column(String(500), nullable=True)

    monument = relationship("HeritageMonument", back_populates="highlights")


class HistoricalFact(Base):
    """Verified historical facts for RAG context retrieval and anti-hallucination grounding."""
    __tablename__ = "historical_facts"

    id = Column(Integer, primary_key=True, index=True)
    monument_id = Column(Integer, ForeignKey("heritage_monuments.id"), nullable=False)
    category = Column(String(100), nullable=False) # e.g. Architecture, Epigraphy, Warfare, Royalty
    fact_en = Column(Text, nullable=False)
    fact_ta = Column(Text, nullable=False)
    citation = Column(String(255), default="Archaeological Survey of India (ASI) / UNESCO")

    monument = relationship("HeritageMonument", back_populates="facts")
