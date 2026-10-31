import os
import logging
from typing import Dict, Any, List, Tuple, Optional
from sqlalchemy.orm import Session

from app.models.heritage_site import HeritageSite
from app.models.historical_fact import HistoricalFact
from app.models.heritage_story import HeritageStory
from app.schemas.ai import SourceCitation

logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Initialize Google Gen AI Client
genai_client = None
genai_legacy_model = None

if GEMINI_API_KEY and GEMINI_API_KEY not in ["your_gemini_api_key_here", ""]:
    # 1. Try official google-genai SDK first
    try:
        from google import genai
        genai_client = genai.Client(api_key=GEMINI_API_KEY)
        logger.info("Official Google Gen AI Python SDK (google-genai) initialized successfully.")
    except Exception as e1:
        logger.warning(f"Could not load official google-genai SDK: {e1}. Attempting google.generativeai...")
        try:
            import google.generativeai as legacy_genai
            legacy_genai.configure(api_key=GEMINI_API_KEY)
            genai_legacy_model = legacy_genai.GenerativeModel("gemini-1.5-flash")
            logger.info("Fallback google.generativeai SDK initialized successfully.")
        except Exception as e2:
            logger.warning(f"Could not load google.generativeai: {e2}. Operating in database-grounded offline mode.")


# =====================================================================
# RAG CONTEXT RETRIEVAL ENGINE (SQLite Database Grounding)
# =====================================================================

def retrieve_rag_context(
    db: Session, 
    query: str, 
    site_id: Optional[int] = None, 
    language: str = "en"
) -> Tuple[str, List[SourceCitation]]:
    """
    RAG Step 1 & 2:
    Retrieves matching historical facts, architectural records, and site data from SQLite.
    Produces an anti-hallucination factual bundle and structured source citations.
    """
    citations: List[SourceCitation] = []
    context_blocks: List[str] = []

    # If user focused on a specific site
    if site_id:
        target_site = db.query(HeritageSite).filter(HeritageSite.id == site_id).first()
        matched_sites = [target_site] if target_site else []
    else:
        # Fuzzy match query against sites
        q_lower = query.lower()
        all_sites = db.query(HeritageSite).all()
        matched_sites = []
        for s in all_sites:
            if (s.name.lower() in q_lower or 
                s.slug in q_lower or
                (s.name_ta and s.name_ta in query) or
                s.dynasty.lower() in q_lower or
                s.location.lower() in q_lower):
                matched_sites.append(s)

        # Fallback to top sites if no exact name match
        if not matched_sites:
            matched_sites = all_sites[:3]

    # Build context from matched sites
    for site in matched_sites:
        name_display = site.name_ta if (language == "ta" and site.name_ta) else site.name
        
        if language == "ta":
            block = (
                f"சின்னம்: {name_display}\n"
                f"அமைவிடம்: {site.location}\n"
                f"வம்சம் & நூற்றாண்டு: {site.dynasty} ({site.century_ce} CE)\n"
                f"விளக்கம்: {site.description}\n"
                f"வரலாற்றுப் பின்னணி: {site.historical_background}\n"
                f"கட்டிடக்கலை: {site.architecture}\n"
                f"கலாச்சார முக்கியத்துவம்: {site.cultural_significance}\n"
                f"மூல ஆவணம்: {site.information_source}"
            )
        else:
            block = (
                f"Monument: {name_display}\n"
                f"Location: {site.location}\n"
                f"Dynasty & Century: {site.dynasty} ({site.century_ce} CE)\n"
                f"Overview: {site.description}\n"
                f"Historical Background: {site.historical_background}\n"
                f"Architecture: {site.architecture}\n"
                f"Cultural Significance: {site.cultural_significance}\n"
                f"Verification Source: {site.information_source}"
            )
        context_blocks.append(block)

        # Retrieve verified historical facts
        facts = db.query(HistoricalFact).filter(HistoricalFact.site_id == site.id).all()
        for f in facts:
            snippet = f.fact_text[:140]
            citations.append(SourceCitation(
                monument_name=name_display,
                category=f.category,
                fact_snippet=snippet,
                source=f.source_reference
            ))
            context_blocks.append(f"- Verified Fact [{f.category}]: {f.fact_text} (Ref: {f.source_reference})")

    prepared_context = "\n\n".join(context_blocks)
    return prepared_context, citations


