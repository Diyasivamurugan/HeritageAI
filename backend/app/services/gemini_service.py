import os
import logging
from typing import Optional

logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Attempt to configure google-generativeai
genai_available = False
if GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here":
    try:
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_API_KEY)
        genai_available = True
        logger.info("Google Gemini AI API initialized successfully.")
    except Exception as e:
        logger.warning(f"Could not initialize Gemini SDK: {e}. Fallback mode active.")


def generate_historical_story_ai(
    monument_name_en: str,
    monument_name_ta: str,
    dynasty: str,
    built_by: str,
    period: str,
    persona: str,
    tone: str,
    language: str,
    verified_context: str
) -> dict:
    """
    Generates a persona-grounded historical narrative using Gemini AI or verified fallback.
    Strictly follows anti-hallucination guidelines.
    """
    system_prompt = f"""You are the HeritageAI Master Historian & Storyteller.
You craft vivid, authentic, historically grounded first-person audio-style narratives.

RULES:
1. Ground your narrative STRICTLY on the verified facts provided below. Do NOT invent fictional wars, rulers, or non-existent architectural features.
2. Adopt the requested Persona: {persona} (Tone: {tone}).
3. Language: {"Tamil (தூய மற்றும் அழகிய தமிழில் கதையை எழுதவும்)" if language == 'ta' else "English (Rich, atmospheric, period-accurate prose)"}.
4. Structure the output into:
   - A captivating title (Title: ...)
   - A 3-4 paragraph dramatic historical story
5. Keep the narrative between 250 to 400 words so it is perfect for audio listening.

VERIFIED HISTORICAL CONTEXT:
Monument: {monument_name_en} ({monument_name_ta})
Dynasty: {dynasty}
Builder/Ruler: {built_by}
Period: {period}
Corpus Facts:
{verified_context}
"""

    if genai_available:
        try:
            import google.generativeai as genai
            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content(system_prompt)
            text = response.text.strip()
            
            # Simple title extraction
            lines = text.split("\n")
            title = lines[0].replace("Title:", "").replace("#", "").strip() if lines else f"Chronicles of {monument_name_en}"
            content = "\n".join(lines[1:]).strip() if len(lines) > 1 else text
            
            return {
                "title": title,
                "narrative": content or text,
                "is_fallback": False
            }
        except Exception as e:
            logger.error(f"Gemini API error during story generation: {e}. Using verified historical archive fallback.")

    # High-quality fallback for seamless college demonstrations without API key
    if language == "ta":
        fallback_stories = {
            "Architect": (
                f"கல்லில் வடித்த காவியம்: {monument_name_ta}",
                f"நான் இந்தக் கற்களை வெறும் பாறைகளாகப் பார்க்கவில்லை; தமிழரின் ஆன்மாவாகப் பார்க்கிறேன். {period} காலத்தில், பேரரசர் {built_by}-இன் ஆணைப்படி நாம் பணியைத் தொடங்கிய நாள் எனக்கு இன்னும் நினைவிருக்கிறது. சம்மட்டியும் உளியும் மோதும் ஒலி காற்றில் இன்னிசையாகக் கலந்தது. எந்தவொரு சாந்தும் இல்லாமல், ஒரு கல்லை மற்றொரு கல்லுடன் பூட்டி நிற்குமாறு செதுக்குவது எங்கள் தலைமுறையின் பெருங்கலை. வானைத் தொடும் இந்தக் கோபுரம் தலைமுறைகள் கடந்து சோழப் பண்பாட்டின் கம்பீரத்தைச் சொல்லும்."
            ),
            "Traveler": (
                f"தொலைதூரப் பயணியின் குறிப்பேடு: {monument_name_ta}",
                f"எத்தனையோ கடல்களையும் தேசங்களையும் கடந்து வந்துள்ளேன்; ஆனால் {dynasty} நாட்டின் இந்த அற்புதத்தை நேரில் கண்டபோது என் கண்கள் அகல விரிந்தன. {monument_name_ta}-இன் வாசலில் நின்றபோது சந்தன வாசனையும், மணி ஓசையும், மங்கல வாத்தியங்களும் என்னை வேறொரு உலகிற்கு அழைத்துச் சென்றன. மாமன்னர் {built_by} அமைத்த இந்த ஆலயம் வெறும் வழிபாட்டுத் தலம் மட்டுமல்ல, கலைகளின் தாய்வீடாகவும், ஞானத்தின் களஞ்சியமாகவும் ஒளிவீசுகிறது."
            )
        }
        fallback = fallback_stories.get(persona, fallback_stories["Architect"])
        return {"title": fallback[0], "narrative": fallback[1], "is_fallback": True}
    else:
        fallback_stories = {
            "Architect": (
                f"Symphony in Granite: The Raising of {monument_name_en}",
                f"The morning sun breaks over the Kaveri plains, glinting off the colossal blocks of granite. As the chief sthapati (royal architect) under Emperor {built_by}, my heart swells with solemn reverence. Every joint is locked dry without mortar—stone kissing stone with mathematical perfection. We raised an earthen ramp that stretched across miles to lift the great crown stone. When the evening breeze whispers through the pillared corridors, it is not silence you hear, but the eternal pulse of {dynasty} genius."
            ),
            "Traveler": (
                f"Voyager's Chronicle: In the Shadow of {monument_name_en}",
                f"Having sailed from distant ports across uncharted waters, I thought I had witnessed all the wonders the old world could offer. Yet nothing prepared me for the silhouette of {monument_name_en} piercing the dawn sky. Built during the {period}, this sacred monument houses not merely bronze deities and Vedic chants, but the beating heart of an empire. The citizens walk with dignity, the inscriptions record every artisan with honor, and the stone feels alive under hand."
            )
        }
        fallback = fallback_stories.get(persona, fallback_stories["Architect"])
        return {"title": fallback[0], "narrative": fallback[1], "is_fallback": True}


