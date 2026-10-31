from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.ai import (
    AIChatRequest,
    AIChatResponse,
    AIStoryRequest,
    AIStoryResponse
)
from app.services.ai_service import (
    ask_heritage_chatbot,
    generate_ai_historical_story
)

router = APIRouter(prefix="/api/ai", tags=["Google Gen AI & RAG Engine"])

@router.post("/chat", response_model=AIChatResponse)
def ai_chat_endpoint(payload: AIChatRequest, db: Session = Depends(get_db)):
    """
    RAG-grounded Heritage Chatbot endpoint powered by Google Gemini AI.
    
    Workflow:
    1. Query received from user.
    2. Relevant historical facts retrieved from SQLite database.
    3. Context prepared and augmented with strict anti-hallucination directives.
    4. Gemini generates beginner-friendly, educational explanation in Tamil or English.
    5. Returns response with verified source citations.
    """
    try:
        result = ask_heritage_chatbot(
            db=db,
            query=payload.query,
            language=payload.language,
            site_id=payload.site_id
        )
        return AIChatResponse(**result)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI Chat Service Error: {str(e)}"
        )


@router.post("/generate-story", response_model=AIStoryResponse)
def ai_generate_story_endpoint(payload: AIStoryRequest, db: Session = Depends(get_db)):
    """
    Generates an authentic historical narrative based on:
    - User-selected heritage site
    - User-selected story category (Architecture, Royal Court, Maritime Trade, Devotion, Military)
    - User-selected persona and tone
    - Multilingual language selection (Tamil / English)
    
    Persists the narrative into the SQLite HeritageStories table.
    """
    try:
        result = generate_ai_historical_story(
            db=db,
            site_id=payload.site_id,
            category=payload.category,
            persona=payload.persona,
            tone=payload.tone,
            language=payload.language
        )
        return AIStoryResponse(**result)
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(ve)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI Storytelling Service Error: {str(e)}"
        )
