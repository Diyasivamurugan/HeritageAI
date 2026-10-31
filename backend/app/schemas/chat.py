from typing import List, Optional
from pydantic import BaseModel

class SourceCitation(BaseModel):
    monument_name: str
    category: str
    fact_snippet: str
    source: str

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    query: str
    language: str = "en"  # "en" or "ta"
    selected_monument_id: Optional[int] = None
    chat_history: Optional[List[ChatMessage]] = []

class ChatResponse(BaseModel):
    reply: str
    language: str
    citations: List[SourceCitation] = []
    suggested_followups: List[str] = []
