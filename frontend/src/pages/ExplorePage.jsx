import React, { useState, useMemo } from 'react';
import { Compass, Sparkles, Filter, ShieldCheck, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import MonumentCard from '../components/MonumentCard';
import SearchFilterBar from '../components/SearchFilterBar';

export default function ExplorePage({ 
  monuments, 
  onSelectMonument, 
  onGenerateStory,
  initialSearch = '',
  initialDynasty = 'all'
}) {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedDynasty, setSelectedDynasty] = useState(initialDynasty);
  const [unescoOnly, setUnescoOnly] = useState(false);

  const isTamil = language === 'ta';

  // Filtered Monuments calculation
  const filteredMonuments = useMemo(() => {
    return monuments.filter((m) => {
      // Search text match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || (
        m.name_en.toLowerCase().includes(query) ||
        m.name_ta.includes(query) ||
        m.dynasty.toLowerCase().includes(query) ||
        m.district.toLowerCase().includes(query) ||
        m.architectural_style_en.toLowerCase().includes(query)
      );

      // Dynasty match
      const matchesDynasty = selectedDynasty === 'all' || 
        m.dynasty.toLowerCase().includes(selectedDynasty.toLowerCase());

      // UNESCO match
      const matchesUnesco = !unescoOnly || m.is_unesco;

      return matchesSearch && matchesDynasty && matchesUnesco;
    });
  }, [monuments, searchQuery, selectedDynasty, unescoOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-heritage-navy-950 text-heritage-cream-100 p-8 sm:p-12 rounded-3xl border border-heritage-gold/30 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-heritage-gold/10 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-heritage-gold">
            <Compass className="w-4 h-4" />
            <span>{isTamil ? 'மரபு களஞ்சியம்' : 'Verified Archaeological Catalog'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            {isTamil ? 'தமிழ்நாட்டின் வரலாற்று மரபுச் சின்னங்கள்' : 'Explore Cultural Heritage Monuments'}
          </h1>
          <p className="text-sm sm:text-base text-heritage-cream-200/80 leading-relaxed font-light">
            {isTamil
              ? 'யுனெஸ்கோ அங்கீகரித்த சோழர் கோயில்கள், பல்லவர் கால ஒற்றைக்கல் ரதங்கள் மற்றும் நாயக்கர் அரண்களை துல்லியமான வரலாற்றுப் பதிவுகளுடன் காண்க.'
              : 'Discover living UNESCO sanctuaries, granite vimanas, and rock-cut marvels across Thanjavur, Mamallapuram, Madurai, Ariyalur, and Gingee.'
            }
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedDynasty={selectedDynasty}
        setSelectedDynasty={setSelectedDynasty}
        unescoOnly={unescoOnly}
        setUnescoOnly={setUnescoOnly}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between border-b border-heritage-cream-300 pb-4">
        <div className="text-sm text-heritage-navy-800 font-medium">
          {isTamil 
            ? `கண்டுபிடிக்கப்பட்ட சின்னங்கள்: ${filteredMonuments.length}`
            : `Showing ${filteredMonuments.length} Verified Monuments`
          }
        </div>
        {(searchQuery || selectedDynasty !== 'all' || unescoOnly) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDynasty('all');
              setUnescoOnly(false);
            }}
            className="text-xs text-heritage-terracotta hover:underline font-semibold"
          >
            {isTamil ? 'வடிகட்டிகளை அழிக்க' : 'Reset All Filters'}
          </button>
        )}
      </div>

      {/* Monuments Grid */}
      {filteredMonuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMonuments.map((monument) => (
            <MonumentCard
              key={monument.id}
              monument={monument}
              onSelect={onSelectMonument}
              onGenerateStory={onGenerateStory}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-heritage-cream-300 p-8 space-y-4">
          <div className="text-4xl">🏛️</div>
          <h3 className="font-serif text-xl font-bold text-heritage-navy-950">
            {isTamil ? 'சின்னங்கள் ஏதும் பொருந்தவில்லை' : 'No monuments match your query'}
          </h3>
          <p className="text-sm text-heritage-navy-700 max-w-md mx-auto">
            {isTamil
              ? 'வேறு ஏதேனும் சொல் அல்லது வம்சத்தின் பெயரைப் பயன்படுத்தி தேடிப் பாருங்கள்.'
              : 'Try clearing your search query or selecting a different dynasty filter.'
            }
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDynasty('all');
              setUnescoOnly(false);
            }}
            className="px-6 py-2.5 rounded-xl bg-heritage-navy-900 text-heritage-gold font-semibold text-xs tracking-wider uppercase hover:bg-heritage-gold hover:text-heritage-navy-950 transition"
          >
            {isTamil ? 'அனைத்து சின்னங்களையும் காட்டுக' : 'View All Monuments'}
          </button>
        </div>
      )}

    </div>
  );
}
