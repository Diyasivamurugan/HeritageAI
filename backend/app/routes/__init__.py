from app.routes.heritage import router as heritage_router
from app.routes.story import router as story_router
from app.routes.chat import router as chat_router
from app.routes.quiz import router as quiz_router
from app.routes.language import router as language_router
from app.routes.ai import router as ai_router
from app.routes.tts import router as tts_router

__all__ = [
    "heritage_router",
    "story_router",
    "chat_router",
    "quiz_router",
    "language_router",
    "ai_router",
    "tts_router"
]
