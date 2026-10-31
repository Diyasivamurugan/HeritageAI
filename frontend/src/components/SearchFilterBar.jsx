import React from 'react';
import { Search, X, ShieldCheck, Filter } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function SearchFilterBar({ 
  searchQuery, 
  setSearchQuery, 
  selectedDynasty, 
  setSelectedDynasty, 
  unescoOnly, 
  setUnescoOnly 
}) {
  const { language, t } = useLanguage();

  const dynasties = [
    { id: 'all', label_en: 'All Dynasties', label_ta: 'அனைத்து மரபுகள்' },
    { id: 'Chola', label_en: 'Chola Empire', label_ta: 'சோழப் பேரரசு' },
    { id: 'Pallava', label_en: 'Pallava Dynasty', label_ta: 'பல்லவ அரசு' },
    { id: 'Pandya', label_en: 'Pandya Kingdom', label_ta: 'பாண்டிய நாடு' },
    { id: 'Nayaka', label_en: 'Nayaka Era', label_ta: 'நாயக்கர் காலம்' },
  ];

  return (
    <div className="bg-heritage-cream-50 p-6 rounded-2xl border border-heritage-gold/30 shadow-md space-y-4">
      
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-heritage-gold-dark">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.hero.searchPlaceholder}
          className="w-full pl-12 pr-10 py-3.5 bg-white border border-heritage-gold/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-heritage-gold focus:border-transparent text-heritage-navy-900 placeholder:text-heritage-navy-700/40 shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-heritage-navy-700/50 hover:text-heritage-navy-950"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dynasty Filter Pills & UNESCO Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        
        {/* Dynasty Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-heritage-navy-700/60 uppercase tracking-wider mr-1 flex items-center">
            <Filter className="w-3.5 h-3.5 mr-1" />
            {language === 'ta' ? 'வம்சம்:' : 'Dynasty:'}
          </span>
          {dynasties.map((dyn) => {
            const isSelected = selectedDynasty === dyn.id;
            const label = language === 'ta' ? dyn.label_ta : dyn.label_en;
            return (
              <button
                key={dyn.id}
                onClick={() => setSelectedDynasty(dyn.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-heritage-navy-900 text-heritage-gold border border-heritage-gold shadow-sm font-semibold'
                    : 'bg-white text-heritage-navy-800 border border-heritage-cream-300 hover:border-heritage-gold/50'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* UNESCO Filter */}
        <button
          onClick={() => setUnescoOnly(!unescoOnly)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            unescoOnly
              ? 'bg-emerald-900 text-emerald-200 border border-emerald-500 shadow-sm'
              : 'bg-white text-heritage-navy-700 border border-heritage-cream-300 hover:border-emerald-600/40'
          }`}
        >
          <ShieldCheck className={`w-3.5 h-3.5 ${unescoOnly ? 'text-emerald-300' : 'text-heritage-navy-500'}`} />
          <span>{language === 'ta' ? 'யுனெஸ்கோ மட்டும்' : 'UNESCO Only'}</span>
        </button>

      </div>

    </div>
  );
}
