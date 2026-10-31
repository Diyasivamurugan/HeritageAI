import React, { useState } from 'react';
import { 
  Volume2, 
  Play, 
  Pause, 
  Headphones, 
  Clock, 
  ShieldCheck, 
  Globe2, 
  Sparkles,
  Bookmark
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAudio } from '../context/AudioContext';

export default function AudioStoriesPage({ monuments, onNavigate }) {
  const { language } = useLanguage();
  const { currentTrack, isPlaying, playAudio, pauseAudio, resumeAudio } = useAudio();
  const [filterLang, setFilterLang] = useState(language || 'en');

  const isTamil = filterLang === 'ta';

  const audioTracks = [
    {
      id: 'track-1',
      monument_id: 1,
      monument_name_en: "Brihadeeswarar Temple",
      monument_name_ta: "தஞ்சைப் பெரிய கோயில்",
      dynasty: "Chola",
      title_en: "Symphony in Granite: Raising the 80-Tonne Cupola",
      title_ta: "கல்லில் வடித்த காலத்தின் காவியம்: 80 டன் சிகரக் கலசம்",
      narrator_en: "Chief Royal Architect (Sthapati)",
      narrator_ta: "தலைமை அரச சிற்பி",
      duration: "3 min",
      content_en: "The morning sun breaks over the Kaveri plains, glinting off the colossal blocks of granite. As the chief sthapati under Emperor Raja Raja Chola, every joint was locked dry without mortar—stone kissing stone with mathematical perfection. We raised an earthen ramp that stretched across miles to lift the great crown stone. When the evening breeze whispers through the pillared corridors, it is not silence you hear, but the eternal pulse of Chola genius.",
      content_ta: "நான் இந்தக் கற்களை வெறும் பாறைகளாகப் பார்க்கவில்லை; தமிழரின் அழியா ஆன்மாவாகப் பார்க்கிறேன். முதலாம் இராஜராஜ சோழனின் ஆணைப்படி நாம் பணியைத் தொடங்கிய நாள் எனக்கு இன்னும் நினைவிருக்கிறது. எந்தவொரு சாந்தும் இல்லாமல், ஒரு கல்லை மற்றொரு கல்லுடன் பூட்டி நிற்குமாறு செதுக்குவது எங்கள் தலைமுறையின் பெருங்கலை. 216 அடி உயரத்திற்கு 80 டன் எடையுள்ள ஒற்றைக்கல்லை சாய்வுதளம் வழியே ஏற்றி முடித்த அந்த தருணம் தெய்வ சங்கல்பமாக நிலைத்து நிற்கிறது.",
      image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 'track-2',
      monument_id: 2,
      monument_name_en: "Mahabalipuram Monuments",
      monument_name_ta: "மாமல்லபுர கடற்கரைக் கோயில்",
      dynasty: "Pallava",
      title_en: "Whispers of the Salt Waves: The Shore Temple at Dawn",
      title_ta: "உப்புக் கடலலையின் குரல்: மாமல்லபுர விடியல்",
      narrator_en: "Silk-Route Voyager",
      narrator_ta: "பட்டுப்பாதை கடல் பயணி",
      duration: "4 min",
      content_en: "Having sailed from distant ports across uncharted waters, I thought I had witnessed all the wonders the old world could offer. Yet nothing prepared me for the silhouette of the Shore Temple piercing the dawn sky. Carved to withstand the spray of the Bay of Bengal for over thirteen centuries, this Pallava jewel greeted merchant armadas carrying silk, spice, and Roman gold.",
      content_ta: "எத்தனையோ கடல்களையும் தேசங்களையும் கடந்து வந்துள்ளேன்; ஆனால் பல்லவ நாட்டின் மாமல்லபுரத்தை நேரில் கண்டபோது என் கண்கள் அகல விரிந்தன. வங்காள விரிகுடாவின் உப்புக்காற்றையும் கடலலையையும் எதிர்கொண்டு 1,300 ஆண்டுகளைக் கடந்து நிற்கும் இந்தக் கடற்கரைக் கோயில், தமிழர்களின் உன்னத கடல் வர்த்தகத்திற்கும் சிற்பக் கலைக்கும் மாபெரும் சான்றாக ஒளிவீசுகிறது.",
      image: "https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 'track-3',
      monument_id: 3,
      monument_name_en: "Meenakshi Amman Temple",
      monument_name_ta: "மதுரை மீனாட்சி அம்மன் ஆலயம்",
      dynasty: "Pandya & Nayaka",
      title_en: "Cosmic Labyrinth: Echoes from the Hall of 1000 Pillars",
      title_ta: "ஆயிரங்கால் மண்டபத்தின் இசை எதிரொலிகள்",
      narrator_en: "Temple Devotee & Musician",
      narrator_ta: "ஆலய இசைக்கலைஞர்",
      duration: "3.5 min",
      content_en: "Step softly across the cool polished stone flagstones of Madurai. Around you rise 985 monolithic pillars, each sculpted with celestial dancers, warriors, and roaring yalis. Strike the five musical pillars near the north entrance, and the pure swaras of Carnatic ragas ring out from solid granite—a testament to acoustics and devotion intertwining as one.",
      content_ta: "மதுரையின் குளிர்ச்சியான கருங்கல் மண்டபங்களில் மெல்ல அடியெடுத்து வையுங்கள். உங்களைச் சுற்றி 985 ஒற்றைக்கல் தூண்கள் நடன மங்கையரின் எழிலோடு காட்சியளிக்கின்றன. வடக்குப் பகுதியில் உள்ள ஐந்து இசைத் தூண்களைத் தட்டிப் பாருங்கள்; கடினமான கருங்கல்லிலிருந்து சப்த ஸ்வரங்களின் தெய்வீக நாதம் எழும்பி இதயத்தை உருக்கும்.",
      image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 'track-4',
      monument_id: 4,
      monument_name_en: "Gangaikonda Cholapuram",
      monument_name_ta: "கங்கைகொண்ட சோழபுரம்",
      dynasty: "Chola",
      title_en: "Ganga in the South: The Victorious City of Rajendra Chola",
      title_ta: "தென்னகத்துக் கங்கை: இராஜேந்திர சோழனின் வெற்றி நகர்",
      narrator_en: "Imperial Court Poet",
      narrator_ta: "அரசவைக் கவிஞர்",
      duration: "3 min",
      content_en: "From the northern riverbanks of Bengal to the Strait of Malacca, the naval fleet of Rajendra Chola brought holy water and sovereign respect to the Kaveri delta. The vimana here bows with gentle feminine curves, honoring the father's temple at Thanjavur while singing of conquest and grace.",
      content_ta: "கங்கை நதி வரை சென்று வடநாட்டு மன்னர்களை வென்று திரும்பிய முதலாம் இராஜேந்திர சோழன், கங்கை நீரைக் கொண்டுவந்து 'சோழ கங்கம்' என்னும் மாபெரும் ஏரியை அமைத்தான். தந்தையின் தஞ்சை பெரிய கோவிலை விட சற்று வளைந்த பெண்மை நயத்துடன் 182 அடி உயர விமானத்தை வானுயர நிறுவி சரித்திரம் படைத்தான்.",
      image: "https://images.unsplash.com/photo-1622396481304-4ad4901ff0f4?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 'track-5',
      monument_id: 5,
      monument_name_en: "Gingee Fort",
      monument_name_ta: "செஞ்சிக் கோட்டை",
      dynasty: "Maratha / Nayaka",
      title_en: "Troy of the East: The Vertical Chasm of Rajagiri",
      title_ta: "கிழக்கின் ட்ராய்: ராஜகிரி உச்சி மலையின் காவல்",
      narrator_en: "Fortress Commander",
      narrator_ta: "கோட்டைத் தளபதி",
      duration: "4 min",
      content_en: "Three sheer granite mountains linked by eight miles of battlements. To reach the citadel of Rajagiri, one must cross a single narrow drawbridge over a sixty-foot vertical void. Neither Mughal siege guns nor Carnatic cavalry could easily pierce this fortress that Chhatrapati Shivaji crowned India's most impregnable sanctuary.",
      content_ta: "மூன்று செங்குத்தான மலைகளை இணைக்கும் 13 கி.மீ நீள மதில்சுவர்கள். ராஜகிரி உச்சி கோட்டையை அடைய 60 அடி ஆழ பள்ளத்தாக்கின் மீதுள்ள ஒற்றை மரப்பாலத்தை மட்டுமே கடக்க வேண்டும். எப்பேர்ப்பட்ட படைகளும் நெருங்க முடியாத இந்த இயற்கை அரணை சத்ரபதி சிவாஜி 'இந்தியாவிலேயே வெல்ல முடியாத கோட்டை' எனப் போற்றினார்.",
      image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80"
    }
  ];

  const handleTrackToggle = (track) => {
    const title = isTamil ? track.title_ta : track.title_en;
    const content = isTamil ? track.content_ta : track.content_en;
    const monumentName = isTamil ? track.monument_name_ta : track.monument_name_en;

    if (currentTrack && currentTrack.title === title && isPlaying) {
      pauseAudio();
    } else if (currentTrack && currentTrack.title === title && !isPlaying) {
      resumeAudio();
    } else {
      playAudio(title, content, filterLang, monumentName);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-heritage-navy-950 text-heritage-cream-100 p-8 sm:p-12 rounded-3xl border border-heritage-gold/30 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-heritage-gold">
            <Headphones className="w-4 h-4" />
            <span>{isTamil ? 'ஆடியோ கேட்கும் கூடம்' : 'Curated Audio Storytelling Room'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            {isTamil ? 'வரலாற்று குரல் கதைகள்' : 'Immersive Audio Narrations'}
          </h1>
          <p className="text-sm sm:text-base text-heritage-cream-200/80 leading-relaxed font-light">
            {isTamil
              ? 'கண்களை மூடி வரலாற்றைக் கேளுங்கள். அரண்மனை தலைமை சிற்பி, பட்டுப்பாதை பயணி மற்றும் கவிஞரின் குரலில் தமிழ் மற்றும் ஆங்கிலத்தில் ஒலிக்கும் வரலாற்று இதிகாசம்.'
              : 'Close your eyes and journey back through centuries. Listen to authentic historical narratives performed via speech synthesis in rich classical prose and pure Tamil.'
            }
          </p>
        </div>

        {/* Language Switcher */}
        <div className="mt-6 flex items-center space-x-3">
          <button
            onClick={() => setFilterLang('en')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold border transition ${
              filterLang === 'en'
                ? 'bg-heritage-gold text-heritage-navy-950 border-heritage-gold shadow-md'
                : 'bg-heritage-navy-900 text-heritage-cream-200 border-heritage-gold/30 hover:border-heritage-gold'
            }`}
          >
            English Narration
          </button>
          <button
            onClick={() => setFilterLang('ta')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold border transition ${
              filterLang === 'ta'
                ? 'bg-heritage-gold text-heritage-navy-950 border-heritage-gold shadow-md'
                : 'bg-heritage-navy-900 text-heritage-cream-200 border-heritage-gold/30 hover:border-heritage-gold'
            }`}
          >
            தமிழ் குரல் வடிவம்
          </button>
        </div>
      </div>

      {/* Audio Stories List */}
      <div className="space-y-4">
        {audioTracks.map((track) => {
          const title = isTamil ? track.title_ta : track.title_en;
          const monumentName = isTamil ? track.monument_name_ta : track.monument_name_en;
          const narrator = isTamil ? track.narrator_ta : track.narrator_en;
          const content = isTamil ? track.content_ta : track.content_en;
          const isThisTrackActive = currentTrack && currentTrack.title === title;
          const isThisTrackPlaying = isThisTrackActive && isPlaying;

          return (
            <div
              key={track.id}
              className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
                isThisTrackActive
                  ? 'bg-heritage-navy-950 text-heritage-cream-100 border-heritage-gold shadow-xl gold-glow'
                  : 'bg-white text-heritage-navy-950 border-heritage-cream-300 hover:border-heritage-gold/50 shadow-sm'
              }`}
            >
              {/* Thumbnail & Title Info */}
              <div className="flex items-start sm:items-center space-x-4">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-heritage-navy-900">
                  <img
                    src={track.image}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-heritage-navy-950/20" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="font-bold text-heritage-terracotta uppercase tracking-wider">
                      {monumentName}
                    </span>
                    <span className="opacity-50">•</span>
                    <span className="text-heritage-gold font-medium">
                      {track.dynasty}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold">
                    {title}
                  </h3>

                  <div className="flex items-center space-x-3 text-xs opacity-70">
                    <span>{narrator}</span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{track.duration}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Play / Pause Action Button */}
              <div className="flex items-center space-x-3 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-heritage-cream-200">
                <button
                  onClick={() => handleTrackToggle(track)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-serif text-xs font-bold uppercase tracking-wider transition shadow-md ${
                    isThisTrackPlaying
                      ? 'bg-heritage-terracotta text-white hover:scale-105'
                      : 'bg-heritage-gold text-heritage-navy-950 hover:scale-105 active:scale-95'
                  }`}
                >
                  {isThisTrackPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>{isTamil ? 'நிறுத்து' : 'Pause'}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                      <span>{isTamil ? 'கேட்க' : 'Play Narration'}</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
