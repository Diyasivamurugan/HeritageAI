from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.rag_service import search_and_retrieve_rag_context
from app.services.gemini_service import answer_rag_query

router = APIRouter(prefix="/api/chat", tags=["Multilingual RAG Chatbot"])

FOLLOWUP_QUESTIONS = {
    "en": [
        "How was the 80-tonne granite capstone placed on Thanjavur temple?",
        "What do the rock bas-reliefs in Mahabalipuram signify?",
        "Why is Meenakshi Amman temple considered an architectural labyrinth?",
        "What is the story behind the Lion Well at Gangaikonda Cholapuram?",
        "Why was Gingee Fort called the 'Troy of the East'?"
    ],
    "ta": [
        "தஞ்சைப் பெரிய கோயில் விமானத்தின் உச்சிக்கு 80 டன் கல் எவ்வாறு ஏற்றப்பட்டது?",
        "மாமல்லபுரம் அர்ச்சுனன் தவம் பாறைச் சிற்பத்தின் தாத்பரியம் என்ன?",
        "மதுரை ஆயிரங்கால் மண்டபத்தின் தனிச்சிறப்பு என்ன?",
        "கங்கைகொண்ட சோழபுரத்தின் சிங்கமுகக் கிணற்றின் வரலாறு என்ன?",
        "செஞ்சிக் கோட்டை ஏன் 'கிழக்கின் ட்ராய்' என்று அழைக்கப்பட்டது?"
    ]
}

@router.post("/ask", response_model=ChatResponse)
def ask_heritage_bot(payload: ChatRequest, db: Session = Depends(get_db)):
    """
    RAG-grounded conversational endpoint. Retrieves facts from SQLite, prompts Gemini AI,
    and returns verified historical answers with source citations.
    """
    # Step 1: Retrieve context and citations
    context, citations = search_and_retrieve_rag_context(
        db=db,
        query=payload.query,
        selected_monument_id=payload.selected_monument_id,
        language=payload.language
    )

    # Step 2: Generate response using Gemini AI or contextual fallback
    ai_response = answer_rag_query(
        query=payload.query,
        language=payload.language,
        context_bundle=context
    )

    # Step 3: Provide dynamic follow-up suggestions
    followups = FOLLOWUP_QUESTIONS.get(payload.language, FOLLOWUP_QUESTIONS["en"])

    return ChatResponse(
        reply=ai_response["reply"],
        language=payload.language,
        citations=citations[:3],
        suggested_followups=followups[:3]
    )
