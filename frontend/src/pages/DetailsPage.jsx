import React from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Crown, 
  ShieldCheck, 
  Volume2, 
  Sparkles, 
  Bot, 
  Compass, 
  Layers, 
  FileText 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAudio } from '../context/AudioContext';

export default function DetailsPage({ 
  monument, 
  onBack, 
  onGenerateStory, 
  onAskChatbot, 
  onViewOnMap 
}) {
  const { language, t } = useLanguage();
  const { playAudio } = useAudio();

  if (!monument) return null;

  const isTamil = language === 'ta';
  const name = isTamil ? monument.name_ta : monument.name_en;
  const secondaryName = isTamil ? monument.name_en : monument.name_ta;
  const builtBy = isTamil ? monument.built_by_ta : monument.built_by_en;
  const fullHistory = isTamil ? monument.full_history_ta : monument.full_history_en;
  const significance = isTamil ? monument.significance_ta : monument.significance_en;
  const style = isTamil ? monument.architectural_style_ta : monument.architectural_style_en;

  const handleAudioNarration = () => {
    const audioScript = isTamil
      ? `${monument.name_ta}. ${monument.short_desc_ta}. வரலாற்று பின்னணி: ${monument.full_history_ta}. சிறப்பு அம்சம்: ${monument.significance_ta}.`
      : `${monument.name_en}. ${monument.short_desc_en}. Historical background: ${monument.full_history_en}. Architectural significance: ${monument.significance_en}.`;
    
    playAudio(name, audioScript, language, name);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Back Button & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-sm font-semibold text-heritage-navy-800 hover:text-heritage-gold-dark transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isTamil ? 'அனைத்து சின்னங்களுக்கும் திரும்புக' : 'Back to Monuments'}</span>
        </button>

        <div className="flex items-center space-x-2">
          {monument.is_unesco && (
            <span className="flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>UNESCO World Heritage</span>
            </span>
          )}
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-heritage-navy-900 text-heritage-gold border border-heritage-gold/40">
            {monument.dynasty}
          </span>
        </div>
      </div>

      {/* Hero Banner with Monument Photography */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-heritage-gold/40 bg-heritage-navy-950">
        <div className="relative h-96 sm:h-[480px] w-full">
          <img
            src={monument.hero_image}
            alt={name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-heritage-navy-950 via-heritage-navy-950/40 to-transparent" />
          
          {/* Overlay Text */}
          <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 text-white space-y-3">
            <div className="flex items-center space-x-2 text-heritage-gold text-xs uppercase tracking-widest font-semibold">
              <MapPin className="w-4 h-4 text-heritage-terracotta" />
              <span>{monument.district}, {monument.state}</span>
              <span>•</span>
              <span>{monument.period}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-heritage-cream-100">
              {name}
            </h1>
            <p className="text-sm sm:text-lg text-heritage-gold/80 font-medium">
              {secondaryName}
            </p>
          </div>
        </div>

        {/* Quick Action Ribbon Under Hero */}
        <div className="bg-heritage-navy-900 border-t border-heritage-gold/30 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleAudioNarration}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-heritage-gold text-heritage-navy-950 font-serif font-bold text-xs uppercase tracking-wider hover:bg-white transition shadow-md"
            >
              <Volume2 className="w-4 h-4" />
              <span>{isTamil ? 'முழு ஒலி உரை கேட்க' : 'Listen Full Audio'}</span>
            </button>

            <button
              onClick={() => onGenerateStory(monument)}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-heritage-gold/15 text-heritage-gold border border-heritage-gold/50 font-serif font-bold text-xs uppercase tracking-wider hover:bg-heritage-gold hover:text-heritage-navy-950 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isTamil ? 'AI கதை உருவாக்குக' : 'Generate AI Story'}</span>
            </button>

            <button
              onClick={() => onAskChatbot(monument)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-heritage-navy-800 text-heritage-cream-200 hover:text-heritage-gold border border-heritage-gold/20 text-xs font-semibold transition"
            >
              <Bot className="w-4 h-4 text-heritage-gold" />
              <span>{isTamil ? 'சாட்பாட்டிடம் கேட்க' : 'Ask Heritage Sage'}</span>
            </button>
          </div>

          <button
            onClick={() => onViewOnMap(monument)}
            className="flex items-center space-x-1.5 text-xs text-heritage-gold hover:underline font-semibold"
          >
            <Compass className="w-4 h-4" />
            <span>{isTamil ? 'வரைபடத்தில் பார்க்க' : 'Locate on Map'}</span>
          </button>
        </div>
      </div>

      {/* Key Specifications Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-heritage-cream-300 shadow-sm">
          <div className="flex items-center space-x-2 text-heritage-gold-dark text-xs uppercase tracking-wider font-semibold mb-1">
            <Crown className="w-4 h-4" />
            <span>{isTamil ? 'வம்சம்' : 'Dynasty'}</span>
          </div>
          <div className="font-serif text-base font-bold text-heritage-navy-950">{monument.dynasty}</div>
          <div className="text-xs text-heritage-navy-700/70 mt-1">{builtBy}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-heritage-cream-300 shadow-sm">
          <div className="flex items-center space-x-2 text-heritage-gold-dark text-xs uppercase tracking-wider font-semibold mb-1">
            <Calendar className="w-4 h-4" />
            <span>{isTamil ? 'நூற்றாண்டு' : 'Chronology'}</span>
          </div>
          <div className="font-serif text-base font-bold text-heritage-navy-950">{monument.century_ce} CE</div>
          <div className="text-xs text-heritage-navy-700/70 mt-1">{monument.period}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-heritage-cream-300 shadow-sm">
          <div className="flex items-center space-x-2 text-heritage-gold-dark text-xs uppercase tracking-wider font-semibold mb-1">
            <Layers className="w-4 h-4" />
            <span>{isTamil ? 'கட்டிடக்கலை பாணி' : 'Architecture'}</span>
          </div>
          <div className="font-serif text-sm font-bold text-heritage-navy-950 line-clamp-1">{style}</div>
          <div className="text-xs text-heritage-navy-700/70 mt-1">Interlocking Granite</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-heritage-cream-300 shadow-sm">
          <div className="flex items-center space-x-2 text-heritage-gold-dark text-xs uppercase tracking-wider font-semibold mb-1">
            <MapPin className="w-4 h-4" />
            <span>{isTamil ? 'அமைவிடம்' : 'Coordinates'}</span>
          </div>
          <div className="font-serif text-sm font-bold text-heritage-navy-950">
            {monument.latitude.toFixed(4)}°N, {monument.longitude.toFixed(4)}°E
          </div>
          <div className="text-xs text-heritage-navy-700/70 mt-1">{monument.district} District</div>
        </div>
      </div>

      {/* Historical Narrative and Significance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Historical Account */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-heritage-cream-300 shadow-md space-y-4">
            <div className="flex items-center space-x-2 text-heritage-gold-dark font-serif text-xs uppercase tracking-widest font-bold">
              <FileText className="w-4 h-4" />
              <span>{isTamil ? 'முழு வரலாற்றுப் பதிவு' : 'Verified Historical Account'}</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-heritage-navy-950">
              {isTamil ? 'வரலாற்றுப் பின்னணி' : 'Historical Background & Origins'}
            </h2>
            <p className="text-sm text-heritage-navy-900/80 leading-relaxed text-justify">
              {fullHistory}
            </p>
          </div>

          <div className="bg-heritage-cream-50 p-8 rounded-3xl border border-heritage-gold/30 shadow-md space-y-4">
            <h3 className="font-serif text-xl font-bold text-heritage-navy-950">
              {isTamil ? 'கட்டிடக்கலை மற்றும் கலாச்சார முக்கியத்துவம்' : 'Architectural & Cultural Significance'}
            </h3>
            <p className="text-sm text-heritage-navy-900/80 leading-relaxed text-justify">
              {significance}
            </p>
          </div>
        </div>

        {/* Verified Facts & Epigraphy Sidebar */}
        <div className="space-y-6">
          <div className="bg-heritage-navy-950 text-heritage-cream-100 p-6 rounded-3xl border border-heritage-gold/40 shadow-xl space-y-4">
            <div className="flex items-center space-x-2 text-heritage-gold font-serif text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>{t.common.verifiedFacts}</span>
            </div>
            <p className="text-xs text-heritage-cream-300/80 leading-relaxed">
              Every detail presented here is strictly extracted and verified against Archaeological Survey of India (ASI) and UNESCO documentation.
            </p>

            <div className="space-y-3 pt-2">
              {monument.facts && monument.facts.map((fact) => (
                <div key={fact.id} className="p-3.5 rounded-xl bg-heritage-navy-900 border border-heritage-gold/20 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-heritage-gold tracking-wider bg-heritage-navy-800 px-2 py-0.5 rounded">
                    {fact.category}
                  </span>
                  <p className="text-xs text-heritage-cream-200 leading-relaxed">
                    {isTamil ? fact.fact_ta : fact.fact_en}
                  </p>
                  <span className="text-[10px] text-heritage-cream-400/60 block italic">
                    Source: {fact.citation}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Architectural Marvels / Highlights */}
      {monument.highlights && monument.highlights.length > 0 && (
        <div className="space-y-6 pt-6">
          <div className="flex items-center space-x-2 text-heritage-gold-dark font-serif text-xs uppercase tracking-widest font-bold">
            <Layers className="w-4 h-4" />
            <span>{t.common.highlights}</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-heritage-navy-950">
            {isTamil ? 'சிறப்பு கட்டிடக்கலை அதிசயங்கள்' : 'Structural & Sculptural Wonders'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {monument.highlights.map((h) => (
              <div 
                key={h.id}
                className="bg-white rounded-2xl overflow-hidden border border-heritage-cream-300 shadow-md flex flex-col sm:flex-row"
              >
                {h.image_url && (
                  <div className="sm:w-1/2 h-48 sm:h-auto overflow-hidden bg-heritage-navy-950 flex-shrink-0">
                    <img 
                      src={h.image_url} 
                      alt={isTamil ? h.title_ta : h.title_en} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                )}
                <div className="p-5 flex flex-col justify-center space-y-2">
                  <h4 className="font-serif text-base font-bold text-heritage-navy-950">
                    {isTamil ? h.title_ta : h.title_en}
                  </h4>
                  <p className="text-xs text-heritage-navy-800/80 leading-relaxed">
                    {isTamil ? h.description_ta : h.description_en}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
