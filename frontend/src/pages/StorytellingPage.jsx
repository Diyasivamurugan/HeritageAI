import React, { useState } from 'react';
import { 
  Sparkles, 
  Volume2, 
  BookOpen, 
  Globe2, 
  Layers, 
  Copy, 
  Check, 
  Loader2, 
  ShieldCheck, 
  RefreshCw, 
  Play, 
  Pause, 
  Download, 
  AlertCircle,
  Crown,
  Ship,
  Flame,
  ShieldAlert,
  Headphones
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAudio } from '../context/AudioContext';
import { generateStoryApi } from '../services/storyService';
import { synthesizeBackendAudio } from '../services/ttsService';

function formatSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function StorytellingPage({ monuments, initialSelectedMonument }) {
  const { language: globalLang } = useLanguage();
  const { 
    currentTrack, 
    isPlaying, 
    currentTime, 
    duration, 
    playTrack, 
    pauseAudio, 
    resumeAudio, 
    seekTo 
  } = useAudio();

  const [selectedMonumentId, setSelectedMonumentId] = useState(
    initialSelectedMonument ? initialSelectedMonument.id : (monuments[0]?.id || 1)
  );
  const [selectedCategory, setSelectedCategory] = useState('Architecture & Engineering');
  const [selectedPersona, setSelectedPersona] = useState('Royal Architect');
  const [selectedTone, setSelectedTone] = useState('Dramatic');
  const [storyLang, setStoryLang] = useState(globalLang || 'en');
  const [isLoading, setIsLoading] = useState(false);
  const [isSynthesizingAudio, setIsSynthesizingAudio] = useState(false);
  const [generatedStory, setGeneratedStory] = useState(null);
  const [synthesizedAudioData, setSynthesizedAudioData] = useState(null);
  const [audioError, setAudioError] = useState(null);
  const [copied, setCopied] = useState(false);

  const isTamil = storyLang === 'ta';

  const storyCategories = [
    {
      id: 'Architecture & Engineering',
      icon: Layers,
      label_en: 'Architecture & Engineering',
      label_ta: 'கட்டிடக்கலை & பொறியியல்',
      desc_en: 'Granite alignment, 80-tonne kumbam hoist, interlocking dry-stone puzzle joints.',
      desc_ta: 'கருங்கல் அடுக்குகள், சாய்வுதளம் மற்றும் விமானக் கலசப் பொறியியல்.'
    },
    {
      id: 'Royal Court & Epics',
      icon: Crown,
      label_en: 'Royal Court & Epics',
      label_ta: 'அரசுரிமை & காப்பியங்கள்',
      desc_en: 'Imperial coronation, stone plinth epigraphy, and trans-peninsular conquests.',
      desc_ta: 'மன்னரின் தானங்கள், கங்கைப் படையெடுப்பு மற்றும் கல்வெட்டு வரலாறு.'
    },
    {
      id: 'Maritime Trade & Travelers',
      icon: Ship,
      label_en: 'Maritime Trade & Travelers',
      label_ta: 'கடல் வர்த்தகம் & பயணிகள்',
      desc_en: 'Silk-route trade, Roman coins, Chinese records, and oceanic voyages.',
      desc_ta: 'பட்டுப்பாதை கடல் வர்த்தகம், உரோமானிய நாணயங்கள் மற்றும் யுவான் சுவாங் குறிப்புகள்.'
    },
    {
      id: 'Spiritual & Temple Life',
      icon: Flame,
      label_en: 'Spiritual & Temple Life',
      label_ta: 'ஆன்மீகம் & ஆலய பக்தி',
      desc_en: 'Temple rituals, sacred lotus tanks, and 108 Bharatanatyam karana sculptures.',
      desc_ta: 'பொற்றாமரைக் குளம், ஆயிரங்கால் மண்டபம் மற்றும் 108 பரதநாட்டிய கரணங்கள்.'
    },
    {
      id: 'Military Strategy & Fortresses',
      icon: ShieldAlert,
      label_en: 'Military Strategy & Fortresses',
      label_ta: 'ராணுவ வியூகம் & கோட்டைக் கலை',
      desc_en: 'Rajagiri vertical chasms, drawbridges, and 8-year historical sieges.',
      desc_ta: 'செஞ்சிக் கோட்டை 800 அடி உச்சி அரண், தொங்கு பாலம் மற்றும் 8 ஆண்டு முற்றுகை.'
    }
  ];

  const personas = [
    {
      id: 'Royal Architect',
      name_en: 'Chief Royal Architect (Sthapati)',
      name_ta: 'தலைமை அரச சிற்பி (ஸ்தபதி)',
    },
    {
      id: 'Court Poet',
      name_en: 'Imperial Court Poet (Kavignar)',
      name_ta: 'அரசவைக் கவிஞர் (புலவர்)',
    },
    {
      id: 'Silk-Route Voyager',
      name_en: 'Silk-Route Foreign Traveler',
      name_ta: 'பட்டுப்பாதை கடல் பயணி',
    },
    {
      id: 'Temple Devotee',
      name_en: 'Humble Pilgrim & Devotee',
      name_ta: 'ஆலய யாத்ரீகர் & எளிய பக்தர்',
    }
  ];

  const tones = [
    { id: 'Dramatic', label_en: 'Dramatic & Epic', label_ta: 'வீரம் & காவிய நயம்' },
    { id: 'Poetic', label_en: 'Lyrical & Poetic', label_ta: 'கவிதை & இலக்கிய நயம்' },
    { id: 'Educational', label_en: 'Scholarly & Educational', label_ta: 'ஆய்வு & வரலாற்று நோக்கு' },
  ];

  const handleGenerateStory = async () => {
    setIsLoading(true);
    setGeneratedStory(null);
    setSynthesizedAudioData(null);
    setAudioError(null);

    try {
      const result = await generateStoryApi({
        site_id: Number(selectedMonumentId),
        category: selectedCategory,
        persona: selectedPersona,
        tone: selectedTone,
        language: storyLang,
      });

      setGeneratedStory(result);

      // Automatically initiate backend audio conversion
      handleConvertStoryToAudio(result);
    } catch (error) {
      console.error("Story generation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConvertStoryToAudio = async (storyObj) => {
    if (!storyObj) return;
    setIsSynthesizingAudio(true);
    setAudioError(null);

    try {
      const audioResult = await synthesizeBackendAudio(
        storyObj.narrative,
        storyObj.language,
        storyObj.title,
        storyObj.id || storyObj.site_id
      );
      setSynthesizedAudioData(audioResult);
    } catch (err) {
      console.warn("Backend audio synthesis issue:", err);
      setAudioError("Could not connect to backend TTS. Browser speech fallback will be used.");
    } finally {
      setIsSynthesizingAudio(false);
    }
  };

  const handlePlayToggle = () => {
    if (!generatedStory) return;

    const monumentObj = monuments.find(m => m.id === Number(selectedMonumentId));
    const monumentName = isTamil ? monumentObj?.name_ta : monumentObj?.name_en;
    const isThisStoryPlaying = currentTrack && currentTrack.title === generatedStory.title;

    if (isThisStoryPlaying && isPlaying) {
      pauseAudio();
    } else if (isThisStoryPlaying && !isPlaying) {
      resumeAudio();
    } else {
      playTrack({
        title: generatedStory.title,
        text: generatedStory.narrative,
        language: generatedStory.language,
        languageLabel: isTamil ? "Tamil Narration (தமிழ்)" : "English Narration (English)",
        audioUrl: synthesizedAudioData?.audio_url || null,
        downloadUrl: synthesizedAudioData?.download_url || null,
        monumentName: monumentName || "Heritage AI Story"
      });
    }
  };

  const handleCopyText = () => {
    if (!generatedStory) return;
    navigator.clipboard.writeText(`${generatedStory.title}\n\n${generatedStory.narrative}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isCurrentStoryActive = currentTrack && generatedStory && currentTrack.title === generatedStory.title;
  const progressPercent = (isCurrentStoryActive && duration > 0) ? (currentTime / duration) * 100 : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Page Title Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-heritage-gold/15 text-heritage-gold-dark text-xs font-bold uppercase tracking-widest border border-heritage-gold/30">
          <Headphones className="w-3.5 h-3.5" />
          <span>{isTamil ? 'AI குரல் கதை சொல்லும் கூடம்' : 'AI Audio Storytelling Platform'}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-heritage-navy-950">
          {isTamil ? 'வரலாற்றை குரல் வழியே கேளுங்கள்' : 'Listen to Living History in Tamil & English'}
        </h1>
        <p className="text-sm sm:text-base text-heritage-navy-800/80 leading-relaxed font-light">
          {isTamil
            ? 'சோழ, பல்லவ, பாண்டிய மற்றும் நாயக்க மன்னர்களின் வரலாற்றுச் சிறப்புகளை AI குரல் வடிவில் தமிழ் மற்றும் ஆங்கிலத்தில் கேளுங்கள்.'
            : 'Convert AI-generated historical narratives into complete speech narrations in Tamil (தமிழ்) and English with instant audio playback controls.'
          }
        </p>
      </div>

      {/* Story Configuration Panel */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-heritage-gold/40 shadow-xl space-y-8">
        
        {/* 1. Heritage Location Selector */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-heritage-gold-dark">
            1. {isTamil ? 'மரபுச் சின்னத்தைத் தேர்ந்தெடுக்கவும்' : 'Select Heritage Monument'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {monuments.map((m) => {
              const isSelected = Number(selectedMonumentId) === m.id;
              const name = isTamil ? m.name_ta : m.name_en;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMonumentId(m.id)}
                  className={`flex items-center space-x-3 p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-heritage-navy-950 text-heritage-gold border-heritage-gold shadow-md'
                      : 'bg-heritage-cream-50 text-heritage-navy-900 border-heritage-cream-300 hover:border-heritage-gold/60'
                  }`}
                >
                  <img
                    src={m.hero_image}
                    alt={name}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="truncate">
                    <div className="font-serif text-xs font-bold truncate">{name}</div>
                    <div className="text-[11px] opacity-70">{m.dynasty} • {m.century_ce} CE</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Story Category Selector */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-heritage-gold-dark">
            2. {isTamil ? 'கதைக் கரு / வகையைத் தேர்ந்தெடுக்கவும் (Story Category)' : 'Select Story Category (Theme)'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {storyCategories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const Icon = cat.icon;
              const title = isTamil ? cat.label_ta : cat.label_en;
              const desc = isTamil ? cat.desc_ta : cat.desc_en;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-heritage-navy-900 text-heritage-cream-100 border-heritage-gold shadow-md ring-1 ring-heritage-gold'
                      : 'bg-heritage-cream-50 text-heritage-navy-900 border-heritage-cream-300 hover:border-heritage-gold/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center space-x-2 mb-1.5">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-heritage-gold' : 'text-heritage-terracotta'}`} />
                      <span className={`font-serif text-xs font-bold ${isSelected ? 'text-heritage-gold' : 'text-heritage-navy-950'}`}>
                        {title}
                      </span>
                    </div>
                    <p className="text-[11px] opacity-75 leading-snug">
                      {desc}
                    </p>
                  </div>
                  <div className="mt-2.5 text-[10px] font-semibold uppercase tracking-wider text-heritage-gold">
                    {isSelected ? '✓ Active Theme' : 'Select'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Persona, Tone & Language Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-heritage-cream-300">
          
          {/* Persona */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-heritage-gold-dark">
              3. {isTamil ? 'கதை சொல்லும் பாத்திரம்' : 'Narrator Persona'}
            </label>
            <select
              value={selectedPersona}
              onChange={(e) => setSelectedPersona(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-heritage-cream-300 text-xs font-semibold bg-white text-heritage-navy-900 focus:outline-none focus:ring-2 focus:ring-heritage-gold"
            >
              {personas.map(p => (
                <option key={p.id} value={p.id}>
                  {isTamil ? p.name_ta : p.name_en}
                </option>
              ))}
            </select>
          </div>

          {/* Tone */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-heritage-gold-dark">
              4. {isTamil ? 'கதை நடை' : 'Tone'}
            </label>
            <select
              value={selectedTone}
              onChange={(e) => setSelectedTone(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-heritage-cream-300 text-xs font-semibold bg-white text-heritage-navy-900 focus:outline-none focus:ring-2 focus:ring-heritage-gold"
            >
              {tones.map(t => (
                <option key={t.id} value={t.id}>
                  {isTamil ? t.label_ta : t.label_en}
                </option>
              ))}
            </select>
          </div>

          {/* Narration Language Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-heritage-gold-dark">
              5. {isTamil ? 'ஒலி கதை மொழி (Narration Language)' : 'Narration Language'}
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => setStoryLang('en')}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition ${
                  storyLang === 'en'
                    ? 'bg-heritage-navy-900 text-heritage-gold border-heritage-gold shadow-sm'
                    : 'bg-white text-heritage-navy-800 border-heritage-cream-300 hover:border-heritage-gold/40'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setStoryLang('ta')}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition ${
                  storyLang === 'ta'
                    ? 'bg-heritage-navy-900 text-heritage-gold border-heritage-gold shadow-sm'
                    : 'bg-white text-heritage-navy-800 border-heritage-cream-300 hover:border-heritage-gold/40'
                }`}
              >
                தமிழ் (Tamil)
              </button>
            </div>
          </div>

        </div>

        {/* Generate Action Button */}
        <div className="pt-2 flex justify-center">
          <button
            onClick={handleGenerateStory}
            disabled={isLoading}
            className="flex items-center space-x-2 px-10 py-4 rounded-2xl bg-gradient-to-r from-heritage-gold via-heritage-gold-accent to-heritage-gold text-heritage-navy-950 font-serif font-bold text-sm tracking-wider uppercase hover:scale-105 active:scale-95 transition-all shadow-xl gold-glow disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{isTamil ? 'கதையும் குரல் கோப்பும் தயாராகிறது...' : 'Generating Grounded Narrative & Audio...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>{isTamil ? 'கதை & ஆடியோ உருவாக்குக' : 'Generate Story & Narration'}</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Generated Story Display with Integrated Audio Studio Controls */}
      {generatedStory && (
        <div className="parchment-sheet p-8 sm:p-12 rounded-3xl border border-heritage-gold/60 shadow-2xl space-y-6 relative animate-fade-in">
          
          {/* Header Metadata */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-heritage-gold/30 gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-heritage-gold-dark">
                  Theme: {generatedStory.category}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-heritage-navy-950 text-heritage-gold font-semibold">
                  {isTamil ? 'மொழி: தமிழ் (Tamil)' : 'Language: English'}
                </span>
              </div>
              <div className="font-serif text-sm font-semibold text-heritage-navy-900">
                Persona: {generatedStory.persona}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyText}
                className="p-2.5 rounded-xl border border-heritage-gold/40 text-heritage-navy-800 hover:bg-white transition"
                title="Copy Text"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Story Title */}
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-heritage-navy-950 leading-snug">
            {generatedStory.title}
          </h2>

          {/* DEDICATED INLINE AUDIO PLAYBACK STUDIO */}
          <div className="bg-heritage-navy-950 text-heritage-cream-100 rounded-2xl p-5 border border-heritage-gold/40 shadow-xl space-y-3">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                
                {/* Play / Pause Button */}
                <button
                  onClick={handlePlayToggle}
                  className="w-12 h-12 rounded-xl bg-heritage-gold text-heritage-navy-950 flex items-center justify-center hover:scale-105 active:scale-95 transition shadow-lg"
                  title={isCurrentStoryActive && isPlaying ? "Pause Audio" : "Play Story Audio"}
                >
                  {isCurrentStoryActive && isPlaying ? (
                    <Pause className="w-6 h-6 fill-current" />
                  ) : (
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  )}
                </button>

                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-serif text-sm font-bold text-heritage-gold">
                      {isCurrentStoryActive && isPlaying ? "Now Playing Complete Narration" : "Listen to Complete Story"}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-heritage-gold/20 text-heritage-gold border border-heritage-gold/30">
                      {isTamil ? "தமிழ் (Tamil)" : "English"}
                    </span>
                  </div>
                  <p className="text-[11px] text-heritage-cream-300/80">
                    {isSynthesizingAudio ? "Synthesizing high-fidelity audio in backend..." : "Full audio narration synthesized via backend TTS engine."}
                  </p>
                </div>

              </div>

              {/* Download MP3 Action */}
              {synthesizedAudioData?.download_url && (
                <a
                  href={`http://127.0.0.1:8000${synthesizedAudioData.download_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-heritage-gold/30 hover:bg-heritage-navy-900 text-heritage-gold text-xs font-semibold transition"
                  title="Download MP3"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download MP3</span>
                </a>
              )}
            </div>

            {/* Scrubber Progress Slider */}
            {isCurrentStoryActive && (
              <div className="space-y-1 pt-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progressPercent || 0}
                  onChange={(e) => {
                    const newSeconds = (parseFloat(e.target.value) / 100) * duration;
                    seekTo(newSeconds);
                  }}
                  className="w-full h-1.5 bg-heritage-navy-800 rounded-lg appearance-none cursor-pointer accent-heritage-gold"
                />
                <div className="flex items-center justify-between text-[11px] text-heritage-cream-300 font-mono">
                  <span>{formatSeconds(currentTime)}</span>
                  <span>{formatSeconds(duration)}</span>
                </div>
              </div>
            )}

            {/* Error Notification if any */}
            {audioError && (
              <div className="flex items-center space-x-2 text-xs text-amber-300 bg-amber-950/40 p-2.5 rounded-lg border border-amber-500/30">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{audioError}</span>
              </div>
            )}

          </div>

          {/* Story Body Text */}
          <div className="text-heritage-navy-900/90 text-sm sm:text-base leading-relaxed space-y-4 font-serif text-justify whitespace-pre-line">
            {generatedStory.narrative}
          </div>

          {/* Grounding & Verification Footer */}
          <div className="pt-6 border-t border-heritage-gold/30 flex items-center justify-between text-xs text-heritage-navy-700/70">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Grounded on ASI Historical Archives: {generatedStory.information_source || "Archaeological Survey of India"}</span>
            </div>
            <button
              onClick={handleGenerateStory}
              className="flex items-center space-x-1 text-heritage-gold-dark hover:underline font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{isTamil ? 'மறு உருவாக்கம்' : 'Regenerate Narrative'}</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
