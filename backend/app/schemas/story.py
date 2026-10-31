from typing import Optional
from pydantic import BaseModel

class StoryGenerateRequest(BaseModel):
    monument_id: int
    persona: str = "Architect"  # Architect, Chronicler, Traveler, Devotee
    tone: str = "Dramatic"       # Dramatic, Poetic, Academic, Folk
    language: str = "en"         # "en" or "ta"
    custom_focus: Optional[str] = None

class StoryResponse(BaseModel):
    id: Optional[int] = None
    monument_id: int
    monument_name_en: str
    monument_name_ta: str
    persona: str
    perspective_label_en: str
    perspective_label_ta: str
    language: str
    title: str
    narrative: str
    audio_available: bool = True
    grounding_notes: Optional[str] = None
