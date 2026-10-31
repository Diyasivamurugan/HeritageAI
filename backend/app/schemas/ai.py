from typing import List, Optional
from pydantic import BaseModel, Field

class SourceCitation(BaseModel):
    monument_name: str
    category: str
    fact_snippet: str
    source: str

class AIChatRequest(BaseModel):
    query: str = Field(..., description="User question regarding South Indian cultural heritage")
    language: str = Field("en", description="Language code: 'en' for English or 'ta' for Tamil")
    site_id: Optional[int] = Field(None, description="Optional specific heritage site ID to focus RAG grounding")

class AIChatResponse(BaseModel):
    reply: str
    language: str
    citations: List[SourceCitation] = []
    suggested_followups: List[str] = []
    grounded_on_db: bool = True
    is_fallback: bool = False

class AIStoryRequest(BaseModel):
    site_id: int = Field(..., description="Target heritage site ID")
    category: str = Field(
        "Architecture & Engineering", 
        description="Story category: Architecture & Engineering, Royal Court & Epics, Maritime Trade & Travelers, Spiritual & Temple Life, or Military Strategy"
    )
    persona: Optional[str] = Field("Royal Architect", description="Narrator persona")
    tone: Optional[str] = Field("Dramatic", description="Narrative tone: Dramatic, Poetic, Educational")
    language: str = Field("en", description="Language code: 'en' for English, 'ta' for Tamil")

class AIStoryResponse(BaseModel):
    id: Optional[int] = None
    site_id: int
    site_name: str
    site_name_ta: Optional[str] = None
    category: str
    persona: str
    language: str
    title: str
    narrative: str
    audio_url: Optional[str] = None
    information_source: str
    is_fallback: bool = False
