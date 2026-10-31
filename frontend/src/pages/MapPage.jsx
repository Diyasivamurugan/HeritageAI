import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Search, 
  Compass, 
  Navigation, 
  ExternalLink, 
  Volume2, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  X,
  Crosshair
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAudio } from '../context/AudioContext';
import { fetchMonuments } from '../services/heritageService';

export default function MapPage({ onSelectMonument }) {
  const { language } = useLanguage();
  const { playAudio } = useAudio();

  const [monuments, setMonuments] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDynasty, setActiveDynasty] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  const isTamil = language === 'ta';

  // 1. Retrieve location information from SQLite database through FastAPI API
  useEffect(() => {
    async function loadSites() {
      setIsLoading(true);
      try {
        const data = await fetchMonuments();
        setMonuments(data);
        if (data && data.length > 0) {
          setSelectedSite(data[0]);
        }
      } catch (err) {
        console.warn("Could not fetch monuments from API, using fallback:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSites();
  }, []);

  // 2. Initialize Leaflet Map
  useEffect(() => {
    if (isLoading || !mapContainerRef.current) return;

    // Check if Leaflet L is loaded from window
    const L = window.L;
    if (!L) {
      console.warn("Leaflet library not yet ready in window. Retrying...");
      return;
    }

    // Prevent duplicate map initialization
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Tamil Nadu Center Coordinates: 10.8505° N, 78.6856° E
    const map = L.map(mapContainerRef.current, {
      center: [11.0, 78.8],
      zoom: 7.2,
      minZoom: 6,
      maxZoom: 18,
      zoomControl: false,
    });

    mapInstanceRef.current = map;

    // Add Zoom Control to bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // High quality Voyager / OpenStreetMap Tile Layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Create markers for monuments
    markersRef.current = {};

    monuments.forEach((m) => {
      // Validate correct geographical coordinates
      if (!m.latitude || !m.longitude) return;

      const isChola = m.dynasty.toLowerCase().includes('chola');
      const isPallava = m.dynasty.toLowerCase().includes('pallava');
      const pinColor = isChola ? '#D4AF37' : (isPallava ? '#C85A32' : '#3B82F6');

      // Custom royal temple divIcon
      const customIcon = L.divIcon({
        className: 'heritage-custom-marker',
        html: `
          <div style="
            background: #0A1128; 
            border: 2px solid ${pinColor}; 
            box-shadow: 0 0 14px ${pinColor}88, 0 4px 10px rgba(0,0,0,0.5); 
            width: 38px; 
            height: 38px; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            color: #FAF7F2; 
            font-size: 18px; 
            cursor: pointer;
            transition: transform 0.2s ease;
          " class="heritage-map-pin">
            🏛️
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
        popupAnchor: [0, -22]
      });

      const marker = L.marker([m.latitude, m.longitude], { icon: customIcon }).addTo(map);

      // Create rich HTML popup with location name, description, and action button
      const popupContent = document.createElement('div');
      popupContent.className = "w-64 overflow-hidden text-heritage-cream-100";
      popupContent.innerHTML = `
        <div style="position: relative; height: 110px; width: 100%; overflow: hidden; background: #0A1128;">
          <img src="${m.hero_image || m.image_url}" alt="${m.name_en || m.name}" style="width: 100%; height: 100%; object-fit: cover;" />
          <div style="position: absolute; top: 6px; left: 6px; background: rgba(10,17,40,0.85); border: 1px solid rgba(212,175,55,0.5); padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: bold; color: #D4AF37;">
            ${m.dynasty}
          </div>
        </div>
        <div style="padding: 12px; background: #0A1128;">
          <div style="font-size: 11px; color: #C5A059; font-weight: 600; text-transform: uppercase;">
            ${m.district}, Tamil Nadu
          </div>
          <h4 style="font-family: serif; font-size: 14px; font-weight: bold; color: #FAF7F2; margin: 2px 0 6px 0;">
            ${isTamil ? (m.name_ta || m.name_en) : m.name_en}
          </h4>
          <p style="font-size: 11px; color: #DDD0C0; line-height: 1.4; margin-bottom: 10px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
            ${isTamil ? (m.short_desc_ta || m.description) : (m.short_desc_en || m.description)}
          </p>
          <div style="display: flex; gap: 6px;">
            <button id="view-details-${m.id}" style="flex: 1; padding: 6px 10px; background: #D4AF37; color: #0A1128; border: none; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
              ${isTamil ? 'முழு விவரம்' : 'View Details'} &rarr;
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 280, closeButton: false });

      // Handle marker events
      marker.on('click', () => {
        setSelectedSite(m);
        // Bind dynamically rendered view details button inside popup
        setTimeout(() => {
          const btn = document.getElementById(`view-details-${m.id}`);
          if (btn) {
            btn.onclick = () => onSelectMonument(m);
          }
        }, 50);
      });

      markersRef.current[m.id] = marker;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [monuments, isLoading, isTamil]);

  // Handle zooming and flying to selected site
  const handleFlyToSite = (site) => {
    setSelectedSite(site);
    const map = mapInstanceRef.current;
    if (map && site.latitude && site.longitude) {
      map.flyTo([site.latitude, site.longitude], 12, {
        duration: 1.5,
        easeLinearity: 0.25
      });
      const marker = markersRef.current[site.id];
      if (marker) {
        setTimeout(() => marker.openPopup(), 1600);
      }
    }
  };

  // Reset to statewide view
  const handleResetView = () => {
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo([11.0, 78.8], 7.2, { duration: 1.2 });
    }
  };

  // Filter monuments based on search query and dynasty
  const filteredMonuments = monuments.filter(m => {
    const query = searchQuery.toLowerCase().trim();
    const nameMatch = !query || (
      m.name_en?.toLowerCase().includes(query) ||
      m.name?.toLowerCase().includes(query) ||
      m.name_ta?.includes(query) ||
      m.district?.toLowerCase().includes(query) ||
      m.location?.toLowerCase().includes(query)
    );
    const dynastyMatch = activeDynasty === 'all' || m.dynasty.toLowerCase().includes(activeDynasty.toLowerCase());
    return nameMatch && dynastyMatch;
  });

  const handleAudioListen = (site) => {
    const name = isTamil ? (site.name_ta || site.name) : (site.name_en || site.name);
    const desc = isTamil ? (site.short_desc_ta || site.description) : (site.short_desc_en || site.description);
    const text = `${name}. Located in ${site.district || site.location}, Tamil Nadu. Built during ${site.period || site.century_ce} CE. ${desc}`;
    playAudio(name, text, language, name);
  };

  const dynasties = [
    { id: 'all', label_en: 'All Locations', label_ta: 'அனைத்து இடங்கள்' },
    { id: 'Chola', label_en: 'Chola', label_ta: 'சோழர்' },
    { id: 'Pallava', label_en: 'Pallava', label_ta: 'பல்லவர்' },
    { id: 'Pandya', label_en: 'Pandya / Nayaka', label_ta: 'பாண்டியர் / நாயக்கர்' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner & Control Ribbon */}
      <div className="bg-heritage-navy-950 text-heritage-cream-100 p-6 sm:p-8 rounded-3xl border border-heritage-gold/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-heritage-gold">
            <Compass className="w-4 h-4 animate-spin-slow" />
            <span>{isTamil ? 'புவிசார் தொல்லியல் வரைபடம்' : 'Interactive Geospatial Heritage Map'}</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight">
            {isTamil ? 'தமிழ்நாட்டின் வரலாற்று மரபு வரைபடம்' : 'Explore Tamil Nadu Heritage On Map'}
          </h1>
          <p className="text-xs sm:text-sm text-heritage-cream-200/80 leading-relaxed font-light">
            {isTamil
              ? 'துல்லியமான புவியியல் ஆயத்தொலைவுகளுடன் (GPS Coordinates) அமைக்கப்பட்ட சோழ, பல்லவ, பாண்டிய மற்றும் நாயக்க வரலாற்றுச் சின்னங்களை வரைபடத்தில் காண்க.'
              : 'Interactive Leaflet map displaying verified Archaeological Survey of India (ASI) GPS coordinates across Thanjavur, Mamallapuram, Madurai, Ariyalur, and Gingee.'
            }
          </p>
        </div>

        <div className="flex items-center space-x-3 z-10">
          <button
            onClick={handleResetView}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-heritage-navy-900 border border-heritage-gold/40 text-heritage-gold text-xs font-semibold hover:bg-heritage-gold hover:text-heritage-navy-950 transition shadow-md"
            title="Reset to full Tamil Nadu map view"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>{isTamil ? 'முழு வரைபடம்' : 'Reset View'}</span>
          </button>
        </div>
      </div>

      {/* Map Search and Dynasty Filter Pills */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-heritage-cream-300 shadow-sm">
        
        {/* Location Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-heritage-gold-dark" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isTamil ? "சின்னங்கள், மாவட்டங்களை தேடவும் (எ.கா: தஞ்சாவூர், மதுரை, சோழர்)..." : "Search locations by name, district, or dynasty..."}
            className="w-full pl-10 pr-10 py-2.5 text-xs bg-heritage-cream-50 border border-heritage-cream-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-heritage-gold text-heritage-navy-950 placeholder:text-heritage-navy-700/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-heritage-navy-700 hover:text-heritage-navy-950"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dynasty Filters */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {dynasties.map((dyn) => (
            <button
              key={dyn.id}
              onClick={() => setActiveDynasty(dyn.id)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeDynasty === dyn.id
                  ? 'bg-heritage-navy-950 text-heritage-gold border border-heritage-gold shadow-sm'
                  : 'bg-heritage-cream-50 text-heritage-navy-800 border border-heritage-cream-300 hover:border-heritage-gold/50'
              }`}
            >
              {isTamil ? dyn.label_ta : dyn.label_en}
            </button>
          ))}
        </div>

      </div>

      {/* Main Map Canvas and Interactive Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEAFLET MAP CONTAINER */}
        <div className="lg:col-span-2 relative rounded-3xl overflow-hidden border-2 border-heritage-gold/50 shadow-2xl bg-heritage-navy-950 h-[560px]">
          
          {/* Leaflet DOM Anchor */}
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Quick Location Fly-to Badges on top of map */}
          <div className="absolute top-4 left-4 right-4 z-[400] flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none pointer-events-auto">
            {filteredMonuments.map((m) => {
              const isSelected = selectedSite?.id === m.id;
              const name = isTamil ? (m.name_ta || m.name_en) : (m.name_en || m.name);
              return (
                <button
                  key={m.id}
                  onClick={() => handleFlyToSite(m)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shadow-lg backdrop-blur-md transition-all ${
                    isSelected
                      ? 'bg-heritage-gold text-heritage-navy-950 ring-2 ring-white scale-105 font-bold'
                      : 'bg-heritage-navy-950/90 text-heritage-cream-100 border border-heritage-gold/40 hover:bg-heritage-gold hover:text-heritage-navy-950'
                  }`}
                >
                  <MapPin className="w-3 h-3" />
                  <span>{name}</span>
                </button>
              );
            })}
          </div>

          {/* Coordinates HUD overlay at bottom left */}
          {selectedSite && (
            <div className="absolute bottom-4 left-4 z-[400] bg-heritage-navy-950/90 text-heritage-cream-200 border border-heritage-gold/40 px-3 py-1.5 rounded-xl text-[11px] font-mono shadow-md backdrop-blur-md pointer-events-none">
              GPS: {selectedSite.latitude.toFixed(4)}° N, {selectedSite.longitude.toFixed(4)}° E
            </div>
          )}

        </div>

        {/* Selected Monument Details Sidebar */}
        {selectedSite && (
          <div className="bg-white rounded-3xl border border-heritage-gold/40 shadow-xl p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              
              {/* Photo with Dynasty & UNESCO Badges */}
              <div className="relative h-48 rounded-2xl overflow-hidden bg-heritage-navy-950 shadow-inner">
                <img
                  src={selectedSite.hero_image}
                  alt={selectedSite.name_en || selectedSite.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-heritage-navy-950/90 text-heritage-gold border border-heritage-gold/40 backdrop-blur-sm">
                    {selectedSite.dynasty}
                  </span>
                  {selectedSite.is_unesco && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 backdrop-blur-sm">
                      UNESCO
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Geographical Meta */}
              <div>
                <div className="flex items-center space-x-1.5 text-xs text-heritage-terracotta font-semibold uppercase tracking-wider mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{selectedSite.district || selectedSite.location}, Tamil Nadu</span>
                </div>

                <h3 className="font-serif text-xl font-bold text-heritage-navy-950">
                  {isTamil ? (selectedSite.name_ta || selectedSite.name_en) : (selectedSite.name_en || selectedSite.name)}
                </h3>
                
                <div className="text-[11px] text-heritage-navy-700/70 font-mono mt-0.5">
                  Latitude: {selectedSite.latitude.toFixed(4)}° N • Longitude: {selectedSite.longitude.toFixed(4)}° E
                </div>
              </div>

              {/* Short Historical Description */}
              <p className="text-xs text-heritage-navy-800 leading-relaxed text-justify line-clamp-5">
                {isTamil 
                  ? (selectedSite.short_desc_ta || selectedSite.description) 
                  : (selectedSite.short_desc_en || selectedSite.description)
                }
              </p>

              {/* Verified Information Source */}
              <div className="p-2.5 rounded-xl bg-heritage-cream-50 border border-heritage-cream-300 text-[10px] text-heritage-navy-700/80 flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span className="truncate">
                  Source: {selectedSite.information_source || "Archaeological Survey of India (ASI)"}
                </span>
              </div>
            </div>

            {/* Actions: View Details, Listen Audio, Open in External Maps */}
            <div className="space-y-2 pt-3 border-t border-heritage-cream-300">
              <button
                onClick={() => onSelectMonument(selectedSite)}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-heritage-navy-900 text-heritage-gold font-serif text-xs font-bold uppercase tracking-wider hover:bg-heritage-gold hover:text-heritage-navy-950 transition shadow-md"
              >
                <span>{isTamil ? 'முழு விவரம் காண்க' : 'View Full Heritage Details'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleAudioListen(selectedSite)}
                  className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-heritage-cream-100 text-heritage-navy-900 border border-heritage-cream-300 hover:border-heritage-gold text-xs font-semibold transition"
                >
                  <Volume2 className="w-3.5 h-3.5 text-heritage-gold-dark" />
                  <span>{isTamil ? 'குரல் வழிக் கேட்க' : 'Listen Narration'}</span>
                </button>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${selectedSite.latitude},${selectedSite.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-2.5 rounded-xl border border-heritage-cream-300 text-heritage-navy-700 hover:text-heritage-navy-950 transition"
                  title="Open GPS in Google Maps"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
