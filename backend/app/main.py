import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment configuration
load_dotenv()

from app.database.session import init_db
from app.routes.heritage import router as heritage_router
from app.routes.story import router as story_router
from app.routes.chat import router as chat_router
from app.routes.quiz import router as quiz_router
from app.routes.language import router as language_router
from app.routes.ai import router as ai_router
from app.routes.tts import router as tts_router

# Initialize SQLite Database & Seed Data automatically on application load
init_db()

# Create FastAPI Application Instance
app = FastAPI(
    title="HeritageAI API",
    description="Complete AI-Powered Cultural Heritage Explorer & Local-Language Storytelling Platform Backend",
    version="1.0.0"
)

# CORS Configuration
origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register REST Routers
app.include_router(heritage_router)
app.include_router(story_router)
app.include_router(chat_router)
app.include_router(quiz_router)
app.include_router(language_router)
app.include_router(ai_router)
app.include_router(tts_router)

@app.get("/")
def root():
    return {
        "status": "online",
        "platform": "HeritageAI",
        "description": "AI-Powered Cultural Heritage Explorer & Local-Language Storytelling Platform",
        "docs_url": "/docs",
        "tts_endpoints": {
            "synthesize": "/api/tts/synthesize",
            "stream": "/api/tts/stream/{audio_hash}",
            "download": "/api/tts/download/{audio_hash}"
        },
        "ai_endpoints": {
            "ai_chat": "/api/ai/chat",
            "ai_story_generate": "/api/ai/generate-story"
        },
        "endpoints": {
            "heritage_list": "/api/heritage",
            "heritage_search": "/api/heritage/search?q={query}",
            "heritage_detail": "/api/heritage/{id_or_slug}",
            "heritage_stories": "/api/story/site/{site_id}",
            "quiz_questions": "/api/quiz/questions",
            "quiz_answer_check": "/api/quiz/answer",
            "quiz_submit": "/api/quiz/submit",
            "quiz_result": "/api/quiz/results/{submission_id}",
            "languages": "/api/languages"
        }
    }