# =====================================================================
# HERITAGE QUESTION-ANSWER CHATBOT (RAG with Gemini AI)
# =====================================================================

def ask_heritage_chatbot(
    db: Session,
    query: str,
    language: str = "en",
    site_id: Optional[int] = None
) -> Dict[str, Any]:
    """
    RAG Step 3, 4 & 5:
    1. Retrieve verified historical context from SQLite.
    2. Prompt Gemini AI with strict anti-hallucination instructions.
    3. Return beginner-friendly bilingual explanation with source citations.
    """
    context, citations = retrieve_rag_context(db, query, site_id=site_id, language=language)

    system_instruction = f"""You are the HeritageAI Conversational Guide (மரபு அறிவன்).
You educate students, researchers, and tourists about the ancient cultural heritage of South India (Tamil Nadu).

MANDATORY RULES:
1. PREFER RETRIEVED INFORMATION: Ground your entire response strictly on the VERIFIED HISTORICAL CONTEXT below.
2. AVOID INVENTING FACTS: Do not invent fictional kings, wars, dates, or non-existent structural features.
3. ADMIT GAPS: If the requested information is not verified in the context, explicitly clarify:
   - In English: "Based on our verified Archaeological Survey of India (ASI) database records, details regarding this specific inquiry are currently unverified."
   - In Tamil: "நமது இந்தியத் தொல்லியல் துறை (ASI) சரிபார்க்கப்பட்ட தரவுத்தளத்தின்படி, இக்கேள்விக்குரிய தகவல் தற்போது ஆவணப்படுத்தப்படவில்லை."
4. BEGINNER-FRIENDLY: Explain complex Dravidian architectural terms (vimana, gopuram, mandapa, interlocking granite) in clear, inspiring, educational prose.
5. LANGUAGE: Respond entirely in {"Tamil (தூய தமிழ் நடையில் விளக்கமாக பதில் அளிக்கவும்)" if language == 'ta' else "English"}.

VERIFIED HISTORICAL CONTEXT:
{context}
"""

    user_prompt = f"USER QUESTION: {query}"

    # 1. Call official google-genai SDK if available
    if genai_client:
        try:
            response = genai_client.models.generate_content(
                model="gemini-1.5-flash",
                contents=f"{system_instruction}\n\n{user_prompt}"
            )
            return {
                "reply": response.text.strip(),
                "language": language,
                "citations": citations[:3],
                "suggested_followups": get_suggested_followups(language),
                "grounded_on_db": True,
                "is_fallback": False
            }
        except Exception as e:
            logger.error(f"Error calling google-genai SDK: {e}. Executing verified RAG fallback.")

    # 2. Call legacy google.generativeai SDK if available
    if genai_legacy_model:
        try:
            full_prompt = f"{system_instruction}\n\n{user_prompt}"
            response = genai_legacy_model.generate_content(full_prompt)
            return {
                "reply": response.text.strip(),
                "language": language,
                "citations": citations[:3],
                "suggested_followups": get_suggested_followups(language),
                "grounded_on_db": True,
                "is_fallback": False
            }
        except Exception as e:
            logger.error(f"Error calling legacy Gemini model: {e}. Executing verified RAG fallback.")

    # 3. Deterministic Verified Fallback (Guarantees 100% demo uptime without API key)
    if language == "ta":
        reply = (
            f"வணக்கம்! தாங்கள் கேட்ட கேள்விக்குரிய தகவல்கள் நமது சரிபார்க்கப்பட்ட தொல்லியல் தரவுத்தளத்திலிருந்து பெறப்பட்டுள்ளன:\n\n"
            f"{context[:450]}...\n\n"
            f"இத்தகவல் இந்தியத் தொல்லியல் துறை (ASI) மற்றும் யுனெஸ்கோ ஆவணங்களின் அடிப்படையில் பதிவு செய்யப்பட்ட வரலாற்று உண்மையாகும்."
        )
    else:
        reply = (
            f"Greetings! Based on our Archaeological Survey of India (ASI) verified records:\n\n"
            f"{context[:480]}...\n\n"
            f"These engineering and epigraphic records are strictly grounded on official archaeological documentation."
        )

    return {
        "reply": reply,
        "language": language,
        "citations": citations[:3],
        "suggested_followups": get_suggested_followups(language),
        "grounded_on_db": True,
        "is_fallback": True
    }


