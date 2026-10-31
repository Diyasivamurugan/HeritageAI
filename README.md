# HERITAGEAI
### AI-Powered Cultural Heritage Explorer & Local-Language Storytelling Platform

[![Built with React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite%20%2B%20Tailwind-blue)](https://reactjs.org/)
[![Backend FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%2B%20Python-green)](https://fastapi.tiangolo.com/)
[![Database SQLite](https://img.shields.io/badge/Database-SQLite%20%2B%20SQLAlchemy-orange)](https://www.sqlite.org/)
[![AI Powered](https://img.shields.io/badge/AI-Google%20Gemini%20%2B%20RAG-purple)](https://ai.google.dev/)
[![Verified Data](https://img.shields.io/badge/Corpus-ASI%20%26%20UNESCO%20Verified-gold)](https://asi.nic.in/)

Developed as a major **Computer Science & Engineering Capstone Project**.

---

## 1. Project Overview

**HeritageAI** is an AI-powered cultural exploration and local-language storytelling platform celebrating the monuments, dynasties, and architectural marvels of South India (focusing on Tamil Nadu).

The platform bridges centuries of history with modern generative AI by offering:
- **Verified Archaeological Information**: Grounded on Archaeological Survey of India (ASI) and UNESCO records to eliminate AI hallucinations.
- **AI Historical Storytelling**: First-person narratives generated through the perspectives of a Royal Architect (Sthapati), Court Poet (Kavignar), Silk-Route Traveler, or Temple Devotee.
- **Multilingual RAG Chatbot ("Heritage Sage")**: Conversational AI companion providing verified answers and source citations in both Tamil (தமிழ்) and English.
- **Text-to-Speech (TTS) Narration**: Audio storytelling with speed control and dual-language vocalization.
- **Interactive Geospatial Heritage Map**: Visual exploration of ancient monuments with exact historical coordinates and links.
- **Cultural Knowledge Quiz Arena**: Gamified multiple-choice quiz system with detailed explanations and achievement certificates.

---

## 2. Initial Heritage Locations

1. **Brihadeeswarar Temple (Thanjavur)** — Built by Raja Raja Chola I (1010 CE); granite vimana, 80-tonne kumbam.
2. **Mahabalipuram Monuments (Mamallapuram)** — Built by Narasimhavarman I / Rajasimha Pallava (7th–8th Century CE); Pancha Rathas, Shore Temple.
3. **Meenakshi Amman Temple (Madurai)** — Pandyan origins expanded by Nayakas (16th–17th Century CE); 14 gopurams, Thousand Pillar Hall.
4. **Gangaikonda Cholapuram (Ariyalur)** — Built by Rajendra Chola I (1035 CE); commemorating the conquest of the Ganges.
5. **Gingee Fort (Viluppuram)** — "Troy of the East"; triangular hill fortress of Rajagiri, Krishnagiri, and Chandrayandurg.

---

## 3. Technology Stack

### Frontend
- **Framework**: React.js 18 with Vite
- **Styling**: Tailwind CSS with a luxury Royal Navy (`#0A1128`), Antique Gold (`#D4AF37`), and Warm Cream (`#FAF7F2`) palette.
- **Icons**: Lucide React
- **Audio & Speech**: Browser Web Speech API (`SpeechSynthesis`) with dynamic voice matching for Tamil (`ta-IN`) and English (`en-IN`/`en-US`).

### Backend
- **Framework**: Python 3 with FastAPI (Asynchronous REST API)
- **Web Server**: Uvicorn
- **Validation**: Pydantic v2
- **Audio Synthesis**: `gTTS` (Google Text-To-Speech) for server-side MP3 generation

### Database & ORM
- **Database**: SQLite 3 (`heritage.db`)
- **ORM**: SQLAlchemy 2.0 with transactional session dependencies

### Artificial Intelligence & RAG
- **Model**: Google Gemini API (`gemini-1.5-flash` / `gemini-2.5-flash`)
- **RAG Grounding**: Anti-hallucination factual retriever pulling verified facts from the SQLite database before prompt augmentation.
- **Resilient Fallback Mode**: Intelligent deterministic fallback ensuring 100% uptime during college demos and evaluations even if offline or without an API key.

---

## 4. Project Folder Structure

```text
HeritageAI/
│
├── backend/
│   ├── app/
│   │   ├── database/
│   │   │   ├── __init__.py
│   │   │   ├── session.py            # SQLite engine, SessionLocal & get_db dependency
│   │   │   └── seed_data.py          # ASI & UNESCO verified historical dataset
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── monument.py           # HeritageMonument, ArchitecturalHighlight, HistoricalFact
│   │   │   ├── story.py              # StoryArchive model
│   │   │   └── quiz.py               # QuizQuestion & QuizSubmission models
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── monument.py           # Pydantic schemas for monuments and highlights
│   │   │   ├── story.py              # Story generation request & response schemas
│   │   │   ├── chat.py               # RAG chat query and citation schemas
│   │   │   └── quiz.py               # Quiz questions and submission schemas
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── gemini_service.py     # Gemini AI client with fallback stories and RAG chat
│   │   │   ├── rag_service.py        # Factual database context retriever & citation builder
│   │   │   └── tts_service.py        # gTTS audio streaming service
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── heritage.py           # /api/heritage routes (list, filter, details)
│   │   │   ├── story.py              # /api/story routes (generate, audio stream)
│   │   │   ├── chat.py               # /api/chat routes (RAG assistant)
│   │   │   └── quiz.py               # /api/quiz routes (questions, evaluation)
│   │   └── main.py                   # FastAPI app, CORS, table creation & router registration
│   ├── requirements.txt              # Backend Python dependencies
│   ├── .env.example                  # Environment variables template
│   └── run.py                        # Backend runner script
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Royal navigation with language switcher & brand logo
│   │   │   ├── Footer.jsx            # Comprehensive footer with links & evaluation badge
│   │   │   ├── AudioPlayerBar.jsx    # Floating audio player with waveform & speed controls
│   │   │   ├── MonumentCard.jsx      # Monument card with badges, audio & explore actions
│   │   │   └── SearchFilterBar.jsx   # Live search, dynasty tabs & UNESCO filter
│   │   ├── pages/
│   │   │   ├── HomePage.jsx          # Hero, featured sites, storytelling teaser & stats
│   │   │   ├── ExplorePage.jsx       # Monument catalog with live filtering
│   │   │   ├── DetailsPage.jsx       # Deep-dive with photos, facts, highlights & audio
│   │   │   ├── StorytellingPage.jsx  # Persona selector, tone slider & parchment reader
│   │   │   ├── ChatbotPage.jsx       # Heritage Sage conversational guide with citations
│   │   │   ├── AudioStoriesPage.jsx  # Curated audio storytelling listening room
│   │   │   ├── MapPage.jsx           # Interactive heritage map with coordinates & pins
│   │   │   ├── QuizPage.jsx          # Cultural knowledge quiz with score certificate
│   │   │   └── AboutPage.jsx         # Architecture, tech stack & academic evaluation info
│   │   ├── context/
│   │   │   ├── LanguageContext.jsx   # Tamil / English language state & translations
│   │   │   └── AudioContext.jsx      # Global audio player state
│   │   ├── services/
│   │   │   ├── api.js                # Unified fetch client with automatic offline fallback
│   │   │   ├── heritageService.js    # Monument APIs & fallback data
│   │   │   ├── storyService.js       # Story generation & Web Speech API synthesis
│   │   │   ├── chatService.js        # Chatbot RAG APIs
│   │   │   └── quizService.js        # Quiz questions and submission APIs
│   │   ├── styles/
│   │   │   └── index.css             # Tailwind directives & luxury parchment styles
│   │   ├── App.jsx                   # Main layout and active page routing
│   │   └── main.jsx                  # Application entry point
│   ├── index.html                    # Root HTML with Google Fonts (Cinzel, Playfair, Outfit)
│   ├── package.json                  # Frontend dependencies
│   ├── vite.config.js                # Vite build and proxy settings
│   ├── tailwind.config.js            # Custom Royal Navy, Gold, Cream theme configuration
│   ├── postcss.config.js
│   └── .env.example
│
├── docs/
│   ├── architecture.md               # Detailed architectural diagram and system flow
│   └── api_documentation.md          # REST API endpoints, request & response schemas
│
├── README.md                         # Complete project documentation
└── .gitignore                        # Git ignore rules for node_modules, python cache & db
```

---

## 5. Prerequisites & Environment Setup

If you do not have Python 3 and Node.js installed on your Windows machine, install them using the Windows Package Manager (or download the official installers):

```powershell
# 1. Install Python 3.11+
winget install Python.Python.3.11

# 2. Install Node.js LTS
winget install OpenJS.NodeJS.LTS
```

---

## 6. How to Run the Backend

Open a terminal in the project directory:

```bash
cd HeritageAI/backend

# 1. Create a virtual environment (recommended)
python -m venv venv

# 2. Activate virtual environment
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On Windows Command Prompt:
venv\Scripts\activate.bat

# 3. Install dependencies
pip install -r requirements.txt

# 4. (Optional) Configure your Google Gemini API Key in .env
copy .env.example .env
# Set GEMINI_API_KEY=your_key in backend/.env
# (Note: If no key is provided, the platform automatically runs in
# database-grounded offline mode so college demos never fail!)

# 5. Start the FastAPI server
python run.py
```

The backend server will start at:
- **API Server**: `http://127.0.0.1:8000`
- **Interactive Swagger Docs**: `http://127.0.0.1:8000/docs`

---

## 7. How to Run the Frontend

Open a second terminal window:

```bash
cd HeritageAI/frontend

# 1. Install dependencies
npm install

# 2. Start the Vite development server
npm run dev
```

The frontend will start at:
- **Web App**: `http://localhost:5173`

---

## 8. Academic Evaluation & Viva Key Points

When presenting this project to your college review panel, highlight these technical achievements:
1. **Zero Hallucination with RAG**: Explain how user prompts are augmented with verified facts from the SQLite database before being passed to Google Gemini, citing ASI publications.
2. **First-Person Historical Perspective**: Demonstrate how the AI dynamically changes its vocabulary and focus when switching between the *Royal Architect* (engineering), *Court Poet* (triumph), and *Silk-Route Traveler* (trade & wonder).
3. **Bilingual Accessibility**: Show the instant toggle between Classical Tamil and English across UI, chatbot responses, and audio speech synthesis.
4. **Resilient Offline Architecture**: Show that even if the network is disconnected, the application uses local datasets and browser synthesis to continue functioning flawlessly.
