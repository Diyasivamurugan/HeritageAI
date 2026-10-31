import os
from typing import Optional
from fastapi import APIRouter, HTTPException, Query, status
from fastapi.responses import FileResponse, Response
from pydantic import BaseModel, Field

from app.services.tts_service import (
    synthesize_story_audio,
    get_cached_audio_path,
    generate_tts_audio_stream
)

router = APIRouter(prefix="/api/tts", tags=["Text-to-Speech Audio Storytelling"])

class TTSSynthesizeRequest(BaseModel):
    text: str = Field(..., min_length=5, description="Complete story text to convert into audio")
    language: str = Field("en", description="Language code: 'ta' for Tamil, 'en' for English")
    title: Optional[str] = Field("Heritage Audio Story", description="Story title")
    story_id: Optional[int] = Field(None, description="Optional associated story ID")

class TTSSynthesizeResponse(BaseModel):
    audio_url: str
    download_url: str
    audio_hash: str
    language: str
    language_label: str
    title: str
    status: str

@router.post("/synthesize", response_model=TTSSynthesizeResponse)
def synthesize_story_to_audio(payload: TTSSynthesizeRequest):
    """
    Converts a complete generated story into high-quality Tamil or English MP3 audio.
    Caches the audio on disk for instantaneous subsequent playback.
    """
    cache_path, audio_hash = synthesize_story_audio(payload.text, payload.language)
    
    if not cache_path or not os.path.exists(cache_path):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate audio in backend. Please verify network or fallback to browser speech synthesis."
        )

    lang_label = "Tamil Narration (தமிழ்)" if payload.language == "ta" else "English Narration (English)"

    return TTSSynthesizeResponse(
        audio_url=f"/api/tts/stream/{audio_hash}",
        download_url=f"/api/tts/download/{audio_hash}",
        audio_hash=audio_hash,
        language=payload.language,
        language_label=lang_label,
        title=payload.title or "Historical Audio Story",
        status="ready"
    )

@router.get("/stream/{audio_hash}")
def stream_audio(audio_hash: str):
    """
    Streams the synthesized MP3 audio with full byte-range support for seeking in HTML5 audio players.
    """
    file_path = get_cached_audio_path(audio_hash)
    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Audio file not found or has not been generated yet."
        )

    return FileResponse(
        path=file_path,
        media_type="audio/mpeg",
        headers={
            "Accept-Ranges": "bytes",
            "Content-Disposition": f"inline; filename={audio_hash}.mp3"
        }
    )

@router.get("/download/{audio_hash}")
def download_audio(audio_hash: str):
    """
    Downloads the synthesized MP3 narration audio file.
    """
    file_path = get_cached_audio_path(audio_hash)
    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Audio file not found."
        )

    return FileResponse(
        path=file_path,
        media_type="audio/mpeg",
        filename=f"heritage_story_{audio_hash[:8]}.mp3",
        headers={
            "Content-Disposition": f"attachment; filename=heritage_story_{audio_hash[:8]}.mp3"
        }
    )
