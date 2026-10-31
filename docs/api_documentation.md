# HeritageAI REST API Documentation

Base URL: `http://localhost:8000`

---

## 1. Google Gen AI & RAG Engine

### `POST /api/ai/chat`
Retrieval-Augmented Generation (RAG) conversational endpoint for asking questions about South Indian cultural heritage. Grounded directly on the SQLite database with Archaeological Survey of India (ASI) verified records.

**Request Body:**
```json
{
  "query": "How was the 80-tonne granite capstone hoisted onto Thanjavur temple?",
  "language": "en",
  "site_id": 1
}
```

**Response Body:**
```json
{
  "reply": "According to verified Archaeological Survey of India (ASI) records, the octagonal 80-tonne granite Kumbam resting atop the 216-foot vimana of Brihadeeswarar Temple was hoisted using a massive 6-kilometer earthen ramp...",
  "language": "en",
  "citations": [
    {
      "monument_name": "Brihadeeswarar Temple",
      "category": "Engineering",
      "fact_snippet": "Constructed with 130,000 tonnes of granite without mortar using interlocking dry-stone puzzle joints.",
      "source": "ASI Monograph Series"
    }
  ],
  "suggested_followups": [
    "What do the rock bas-reliefs in Mahabalipuram signify?",
    "Why is Meenakshi temple considered an architectural labyrinth?"
  ],
  "grounded_on_db": true,
  "is_fallback": false
}
```

---

### `POST /api/ai/generate-story`
Generates an authentic historical narrative grounded on user-selected thematic categories and personas.

**Request Body:**
```json
{
  "site_id": 1,
  "category": "Architecture & Engineering",
  "persona": "Royal Architect",
  "tone": "Dramatic",
  "language": "ta"
}
```

**Response Body:**
```json
{
  "id": 1,
  "site_id": 1,
  "site_name": "Brihadeeswarar Temple",
  "site_name_ta": "பெருவுடையார் கோயில் (தஞ்சைப் பெரிய கோயில்)",
  "category": "Architecture & Engineering",
  "persona": "Royal Architect",
  "language": "ta",
  "title": "கல்லில் வடித்த காலத்தின் காவியம்",
  "narrative": "நான் இந்தக் கற்களை வெறும் பாறைகளாகப் பார்க்கவில்லை; தமிழரின் அழியா ஆன்மாவாகப் பார்க்கிறேன்...",
  "audio_url": "/api/story/audio?text=KallilVadithaKaaviyam&lang=ta",
  "information_source": "Archaeological Survey of India (ASI) / UNESCO Great Living Chola Temples",
  "is_fallback": false
}
```

---

## 2. Heritage Locations

### `GET /api/heritage`
List heritage locations with pagination and filtering.
- `skip` (int): Offset
- `limit` (int): Number of items (default 100)
- `dynasty` (string): Filter by dynasty (e.g. `Chola`, `Pallava`, `Pandya`)
- `is_unesco` (bool): Filter by UNESCO status
- `search` (string): Search keyword

### `GET /api/heritage/search?q={query}`
Full-text fuzzy search across monument names, descriptions, locations, and architectural styles.

### `GET /api/heritage/{id_or_slug}`
Retrieve individual heritage location with its verified historical facts and stories.

### `POST /api/heritage`
Create a new heritage location (CRUD Create).

### `PUT /api/heritage/{site_id}`
Update an existing heritage location (CRUD Update).

### `DELETE /api/heritage/{site_id}`
Delete a heritage location (CRUD Delete).

---

## 3. Historical Stories

### `GET /api/story/site/{site_id}`
Retrieve historical stories for a specific heritage location.

### `GET /api/story/all`
Retrieve all archived stories across all sites.

### `GET /api/story/audio?text={text}&lang={lang}`
Stream generated MP3 audio narration.

---

## 4. Cultural Quiz

### `GET /api/quiz/questions`
Retrieve multiple-choice questions with four English and Tamil options. Correct answers are not included in this response.
- `limit` (int): Number of questions (default 10, maximum 30)
- `difficulty` (string): `Beginner`, `Intermediate`, or `Advanced`
- `dynasty` (string): Optional dynasty filter
- `site_id` (int): Optional heritage site filter

### `POST /api/quiz/answer`
Check a selected answer and return instant correctness feedback and a bilingual historical explanation.

```json
{
  "question_id": 1,
  "selected_option_index": 0
}
```

### `POST /api/quiz/submit`
Submit all answers for the selected difficulty. The backend validates the answers, calculates the score, saves the result in SQLite, and returns a bilingual rank and question feedback.

```json
{
  "participant_name": "Heritage Explorer",
  "difficulty": "Beginner",
  "answers": [
    { "question_id": 1, "selected_option_index": 0 }
  ]
}
```

### `GET /api/quiz/results/{submission_id}`
Retrieve a previously saved quiz result, including score, rank, difficulty, and answer explanations.

---

## 5. Languages

### `GET /api/languages`
Retrieve all active supported languages (`en`, `ta`).