def answer_rag_query(query: str, language: str, context_bundle: str) -> dict:
    """
    RAG-grounded question answering for the AI Heritage Chatbot.
    """
    sys_instruction = f"""You are the HeritageAI Conversational Guide (மரபு அறிவன்).
Answer the user's inquiry accurately based SOLELY on the verified archaeological context provided below.
If the answer is not contained in the context, politely clarify what is verified in the database.
Language: {"Tamil (தமிழ்)" if language == 'ta' else "English"}.
Keep the response educational, polite, and engaging.

VERIFIED DATABASE CONTEXT:
{context_bundle}
"""
    if genai_available:
        try:
            import google.generativeai as genai
            model = genai.GenerativeModel("gemini-1.5-flash")
            chat = model.start_chat()
            response = chat.send_message(f"{sys_instruction}\n\nUSER QUESTION: {query}")
            return {
                "reply": response.text.strip(),
                "is_fallback": False
            }
        except Exception as e:
            logger.error(f"Gemini API chat error: {e}. Falling back to knowledge-base matching.")

    # High-quality contextual fallback
    if language == "ta":
        reply = (
            f"வணக்கம்! தாங்கள் கேட்ட கேள்விக்குரிய தகவல்கள் நமது சரிபார்க்கப்பட்ட தரவுத்தளத்தில் உள்ளன: \n\n"
            f"{context_bundle[:350]}...\n\n"
            f"இது தொல்லியல் துறை (ASI) மற்றும் யுனெஸ்கோ ஆவணங்களின் அடிப்படையில் பதிவு செய்யப்பட்ட வரலாற்றுத் தகவலாகும்."
        )
    else:
        reply = (
            f"Greetings explorer! Based on our Archaeological Survey of India (ASI) verified records:\n\n"
            f"{context_bundle[:400]}...\n\n"
            f"This architectural and historical chronicle is strictly verified by scholarly records."
        )

    return {"reply": reply, "is_fallback": True}
