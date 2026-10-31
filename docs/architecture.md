# HeritageAI Architecture Specification

## 1. Executive Summary
**HeritageAI** is an AI-powered cultural heritage exploration and local-language storytelling platform focusing on Tamil Nadu's monuments, dynasties (Chola, Pallava, Pandya, Nayaka), and architectural achievements.

The platform integrates:
- **FastAPI (Python)** backend with SQLite database and SQLAlchemy ORM.
- **Retrieval-Augmented Generation (RAG)** grounded on Archaeological Survey of India (ASI) verified records.
- **Google Gemini API** for persona-driven historical storytelling and multilingual conversational interaction.
- **React 18 + Vite + Tailwind CSS** frontend with a royal color palette (Navy, Gold, Warm Cream).
- **Interactive Leaflet mapping** for geospatial heritage navigation.
- **Bilingual Text-to-Speech (TTS)** audio narration (Tamil & English).

---

## 2. Architectural Layers

### A. Presentation Layer (Frontend)
- **Framework**: React 18, Vite
- **Styling**: Tailwind CSS with custom royal aesthetic theme:
  - Deep Navy: `#0A1128`, `#0F172A`
  - Antique Gold: `#D4AF37`, `#C5A059`, `#B8860B`
  - Warm Cream / Parchment: `#FAF7F2`, `#F5EFEB`
- **Iconography**: Lucide React
- **Geospatial**: Leaflet / React-Leaflet
- **Speech Engine**: Web Speech API (`SpeechSynthesis`) with dynamic voice matching for Tamil (`ta-IN`) and English (`en-IN`/`en-US`), with backend MP3 fallback.

### B. Application & AI Layer (Backend)
- **Framework**: FastAPI (Asynchronous Python REST API)
- **RAG Grounding**: Queries are augmented using exact verified historical facts from SQLite to eliminate model hallucinations.
- **AI Engine**: Google Gemini API (`gemini-1.5-flash`), with deterministic high-fidelity fallbacks when offline or without API key.
- **Audio Service**: Server-side `gTTS` audio synthesis for high-fidelity audio streams.

### C. Data Persistence Layer
- **Database**: SQLite (`heritage.db`)
- **ORM**: SQLAlchemy 2.0
- **Tables**:
  - `heritage_monuments`: Rulers, eras, coordinates, architectural styles, and histories.
  - `architectural_highlights`: Specific structural marvels (e.g., 80-tonne Kumbam, Thousand Pillar Hall).
  - `historical_facts`: Ground-truth historical data points for RAG context verification.
  - `story_archives`: Generated narratives and perspectives.
  - `quiz_questions`: Bilingual multiple-choice questions with historical explanations.
  - `quiz_submissions`: User scores and rank badges.
