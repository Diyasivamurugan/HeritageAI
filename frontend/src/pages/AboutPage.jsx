import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Award, 
  Code2, 
  Database, 
  Layers, 
  Compass, 
  Volume2, 
  Heart,
  Cpu
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AboutPage() {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  const techStack = [
    {
      category: "Frontend Architecture",
      items: ["React.js 18", "Vite", "Tailwind CSS", "Lucide React", "Web Speech API"]
    },
    {
      category: "Backend Engine",
      items: ["Python 3", "FastAPI (Asynchronous REST)", "Pydantic v2", "Uvicorn"]
    },
    {
      category: "Database & ORM",
      items: ["SQLite 3", "SQLAlchemy 2.0 ORM", "ASI Historical Corpus"]
    },
    {
      category: "Artificial Intelligence",
      items: ["Google Gemini API (1.5/2.5 Flash)", "Retrieval-Augmented Generation (RAG)", "Anti-Hallucination Grounding"]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-heritage-gold/20 text-heritage-gold-dark text-xs font-bold uppercase tracking-widest border border-heritage-gold/30">
          <Award className="w-3.5 h-3.5" />
          <span>{isTamil ? 'திட்டத்தைப் பற்றி' : 'About the HeritageAI Project'}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-heritage-navy-950">
          {isTamil ? 'கலாச்சார மரபும் நவீன செயற்கை நுண்ணறிவும்' : 'Bridging Millennia with Generative AI'}
        </h1>
        <p className="text-sm sm:text-base text-heritage-navy-800/80 leading-relaxed font-light">
          {isTamil
            ? 'ஹெரிடேஜ் ஏஐ என்பது கணினி அறிவியல் இரண்டாம் ஆண்டு மாணவர் திட்டமாக, தமிழ்நாட்டின் உலகப் புகழ் பெற்ற மரபுச் சின்னங்களை நவீன தொழில்நுட்பத்தின் மூலம் உலகிற்கு கொண்டு சேர்க்க உருவாக்கப்பட்ட முழுமையான தளம்.'
            : 'HeritageAI is engineered as a full-stack, AI-powered cultural exploration and local-language storytelling platform developed as a major Computer Science & Engineering capstone project.'
          }
        </p>
      </div>

      {/* College Evaluation & Academic Purpose Card */}
      <div className="bg-heritage-navy-950 text-heritage-cream-100 rounded-3xl p-8 sm:p-12 border border-heritage-gold/40 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center space-x-2 text-heritage-gold text-xs font-bold uppercase tracking-wider">
            <Award className="w-5 h-5" />
            <span>Academic Capstone & Evaluation Scope</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold gold-gradient-text">
            {isTamil ? 'கல்லூரி மதிப்பீட்டுத் திட்டம்' : 'Engineering Highlights & Academic Focus'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-sm text-heritage-cream-200">
            <div className="space-y-2">
              <h4 className="font-serif font-bold text-heritage-gold text-base">Full-Stack Decoupled Architecture</h4>
              <p className="text-xs text-heritage-cream-300 leading-relaxed">
                Clean separation between the high-performance FastAPI asynchronous backend and the responsive React/Vite frontend. Can run independently or cooperatively.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-serif font-bold text-heritage-gold text-base">Zero-Hallucination RAG Grounding</h4>
              <p className="text-xs text-heritage-cream-300 leading-relaxed">
                Eliminates generative AI inaccuracies by strictly grounding Gemini API prompts on verified SQLite database records extracted from ASI documentation.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-serif font-bold text-heritage-gold text-base">Multilingual Natural Storytelling</h4>
              <p className="text-xs text-heritage-cream-300 leading-relaxed">
                Full dual-language interface (Classical Tamil and English) paired with browser Web Speech API and backend TTS for accessible audio experiences.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-serif font-bold text-heritage-gold text-base">No Mock Buttons or Dead Placeholders</h4>
              <p className="text-xs text-heritage-cream-300 leading-relaxed">
                Every single card, audio player, interactive map pin, quiz submission, and search filter is connected to real state and working API handlers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack Breakdown */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-heritage-gold-dark">
            Architecture Specification
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-heritage-navy-950">
            Technology Stack & Tools
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {techStack.map((stack, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-heritage-cream-300 shadow-sm space-y-3"
            >
              <h3 className="font-serif font-bold text-base text-heritage-navy-950 pb-2 border-b border-heritage-cream-200">
                {stack.category}
              </h3>
              <ul className="space-y-1.5 text-xs text-heritage-navy-800">
                {stack.items.map((item, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <span className="text-heritage-gold-dark font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Data Sources Acknowledgment */}
      <div className="bg-heritage-cream-50 rounded-2xl p-6 border border-heritage-gold/30 flex items-start space-x-4">
        <div className="w-10 h-10 rounded-xl bg-heritage-navy-950 text-heritage-gold flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs text-heritage-navy-800">
          <h4 className="font-serif font-bold text-sm text-heritage-navy-950">
            Archaeological Integrity & Citations
          </h4>
          <p className="leading-relaxed">
            Historical coordinates, dates, dynasties, and architectural dimensions featured across Brihadeeswarar Temple, Mahabalipuram, Meenakshi Amman Temple, Gangaikonda Cholapuram, and Gingee Fort are sourced directly from publications of the Archaeological Survey of India (ASI), Epigraphia Indica, and UNESCO World Heritage documentation.
          </p>
        </div>
      </div>

    </div>
  );
}
