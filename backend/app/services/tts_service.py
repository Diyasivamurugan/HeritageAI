import os
import io
import hashlib
import logging
from typing import Optional, Tuple

logger = logging.getLogger(__name__)

# Cache directory for synthesized audio files
AUDIO_CACHE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data", "audio_cache"))
os.makedirs(AUDIO_CACHE_DIR, exist_ok=True)

def get_audio_hash(text: str, language: str) -> str:
    """Generates an MD5 fingerprint for the audio request."""
    key = f"{language}:{text.strip()}"
    return hashlib.md5(key.encode("utf-8")).hexdigest()

def get_cached_audio_path(audio_hash: str) -> str:
    """Returns the absolute file path for a cached MP3 file."""
    return os.path.join(AUDIO_CACHE_DIR, f"{audio_hash}.mp3")

def synthesize_story_audio(text: str, language: str = "en") -> Tuple[Optional[str], str]:
    """
    Synthesizes complete story audio into an MP3 file on disk using gTTS.
    Supports:
      - 'ta': Tamil narration
      - 'en': English narration
    
    Returns:
      (file_path, audio_hash)
    """
    if not text or not text.strip():
        return None, ""

    audio_hash = get_audio_hash(text, language)
    cache_path = get_cached_audio_path(audio_hash)

    # 1. Return from disk cache if already synthesized
    if os.path.exists(cache_path) and os.path.getsize(cache_path) > 0:
        logger.info(f"Audio cache hit for hash: {audio_hash} ({language})")
        return cache_path, audio_hash

    # 2. Synthesize using gTTS (Google Text-to-Speech)
    try:
        from gtts import gTTS
        # gTTS language code: 'ta' for Tamil, 'en' for English
        lang_code = "ta" if language == "ta" else "en"
        tld = "co.in" if language == "en" else "com" # Use Indian accent for English

        # Synthesize complete story text
        tts = gTTS(text=text.strip(), lang=lang_code, tld=tld, slow=False)
        tts.save(cache_path)
        logger.info(f"Synthesized new MP3 audio ({language}): {cache_path}")
        return cache_path, audio_hash
    except Exception as e:
        logger.error(f"Backend TTS audio synthesis error with gTTS: {e}")
        return None, audio_hash

def generate_tts_audio_stream(text: str, language: str = "en") -> Optional[io.BytesIO]:
    """
    Generates an in-memory MP3 audio stream for on-the-fly streaming.
    """
    cache_path, _ = synthesize_story_audio(text, language)
    if cache_path and os.path.exists(cache_path):
        with open(cache_path, "rb") as f:
            return io.BytesIO(f.read())

    # In-memory fallback attempt
    try:
        from gtts import gTTS
        lang_code = "ta" if language == "ta" else "en"
        tts = gTTS(text=text.strip(), lang=lang_code, slow=False)
        fp = io.BytesIO()
        tts.write_to_fp(fp)
        fp.seek(0)
        return fp
    except Exception as e:
        logger.error(f"In-memory stream error: {e}")
        return None
