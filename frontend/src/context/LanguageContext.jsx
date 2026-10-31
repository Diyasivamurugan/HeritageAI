import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const TRANSLATIONS = {
  en: {
    nav: {
      home: "Home",
      explore: "Explore Heritage",
      stories: "AI Storytelling",
      audio: "Audio Stories",
      chatbot: "AI Chatbot",
      map: "Interactive Map",
      quiz: "Cultural Quiz",
      about: "About Us",
      langSwitch: "தமிழ்",
    },
    hero: {
      badge: "Archaeological AI Initiative",
      titleStart: "Discover the Sacred",
      titleHighlight: "Living Heritage",
      titleEnd: "of Tamil Nadu",
      subtitle: "Experience ancient Chola, Pallava, and Pandya monuments through AI-powered local-language narratives, interactive mapping, and verified historical records.",
      exploreBtn: "Explore Heritage",
      storyBtn: "Listen to Stories",
      searchPlaceholder: "Search temples, forts, dynasties (e.g., Thanjavur, Chola)...",
    },
    common: {
      viewDetails: "Explore Monument",
      listenAudio: "Listen Audio",
      readStory: "Read AI Story",
      unesco: "UNESCO World Heritage",
      dynasty: "Dynasty",
      period: "Period",
      location: "Location",
      architecturalStyle: "Architectural Style",
      highlights: "Architectural Marvels",
      verifiedFacts: "Verified Historical Archives",
    }
  },
  ta: {
    nav: {
      home: "முகப்பு",
      explore: "மரபு உலா",
      stories: "AI கதைகள்",
      audio: "ஒலி கதைகள்",
      chatbot: "மரபு அறிவன்",
      map: "வரைபடம்",
      quiz: "மரபு வினாடி-வினா",
      about: "எங்களைப் பற்றி",
      langSwitch: "English",
    },
    hero: {
      badge: "தொல்லியல் AI தளம்",
      titleStart: "தமிழ்நாட்டின் அழியா",
      titleHighlight: "புனித மரபுச் சின்னங்களை",
      titleEnd: "அறிவோம்",
      subtitle: "சோழ, பல்லவ, பாண்டிய மற்றும் நாயக்க மன்னர்களின் கட்டிடக்கலை அதிசயங்களை தாய்மொழிக் கதைகள், ஊடாடும் வரைபடம் மற்றும் வரலாற்றுத் தரவுகளுடன் காணுங்கள்.",
      exploreBtn: "மரபுச் சின்னங்களை காண்க",
      storyBtn: "கதைகளைக் கேட்க",
      searchPlaceholder: "கோயில்கள், கோட்டைகள், வம்சங்களை தேடவும் (எ.கா: தஞ்சாவூர், சோழர்)...",
    },
    common: {
      viewDetails: "முழு விவரம்",
      listenAudio: "ஒலிக் கதை கேட்க",
      readStory: "AI கதை வாசிக்க",
      unesco: "யுனெஸ்கோ உலக மரபுச் சின்னம்",
      dynasty: "வம்சம்",
      period: "காலம்",
      location: "இடம்",
      architecturalStyle: "கட்டிடக்கலை பாணி",
      highlights: "கட்டிடக்கலை அதிசயங்கள்",
      verifiedFacts: "சரிபார்க்கப்பட்ட வரலாற்று ஆவணங்கள்",
    }
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'ta' : 'en'));
  };

  const t = TRANSLATIONS[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
