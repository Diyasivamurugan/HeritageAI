from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.session import Base

class StoryArchive(Base):
    __tablename__ = "story_archives"

    id = Column(Integer, primary_key=True, index=True)
    monument_id = Column(Integer, ForeignKey("heritage_monuments.id"), nullable=False)
    persona = Column(String(100), nullable=False)  # Architect, Chronicler, Traveler, Devotee
    perspective_label_en = Column(String(150), nullable=False)
    perspective_label_ta = Column(String(150), nullable=False)
    language = Column(String(10), default="en")   # 'en' or 'ta'
    title = Column(String(255), nullable=False)
    narrative = Column(Text, nullable=False)
    audio_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    monument = relationship("HeritageMonument", back_populates="stories")
