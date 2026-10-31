from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.session import Base

class HeritageStory(Base):
    __tablename__ = "heritage_stories"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    site_id = Column(Integer, ForeignKey("heritage_sites.id"), nullable=False)
    title = Column(String(255), nullable=False)
    persona = Column(String(100), nullable=False)  # e.g., Royal Architect, Court Poet, Silk-Route Traveler, Devotee
    narrative = Column(Text, nullable=False)
    language = Column(String(10), default="en")    # "en" or "ta"
    audio_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    site = relationship("HeritageSite", back_populates="stories")
