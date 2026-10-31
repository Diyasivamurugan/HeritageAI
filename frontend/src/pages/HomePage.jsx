import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  Bot, 
  Volume2, 
  MapPin, 
  ArrowRight, 
  Search, 
  ShieldCheck, 
  Award,
  Crown,
  BookOpen
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAudio } from '../context/AudioContext';
import MonumentCard from '../components/MonumentCard';

export default function HomePage({ 
  monuments, 
  onSelectMonument, 
  onNavigate, 
  onGenerateStory 
}) {
  const { language, t } = useLanguage();
  const { playAudio } = useAudio();
  const [searchInput, setSearchInput] = useState('');

  const isTamil = language === 'ta';

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onNavigate('explore', { search: searchInput });
    } else {
      onNavigate('explore');
    }
  };

  const featuredMonuments = monuments.slice(0, 3);

  const dynasties = [
    {
      name: "Chola Empire",
      name_ta: "சோழப் பேரரசு",
      era: "9th – 13th Century CE",
      symbol: "🐅",
      desc_en: "Masters of monumental granite vimanas, bronze sculptures, and maritime naval expeditions.",
      desc_ta: "வானளாவிய கருங்கல் விமானங்கள், வெண்கலச் சிலைகள், கடல்வழிப் படையெடுப்புகளின் பொற்காலம்."
    },
    {
      name: "Pallava Dynasty",
      name_ta: "பல்லவ அரசு",
      era: "6th – 9th Century CE",
      symbol: "🦁",
      desc_en: "Pioneers of Dravidian rock-cut monolithic rathas and sea-sculpted shore sanctuaries.",
      desc_ta: "ஒற்றைக்கல் குடைவரை சிற்பங்கள் மற்றும் கடற்கரைக் கோயில்களின் முன்னோடிகள்."
    },
    {
      name: "Pandya Kingdom",
      name_ta: "பாண்டிய நாடு",
      era: "6th Century BCE – 14th CE",
      symbol: "🐟",
      desc_en: "Ancient patrons of Tamil Sangam literature, gem trade, and soaring temple gopurams.",
      desc_ta: "சங்கத் தமிழ் வளர்த்த தொன்மை பேரரசு, முத்து வர்த்தகம் மற்றும் பிரம்மாண்ட ராஜகோபுரங்கள்."
    },
    {
      name: "Nayaka & Maratha",
      name_ta: "நாயக்கர் & மராட்டியர்",
      era: "16th – 18th Century CE",
      symbol: "🏰",
      desc_en: "Architects of the Thousand Pillar halls, musical pillars, and impregnable hill citadels.",
      desc_ta: "ஆயிரங்கால் மண்டபங்கள், இசை எழுப்பும் தூண்கள் மற்றும் செஞ்சிக் கோட்டைக் காவலர்கள்."
    }
  ];

  return (
    <div className="space-y-24">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-heritage-navy-950 text-white overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        
        {/* Parallax Background Photography & Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=2000&q=85"
            alt="Brihadeeswarar Temple Vimana"
            className="w-full h-full object-cover opacity-30 scale-105 transform motion-safe:animate-pulse duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-heritage-navy-950 via-heritage-navy-950/70 to-heritage-navy-950/90" />
          <div className="absolute inset-0 bg-parchment-pattern opacity-40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-heritage-gold/15 border border-heritage-gold/40 text-heritage-gold text-xs uppercase tracking-widest font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>{t.hero.badge} • ASI & UNESCO Verified</span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-heritage-cream-100 leading-[1.15]">
            {t.hero.titleStart}{' '}
            <span className="gold-gradient-text block sm:inline">
              {t.hero.titleHighlight}
            </span>{' '}
            {t.hero.titleEnd}
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-base sm:text-xl text-heritage-cream-200/80 font-light leading-relaxed">
            {t.hero.subtitle}
          </p>

          {/* Search Bar */}
          <form 
            onSubmit={handleHeroSearch}
            className="max-w-2xl mx-auto flex items-center bg-white/95 rounded-2xl p-2 shadow-2xl border border-heritage-gold/50 backdrop-blur-md"
          >
            <div className="pl-3 pr-2 text-heritage-gold-dark">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t.hero.searchPlaceholder}
              className="flex-1 py-3 px-2 bg-transparent text-heritage-navy-950 text-sm focus:outline-none placeholder:text-heritage-navy-700/50"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-heritage-navy-950 text-heritage-gold font-serif font-semibold text-xs tracking-wider uppercase hover:bg-heritage-gold hover:text-heritage-navy-950 transition-all duration-300 shadow-md"
            >
              {isTamil ? 'தேடுக' : 'Search'}
            </button>
          </form>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('explore')}
              className="flex items-center space-x-2 px-8 py-4 rounded-xl bg-gradient-to-r from-heritage-gold via-heritage-gold-accent to-heritage-gold text-heritage-navy-950 font-serif font-bold text-sm tracking-wider uppercase hover:scale-105 active:scale-95 transition-all shadow-xl gold-glow"
            >
              <Compass className="w-4 h-4" />
              <span>{t.hero.exploreBtn}</span>
            </button>

            <button
              onClick={() => onNavigate('stories')}
              className="flex items-center space-x-2 px-8 py-4 rounded-xl bg-heritage-navy-900/90 text-heritage-gold border border-heritage-gold/50 hover:bg-heritage-gold hover:text-heritage-navy-950 font-serif font-bold text-sm tracking-wider uppercase hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.hero.storyBtn}</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-12 border-t border-heritage-gold/20 text-heritage-cream-200">
            <div>
              <div className="font-serif text-3xl font-bold text-heritage-gold">1,000+</div>
              <div className="text-xs text-heritage-cream-300/70 uppercase tracking-wider mt-1">
                {isTamil ? 'ஆண்டுகள் வரலாறு' : 'Years of History'}
              </div>
            </div>
            <div>
              <div className="font-serif text-3xl font-bold text-heritage-gold">100%</div>
              <div className="text-xs text-heritage-cream-300/70 uppercase tracking-wider mt-1">
                {isTamil ? 'உண்மைச் சரிபார்ப்பு' : 'ASI & UNESCO Grounded'}
              </div>
            </div>
            <div>
              <div className="font-serif text-3xl font-bold text-heritage-gold">2</div>
              <div className="text-xs text-heritage-cream-300/70 uppercase tracking-wider mt-1">
                {isTamil ? 'இருமொழிக் குரல்' : 'Tamil & English Audio'}
              </div>
            </div>
            <div>
              <div className="font-serif text-3xl font-bold text-heritage-gold">4</div>
              <div className="text-xs text-heritage-cream-300/70 uppercase tracking-wider mt-1">
                {isTamil ? 'வரலாற்றுப் பார்வைகள்' : 'Narrative Personas'}
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* 2. FEATURED HERITAGE LOCATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center space-x-2 text-heritage-gold-dark font-serif text-xs font-semibold uppercase tracking-widest mb-2">
              <Crown className="w-4 h-4" />
              <span>{isTamil ? 'முக்கிய இடங்கள்' : 'Featured Monuments'}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-heritage-navy-950">
              {isTamil ? 'வரலாற்றுப் புகழ்மிக்க இடங்கள்' : 'Architectural Marvels of the South'}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="mt-4 md:mt-0 flex items-center space-x-2 text-sm font-semibold text-heritage-terracotta hover:text-heritage-terracotta-dark transition"
          >
            <span>{isTamil ? 'அனைத்து இடங்களையும் காண்க' : 'View All 5 Monuments'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredMonuments.map((monument) => (
            <MonumentCard
              key={monument.id}
              monument={monument}
              onSelect={onSelectMonument}
              onGenerateStory={onGenerateStory}
            />
          ))}
        </div>
      </section>


      {/* 3. CULTURAL STORYTELLING SECTION */}
      <section className="bg-gradient-to-b from-heritage-navy-950 to-heritage-navy-900 text-heritage-cream-100 py-20 border-y border-heritage-gold/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Story Teaser Card (Parchment Style) */}
            <div className="parchment-sheet p-8 rounded-3xl text-heritage-navy-900 border border-heritage-gold/50 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-heritage-gold/30 mb-6">
                <div className="flex items-center space-x-2 text-heritage-gold-dark">
                  <BookOpen className="w-5 h-5" />
                  <span className="font-serif text-xs uppercase tracking-widest font-bold">
                    {isTamil ? 'உயிருள்ள வரலாற்று கதை' : 'Live Historical Chronicle'}
                  </span>
                </div>
                <span className="text-[11px] font-semibold bg-heritage-navy-950 text-heritage-gold px-2.5 py-1 rounded-full">
                  {isTamil ? 'தலைமை அரச சிற்பி' : 'Persona: Master Sthapati'}
                </span>
              </div>

              <h3 className="font-serif text-2xl font-bold mb-4 text-heritage-navy-950">
                {isTamil ? 'கல்லில் வடித்த காலத்தின் காவியம்: தஞ்சைப் பெரிய கோயில்' : 'Symphony in Granite: Raising the 80-Tonne Cupola'}
              </h3>

              <p className="text-sm text-heritage-navy-800 leading-relaxed italic mb-6">
                {isTamil
                  ? '“நான் இந்தக் கற்களை வெறும் பாறைகளாகப் பார்க்கவில்லை; தமிழரின் அழியா ஆன்மாவாகப் பார்க்கிறேன். எந்தவொரு சாந்தும் இல்லாமல், ஒரு கல்லை மற்றொரு கல்லுடன் பூட்டி நிற்குமாறு செதுக்குவது எங்கள் தலைமுறையின் பெருங்கலை...”'
                  : '"The morning sun breaks over the Kaveri plains, glinting off the colossal blocks of granite. As the chief sthapati under Emperor Raja Raja Chola, every joint was locked dry without mortar—stone kissing stone with mathematical perfection..."'
                }
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-heritage-gold/20">
                <button
                  onClick={() => {
                    const audioText = isTamil
                      ? "நான் இந்தக் கற்களை வெறும் பாறைகளாகப் பார்க்கவில்லை; தமிழரின் அழியா ஆன்மாவாகப் பார்க்கிறேன். எந்தவொரு சாந்தும் இல்லாமல், ஒரு கல்லை மற்றொரு கல்லுடன் பூட்டி நிற்குமாறு செதுக்குவது எங்கள் தலைமுறையின் பெருங்கலை."
                      : "The morning sun breaks over the Kaveri plains, glinting off the colossal blocks of granite. As the chief sthapati under Emperor Raja Raja Chola, every joint was locked dry without mortar.";
                    playAudio("Symphony in Granite", audioText, language, "Brihadeeswarar Temple");
                  }}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-heritage-gold text-heritage-navy-950 font-serif text-xs font-bold uppercase tracking-wider hover:scale-105 active:scale-95 transition shadow-md"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isTamil ? 'இக்கதையைக் கேட்க' : 'Listen Narration'}</span>
                </button>

                <button
                  onClick={() => onNavigate('stories')}
                  className="text-xs font-semibold text-heritage-navy-900 hover:text-heritage-gold-dark flex items-center space-x-1"
                >
                  <span>{isTamil ? 'சொந்தக் கதை உருவாக்குக' : 'Open Story Studio'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Story Studio Introduction */}
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-heritage-gold/20 border border-heritage-gold/40 text-heritage-gold text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isTamil ? 'AI கதை சொல்லும் தளம்' : 'Generative Cultural Storytelling'}</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
                {isTamil 
                  ? 'வரலாற்றை அதன் கதாநாயகர்களின் பார்வையில் கேளுங்கள்' 
                  : 'Experience History Through the Eyes of Those Who Lived It'
                }
              </h2>

              <p className="text-sm sm:text-base text-heritage-cream-300/80 leading-relaxed">
                {isTamil
                  ? 'ஹெரிடேஜ் ஏஐ வெறும் உண்மைகளை மட்டும் சொல்வதில்லை. முதலாம் இராஜராஜ சோழனின் அரசவைக் கவிஞர், சீனப் பயணி யுவான் சுவாங் அல்லது தலைமை சிற்பியின் குரலில் தமிழ் மற்றும் ஆங்கிலத்தில் வரலாற்று கதைகளை உருவாக்குகிறது.'
                  : 'HeritageAI transforms dry facts into gripping first-person historical epics. Select a monument, pick a perspective—Royal Architect, Court Poet, Silk-Route Traveler, or Temple Devotee—and listen via natural speech synthesis in Tamil or English.'
                }
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center space-x-3 text-sm text-heritage-cream-200">
                  <div className="w-7 h-7 rounded-lg bg-heritage-gold/20 flex items-center justify-center text-heritage-gold">✓</div>
                  <span>Strictly grounded on ASI and UNESCO verified facts</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-heritage-cream-200">
                  <div className="w-7 h-7 rounded-lg bg-heritage-gold/20 flex items-center justify-center text-heritage-gold">✓</div>
                  <span>Pure Tamil (செந்தமிழ்) and Classical English support</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-heritage-cream-200">
                  <div className="w-7 h-7 rounded-lg bg-heritage-gold/20 flex items-center justify-center text-heritage-gold">✓</div>
                  <span>Instant Audio Narration with speed and playback controls</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => onNavigate('stories')}
                  className="px-6 py-3 rounded-xl bg-heritage-gold text-heritage-navy-950 font-serif font-bold text-xs uppercase tracking-wider hover:bg-white transition shadow-lg"
                >
                  {isTamil ? 'கதை உருவாக்கத்தைத் தொடங்க' : 'Launch Storytelling Studio'}
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>


      {/* 4. AI ASSISTANT INTRODUCTION (Heritage Sage) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-heritage-cream-50 rounded-3xl border border-heritage-gold/40 p-8 sm:p-12 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-heritage-gold/20 text-heritage-gold-dark text-xs font-semibold">
              <Bot className="w-4 h-4" />
              <span>{isTamil ? 'மரபு அறிவன் AI' : 'Heritage Sage RAG Companion'}</span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-heritage-navy-950">
              {isTamil ? 'உங்கள் தனிப்பட்ட வரலாற்று வழிகாட்டி' : 'Ask Anything About South Indian Heritage'}
            </h2>
            <p className="text-sm text-heritage-navy-800 leading-relaxed">
              {isTamil
                ? 'தஞ்சாவூர் விமானக் கல் எப்படி ஏற்றப்பட்டது? மாமல்லபுர புடைப்புச் சிற்பங்களின் அர்த்தம் என்ன? எந்தவொரு வரலாற்று கேள்வியையும் எங்கள் AI வழிகாட்டியிடம் கேளுங்கள். தொல்லியல் ஆவணங்களின் அடிப்படையில் துல்லியமான பதில்களைப் பெறுங்கள்.'
                : 'Curious about how an 80-tonne capstone was hoisted in 1010 CE? Or what the inscriptions on Chola plinths reveal about ancient administration? Converse with our RAG-powered chatbot in Tamil or English.'
              }
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-xs bg-white border border-heritage-cream-300 px-3 py-1.5 rounded-lg text-heritage-navy-800 font-medium">
                "How was Thanjavur temple built without mortar?"
              </span>
              <span className="text-xs bg-white border border-heritage-cream-300 px-3 py-1.5 rounded-lg text-heritage-navy-800 font-medium">
                "Explain Mahabalipuram bas-reliefs in Tamil"
              </span>
            </div>
          </div>

          <div className="flex-shrink-0">
            <button
              onClick={() => onNavigate('chatbot')}
              className="flex items-center space-x-3 px-8 py-4 rounded-2xl bg-heritage-navy-950 text-heritage-gold font-serif font-bold text-sm tracking-wider uppercase hover:bg-heritage-gold hover:text-heritage-navy-950 transition-all duration-300 shadow-xl"
            >
              <Bot className="w-5 h-5" />
              <span>{isTamil ? 'சாட்பாட்டுடன் பேச' : 'Chat with Heritage Sage'}</span>
            </button>
          </div>
        </div>
      </section>


      {/* 5. DYNASTIES & POPULAR DESTINATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-heritage-gold-dark font-serif text-xs font-semibold uppercase tracking-widest">
            {isTamil ? 'அரச வம்சங்கள்' : 'Imperial Dynasties'}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-heritage-navy-950">
            {isTamil ? 'தென்னகத்தை ஆண்ட பேரரசுகள்' : 'Custodians of Tamil Architectural Heritage'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dynasties.map((dyn, idx) => (
            <div 
              key={idx}
              className="bg-white p-6 rounded-2xl border border-heritage-cream-300 hover:border-heritage-gold shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="text-3xl mb-3">{dyn.symbol}</div>
                <h3 className="font-serif text-lg font-bold text-heritage-navy-950">
                  {isTamil ? dyn.name_ta : dyn.name}
                </h3>
                <span className="text-xs text-heritage-terracotta font-medium block mb-2">
                  {dyn.era}
                </span>
                <p className="text-xs text-heritage-navy-700 leading-relaxed">
                  {isTamil ? dyn.desc_ta : dyn.desc_en}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-heritage-cream-200">
                <button
                  onClick={() => onNavigate('explore', { dynasty: dyn.name.split(' ')[0] })}
                  className="text-xs font-semibold text-heritage-gold-dark hover:text-heritage-navy-950 flex items-center space-x-1"
                >
                  <span>{isTamil ? 'மரபுச் சின்னங்களைக் காண்க' : 'Explore Monuments'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
