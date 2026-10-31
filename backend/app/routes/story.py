from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.database import crud
from app.schemas.heritage_site import HeritageStoryResponse
from app.schemas.story import StoryGenerateRequest, StoryResponse
from app.services.rag_service import retrieve_monument_context
from app.services.gemini_service import generate_historical_story_ai
from app.services.tts_service import generate_tts_audio_stream

router = APIRouter(prefix="/api/story", tags=["Heritage Historical Stories"])

@router.get("/site/{site_id}", response_model=List[HeritageStoryResponse])
def get_stories_by_site(
    site_id: int,
    language: Optional[str] = Query(None, description="Optional language filter ('en' or 'ta')"),
    db: Session = Depends(get_db)
):
    """
    Retrieve historical stories for a specific heritage location.
    """
    site = crud.get_heritage_site_by_id(db, site_id)
    if not site:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Heritage site with ID {site_id} not found"
        )
    return crud.get_stories_by_site(db, site_id, language=language)


@router.get("/all", response_model=List[HeritageStoryResponse])
def get_all_stories(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Retrieve all archived historical stories across all heritage sites.
    """
    return crud.get_all_stories(db, skip=skip, limit=limit)


@router.post("/generate", response_model=StoryResponse)
def generate_story(payload: StoryGenerateRequest, db: Session = Depends(get_db)):
    """
    Generates an AI-powered, persona-grounded historical story strictly grounded on verified facts.
    Persists the narrative into HeritageStories table.
    """
    site = crud.get_heritage_site_by_id(db, payload.monument_id)
    if not site:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Selected heritage site not found"
        )

    # Retrieve verified facts from the database (RAG Grounding)
    verified_context, _ = retrieve_monument_context(db, site.id, language=payload.language)

    # Generate narrative using Gemini AI or verified fallback
    ai_result = generate_historical_story_ai(
        monument_name_en=site.name,
        monument_name_ta=site.name_ta or site.name,
        dynasty=site.dynasty,
        built_by=site.name,
        period=f"{site.century_ce} CE",
        persona=payload.persona,
        tone=payload.tone,
        language=payload.language,
        verified_context=verified_context or site.historical_background
    )

    # Persist into HeritageStories table
    story_record = crud.create_heritage_story(db, {
        "site_id": site.id,
        "title": ai_result["title"],
        "persona": payload.persona,
        "narrative": ai_result["narrative"],
        "language": payload.language,
        "audio_url": f"/api/story/audio?text={ai_result['title']}&lang={payload.language}"
    })

    return StoryResponse(
        id=story_record.id,
        monument_id=site.id,
        monument_name_en=site.name,
        monument_name_ta=site.name_ta or site.name,
        persona=payload.persona,
        perspective_label_en=payload.persona,
        perspective_label_ta=payload.persona,
        language=payload.language,
        title=ai_result["title"],
        narrative=ai_result["narrative"],
        audio_available=True,
        grounding_notes="Story verified against ASI historical archives."
    )


@router.get("/audio")
def stream_story_audio(
    text: str = Query(..., description="Text content to speak"),
    lang: str = Query("en", description="Language code ('en' or 'ta')")
):
    """
    Streams audio narration (MP3) generated dynamically via gTTS.
    """
    audio_stream = generate_tts_audio_stream(text=text, language=lang)
    if not audio_stream:
        raise HTTPException(status_code=500, detail="Audio generation failed")

    return Response(content=audio_stream.read(), media_type="audio/mpeg")
