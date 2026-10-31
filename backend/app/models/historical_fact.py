from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database.session import Base

class HistoricalFact(Base):
    """
    Verified historical facts for RAG context retrieval and factual grounding.
    """
    __tablename__ = "historical_facts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    site_id = Column(Integer, ForeignKey("heritage_sites.id"), nullable=False)
    category = Column(String(100), nullable=False)  # Architecture, Epigraphy, Trade, Military
    fact_text = Column(Text, nullable=False)
    source_reference = Column(String(255), nullable=False, default="Archaeological Survey of India (ASI) / UNESCO")

    site = relationship("HeritageSite", back_populates="facts")
