import React from 'react';
import { MapPin, Volume2, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAudio } from '../context/AudioContext';

export default function MonumentCard({ monument, onSelect, onGenerateStory }) {
  const { language, t } = useLanguage();
  const { playAudio } = useAudio();

  const isTamil = language === 'ta';
  const name = isTamil ? monument.name_ta : monument.name_en;
  const desc = isTamil ? monument.short_desc_ta : monument.short_desc_en;
  const builtBy = isTamil ? monument.built_by_ta : monument.built_by_en;

  const handleListen = (e) => {
    e.stopPropagation();
    const audioText = isTamil
      ? `${monument.name_ta}. ${monument.short_desc_ta}. வரலாற்று காலம்: ${monument.period}.`
      : `${monument.name_en}. ${monument.short_desc_en}. Built by ${monument.built_by_en} during ${monument.period}.`;
    
    playAudio(name, audioText, language, name);
  };

  return (
    <div 
      onClick={() => onSelect(monument)}
      className="group bg-heritage-cream-50 rounded-2xl overflow-hidden border border-heritage-gold/30 hover:border-heritage-gold shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1.5"
    >
      {/* Monument Photography */}
      <div className="relative h-56 w-full overflow-hidden bg-heritage-navy-950">
        <img
          src={monument.hero_image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 brightness-90 group-hover:brightness-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-heritage-navy-950 via-heritage-navy-950/20 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-heritage-navy-900/90 text-heritage-gold border border-heritage-gold/40 shadow-sm backdrop-blur-sm">
            {monument.dynasty}
          </span>
          {monument.is_unesco && (
            <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-950/85 text-emerald-300 border border-emerald-500/40 shadow-sm backdrop-blur-sm">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>UNESCO</span>
            </span>
          )}
        </div>

        {/* Quick Audio Play Button on Image */}
        <button
          onClick={handleListen}
          className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-heritage-gold/90 text-heritage-navy-950 flex items-center justify-center hover:scale-110 active:scale-95 transition shadow-lg backdrop-blur-sm"
          title={isTamil ? "ஆடியோ விளக்கம் கேட்க" : "Listen to audio preview"}
        >
          <Volume2 className="w-4 h-4 fill-current" />
        </button>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location & Century */}
          <div className="flex items-center justify-between text-xs text-heritage-terracotta font-medium mb-1.5">
            <div className="flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{monument.district}, {monument.state}</span>
            </div>
            <span className="text-heritage-navy-700/70 font-serif">
              {monument.century_ce} CE
            </span>
          </div>

          {/* Monument Title */}
          <h3 className="font-serif text-lg font-bold text-heritage-navy-950 group-hover:text-heritage-gold-dark transition-colors line-clamp-1">
            {name}
          </h3>
          <p className="text-xs text-heritage-navy-700/60 mb-2.5 font-medium">
            {isTamil ? monument.name_en : monument.name_ta}
          </p>

          {/* Description */}
          <p className="text-xs text-heritage-navy-800/80 leading-relaxed line-clamp-3 mb-4">
            {desc}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-heritage-cream-300 flex items-center justify-between gap-2">
          <button
            onClick={() => onSelect(monument)}
            className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-heritage-navy-900 text-heritage-gold hover:bg-heritage-navy-800 transition shadow-sm"
          >
            <span>{t.common.viewDetails}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {onGenerateStory && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onGenerateStory(monument);
              }}
              className="p-2 rounded-xl bg-heritage-gold/20 text-heritage-gold-dark hover:bg-heritage-gold hover:text-heritage-navy-950 border border-heritage-gold/40 transition"
              title={isTamil ? "AI வரலாற்று கதை உருவாக்குக" : "Generate AI Historical Story"}
            >
              <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
