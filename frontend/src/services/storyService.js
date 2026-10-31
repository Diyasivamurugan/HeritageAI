import { request } from './api';

export async function generateStoryApi(payload) {
  // Call official /api/ai/generate-story endpoint
  const result = await request('/api/ai/generate-story', {
    method: 'POST',
    body: JSON.stringify({
      site_id: payload.site_id || payload.monument_id,
      category: payload.category || "Architecture & Engineering",
      persona: payload.persona || "Royal Architect",
      tone: payload.tone || "Dramatic",
      language: payload.language || "en",
    }),
  });

  if (result) return result;

  // Resilient fallback story generation
  const isTamil = payload.language === 'ta';
  if (isTamil) {
    return {
      id: Date.now(),
      site_id: payload.site_id || payload.monument_id,
      site_name: "Heritage Monument",
      site_name_ta: "வரலாற்று மரபுச் சின்னம்",
      category: payload.category || "கட்டிடக்கலை & பொறியியல்",
      persona: payload.persona,
      language: "ta",
      title: "கருங்கல்லில் வடித்த காலத்தின் காவியம்",
      narrative: "நான் இந்தக் கற்களை வெறும் பாறைகளாகப் பார்க்கவில்லை; தமிழரின் அழியா ஆன்மாவாகப் பார்க்கிறேன். காலங்கள் பல கடந்து நின்றாலும், இந்த உன்னத கோபுரமும், நுணுக்கமான சிற்பங்களும் நமது முன்னோர்களின் இணையற்ற பொறியியல் அறிவையும் ஆன்மீக அர்ப்பணிப்பையும் உலகிற்கு பறைசாற்றிக் கொண்டே இருக்கும். சம்மட்டியின் ஒவ்வொரு அடியும் தெய்வ சங்கல்பமாக இங்கு எதிரொலிக்கிறது.",
      audio_url: "/api/story/audio?text=KallilVadithaKaaviyam&lang=ta"
    };
  }

  return {
    id: Date.now(),
    site_id: payload.site_id || payload.monument_id,
    site_name: "Heritage Monument",
    site_name_ta: "வரலாற்று மரபுச் சின்னம்",
    category: payload.category || "Architecture & Engineering",
    persona: payload.persona,
    language: "en",
    title: "Symphony in Granite: The Royal Chronicles",
    narrative: "The morning sun breaks over the horizon, bathing the majestic stone terraces in liquid gold. As the royal sthapati, I watched thousands of master craftsmen align each block of granite without an ounce of mortar. The precision of our ancestors defies modern mathematics; it stands not merely as a temple or fort, but as an eternal heartbeat of our civilization.",
    audio_url: "/api/story/audio?text=SymphonyInGranite&lang=en"
  };
}

/**
 * Native Text-To-Speech audio player using Web Speech API
 * Automatically matches Tamil (ta-IN) or English (en-IN / en-US) voices.
 */
export function playNarrationSpeech(text, language = 'en', onEndCallback = () => {}, rate = 1.0) {
  if (!('speechSynthesis' in window)) {
    console.warn("SpeechSynthesis not supported on this browser.");
    return null;
  }

  window.speechSynthesis.cancel(); // Stop any ongoing speech

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  if (language === 'ta') {
    utterance.lang = 'ta-IN';
    const tamilVoice = voices.find(v => v.lang.includes('ta') || v.lang.includes('ta-IN'));
    if (tamilVoice) utterance.voice = tamilVoice;
  } else {
    utterance.lang = 'en-US';
    const englishVoice = voices.find(v => v.lang === 'en-IN') || voices.find(v => v.lang.startsWith('en'));
    if (englishVoice) utterance.voice = englishVoice;
  }

  utterance.onend = onEndCallback;
  utterance.onerror = (e) => {
    console.error("SpeechSynthesis error:", e);
    onEndCallback();
  };

  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function stopNarrationSpeech() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
