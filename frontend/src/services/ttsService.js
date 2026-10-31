import { request } from './api';

export async function synthesizeBackendAudio(text, language = 'en', title = 'Historical Narration', storyId = null) {
  // Ask the FastAPI backend to synthesize the story into an MP3.
  try {
    const result = await request('/api/tts/synthesize', {
      method: 'POST',
      body: JSON.stringify({
        text,
        language,
        title,
        story_id: storyId
      }),
    });

    if (result && result.audio_url) {
      return result;
    }
  } catch (error) {
    console.warn("Backend audio synthesis error. Falling back to local synthesizer.", error);
  }

  // Graceful fallback structure for offline or network issues
  const audioHash = Math.random().toString(36).substring(7);
  return {
    audio_url: null, // Signals AudioContext to use browser SpeechSynthesis as fallback
    download_url: null,
    audio_hash: audioHash,
    language: language,
    language_label: language === 'ta' ? 'Tamil Narration (தமிழ்)' : 'English Narration (English)',
    title: title,
    status: 'fallback'
  };
}