# =====================================================================
# AI HISTORICAL STORY GENERATOR (Category & Persona Grounding)
# =====================================================================

def generate_ai_historical_story(
    db: Session,
    site_id: int,
    category: str = "Architecture & Engineering",
    persona: str = "Royal Architect",
    tone: str = "Dramatic",
    language: str = "en"
) -> Dict[str, Any]:
    """
    Generates a persona-grounded historical narrative based on user-selected category.
    Saves the generated narrative into the HeritageStories SQLite table.
    """
    site = db.query(HeritageSite).filter(HeritageSite.id == site_id).first()
    if not site:
        raise ValueError(f"Heritage site ID {site_id} not found in database.")

    # Retrieve facts for RAG context
    facts = db.query(HistoricalFact).filter(HistoricalFact.site_id == site.id).all()
    facts_text = "\n".join([f"- [{f.category}] {f.fact_text}" for f in facts])

    name_display = site.name_ta if (language == "ta" and site.name_ta) else site.name

    system_instruction = f"""You are the HeritageAI Master Chronicler.
Craft a captivating, authentic first-person historical narrative for an audio storytelling platform.

STORYTELLING CONSTRAINTS:
1. CATEGORY: {category}
2. NARRATOR PERSONA: {persona} (Tone: {tone})
3. LANGUAGE: {"Tamil (தூய தமிழ் இலக்கிய நடையில் விறுவிறுப்பாக எழுதவும்)" if language == 'ta' else "Classical English (Atmospheric, vivid, period-accurate prose)"}
4. STRICT GROUNDING: Strictly respect the verified facts provided below. Do NOT invent fictional conflicts or non-existent architectural elements.
5. LENGTH: 250 to 350 words, structured into an evocative Title and 3-4 paragraphs suitable for audio narration.

VERIFIED MONUMENT CONTEXT:
Monument: {name_display}
Location: {site.location}
Dynasty & Era: {site.dynasty} ({site.century_ce} CE)
Architectural Record: {site.architecture}
Historical Background: {site.historical_background}
Cultural Significance: {site.cultural_significance}
Verified Facts:
{facts_text}
"""

    prompt = f"Generate an authentic historical audio story for {name_display} focusing on the theme: {category}."

    # 1. Try google-genai SDK
    if genai_client:
        try:
            response = genai_client.models.generate_content(
                model="gemini-1.5-flash",
                contents=f"{system_instruction}\n\n{prompt}"
            )
            raw_text = response.text.strip()
            lines = raw_text.split("\n")
            title = lines[0].replace("Title:", "").replace("#", "").strip() if lines else f"Chronicles of {name_display}"
            narrative = "\n".join(lines[1:]).strip() if len(lines) > 1 else raw_text

            # Persist in HeritageStories
            story_record = HeritageStory(
                site_id=site.id,
                title=title,
                persona=persona,
                narrative=narrative,
                language=language,
                audio_url=f"/api/story/audio?text={title}&lang={language}"
            )
            db.add(story_record)
            db.commit()
            db.refresh(story_record)

            return {
                "id": story_record.id,
                "site_id": site.id,
                "site_name": site.name,
                "site_name_ta": site.name_ta,
                "category": category,
                "persona": persona,
                "language": language,
                "title": title,
                "narrative": narrative,
                "audio_url": story_record.audio_url,
                "information_source": site.information_source,
                "is_fallback": False
            }
        except Exception as e:
            logger.error(f"Error calling google-genai for story: {e}. Executing verified fallback narrative.")

    # 2. Try legacy google.generativeai SDK
    if genai_legacy_model:
        try:
            response = genai_legacy_model.generate_content(f"{system_instruction}\n\n{prompt}")
            raw_text = response.text.strip()
            lines = raw_text.split("\n")
            title = lines[0].replace("Title:", "").replace("#", "").strip() if lines else f"Chronicles of {name_display}"
            narrative = "\n".join(lines[1:]).strip() if len(lines) > 1 else raw_text

            story_record = HeritageStory(
                site_id=site.id,
                title=title,
                persona=persona,
                narrative=narrative,
                language=language,
                audio_url=f"/api/story/audio?text={title}&lang={language}"
            )
            db.add(story_record)
            db.commit()
            db.refresh(story_record)

            return {
                "id": story_record.id,
                "site_id": site.id,
                "site_name": site.name,
                "site_name_ta": site.name_ta,
                "category": category,
                "persona": persona,
                "language": language,
                "title": title,
                "narrative": narrative,
                "audio_url": story_record.audio_url,
                "information_source": site.information_source,
                "is_fallback": False
            }
        except Exception as e:
            logger.error(f"Error calling legacy model for story: {e}. Executing verified fallback narrative.")

    # 3. High-Quality Verified Fallback Stories (Category & Language Grounded)
    if language == "ta":
        fallback_titles = {
            "Architecture & Engineering": f"கல்லில் வடித்த காவியம்: {site.name_ta or site.name}",
            "Maritime Trade & Travelers": f"பட்டுப்பாதை கடல் பயணியின் நினைவுகள்: {site.name_ta or site.name}",
            "Royal Court & Epics": f"பேரரசின் மணிமகுடம்: {site.name_ta or site.name}",
        }
        fallback_title = fallback_titles.get(category, f"வரலாற்று இதிகாசம்: {site.name_ta or site.name}")
        fallback_narrative = (
            f"நான் இந்தக் கற்களை வெறும் பாறைகளாகப் பார்க்கவில்லை; தமிழரின் அழியா ஆன்மாவாகப் பார்க்கிறேன். "
            f"{site.century_ce} CE காலத்தில், {site.dynasty} பேரரசின் பொற்காலத்தில் உருவான இந்த உன்னத அதிசயம் எங்கள் உழைப்பின் சாட்சி. "
            f"எந்தவொரு சாந்தும் இல்லாமல் ஒன்றோடொன்று பிணைக்கப்பட்ட கருங்கற்கள், காலத்தின் அலைகளைக் கடந்து நிற்கும். "
            f"{site.architecture[:200]}... இது தலைமுறைகள் பேசும் தென்னகத்தின் கம்பீரம்."
        )
    else:
        fallback_titles = {
            "Architecture & Engineering": f"Symphony in Granite: Raising {site.name}",
            "Maritime Trade & Travelers": f"Voyager's Chronicle: In the Harbor of {site.name}",
            "Royal Court & Epics": f"Imperial Majesty: The Crown of {site.name}",
        }
        fallback_title = fallback_titles.get(category, f"Chronicles of {site.name}")
        fallback_narrative = (
            f"The morning sun breaks over the horizon, bathing the majestic stone terraces of {site.name} in liquid gold. "
            f"As the {persona} under the glorious {site.dynasty} dynasty in {site.century_ce} CE, every stone joint was aligned with mathematical precision without a trace of mortar. "
            f"{site.architecture[:250]}... When the coastal wind whispers through the pillared galleries, it carries the eternal voice of South Indian genius."
        )

    # Persist fallback story in DB
    story_record = HeritageStory(
        site_id=site.id,
        title=fallback_title,
        persona=persona,
        narrative=fallback_narrative,
        language=language,
        audio_url=f"/api/story/audio?text={fallback_title}&lang={language}"
    )
    db.add(story_record)
    db.commit()
    db.refresh(story_record)

    return {
        "id": story_record.id,
        "site_id": site.id,
        "site_name": site.name,
        "site_name_ta": site.name_ta,
        "category": category,
        "persona": persona,
        "language": language,
        "title": fallback_title,
        "narrative": fallback_narrative,
        "audio_url": story_record.audio_url,
        "information_source": site.information_source,
        "is_fallback": True
    }


def get_suggested_followups(language: str) -> List[str]:
    """Provides dynamic beginner-friendly follow-up questions."""
    if language == "ta":
        return [
            "தஞ்சைப் பெரிய கோயில் விமானத்தின் உச்சிக்கு 80 டன் கல் எவ்வாறு ஏற்றப்பட்டது?",
            "மாமல்லபுரம் அர்ச்சுனன் தவம் பாறைச் சிற்பத்தின் தாத்பரியம் என்ன?",
            "மதுரை ஆயிரங்கால் மண்டபத்தில் உள்ள இசைத் தூண்களின் சிறப்பு என்ன?"
        ]
    return [
        "How was the 80-tonne granite capstone hoisted onto Thanjavur temple?",
        "What is the historical meaning of the Descent of the Ganges at Mahabalipuram?",
        "Why is Meenakshi temple considered a masterpiece of Dravidian city planning?"
    ]
