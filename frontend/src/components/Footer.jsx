import React from 'react';
import { Compass, ShieldCheck, Heart, Sparkles, MapPin, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer({ setActivePage }) {
  const { language } = useLanguage();

  return (
    <footer className="bg-heritage-navy-950 text-heritage-cream-300 border-t border-heritage-gold/30 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🏛️</span>
              <span className="font-serif text-2xl font-bold tracking-wider gold-gradient-text">
                HERITAGE<span className="text-white">AI</span>
              </span>
            </div>
            <p className="text-sm text-heritage-cream-300/80 leading-relaxed">
              {language === 'ta'
                ? 'தமிழ்நாட்டின் வரலாற்றுப் பெருமைகளை நவீன செயற்கை நுண்ணறிவு, குரல் வழிக் கதைகள் மற்றும் ஊடாடும் வரைபடங்கள் மூலம் எதிர்கால சந்ததியினருக்கு எடுத்துச் செல்லும் தளம்.'
                : 'An AI-powered cultural exploration and local-language storytelling platform celebrating the timeless monuments, dynasties, and architectural marvels of South India.'
              }
            </p>
            <div className="flex items-center space-x-2 text-xs text-heritage-gold">
              <ShieldCheck className="w-4 h-4" />
              <span>Grounded on ASI & UNESCO Verified Archives</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-heritage-gold font-semibold text-base tracking-wider uppercase">
              {language === 'ta' ? 'விரைவு இணைப்புகள்' : 'Navigation'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => { setActivePage('explore'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-heritage-gold transition">
                  {language === 'ta' ? 'மரபுச் சின்னங்கள்' : 'Explore Monuments'}
                </button>
              </li>
              <li>
                <button onClick={() => { setActivePage('stories'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-heritage-gold transition">
                  {language === 'ta' ? 'AI வரலாற்று கதைகள்' : 'AI Storytelling Studio'}
                </button>
              </li>
              <li>
                <button onClick={() => { setActivePage('audio'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-heritage-gold transition">
                  {language === 'ta' ? 'ஒலி வழிக் கதைகள்' : 'Audio Story Library'}
                </button>
              </li>
              <li>
                <button onClick={() => { setActivePage('map'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-heritage-gold transition">
                  {language === 'ta' ? 'ஊடாடும் வரைபடம்' : 'Interactive Map'}
                </button>
              </li>
            </ul>
          </div>

          {/* Interactive Modules */}
          <div className="space-y-3">
            <h4 className="font-serif text-heritage-gold font-semibold text-base tracking-wider uppercase">
              {language === 'ta' ? 'சிறப்பு அம்சங்கள்' : 'Interactive AI'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => { setActivePage('chatbot'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-heritage-gold transition">
                  {language === 'ta' ? 'மரபு அறிவன் AI சாட்பாட்' : 'Heritage Sage AI Assistant'}
                </button>
              </li>
              <li>
                <button onClick={() => { setActivePage('quiz'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-heritage-gold transition">
                  {language === 'ta' ? 'கலாச்சார வினாடி-வினா' : 'Cultural Heritage Quiz'}
                </button>
              </li>
              <li>
                <button onClick={() => { setActivePage('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-heritage-gold transition">
                  {language === 'ta' ? 'திட்டத்தைப் பற்றி' : 'Project Architecture'}
                </button>
              </li>
            </ul>
          </div>

          {/* College Project Credit */}
          <div className="space-y-3 bg-heritage-navy-900/80 p-4 rounded-xl border border-heritage-gold/20">
            <div className="flex items-center space-x-2 text-heritage-gold">
              <Award className="w-4 h-4" />
              <h4 className="font-serif font-semibold text-sm uppercase">College Evaluation Project</h4>
            </div>
            <p className="text-xs text-heritage-cream-300/80 leading-relaxed">
              Designed as a Major Computer Science & Engineering Capstone Project.
            </p>
            <div className="pt-2 border-t border-heritage-gold/20 text-[11px] text-heritage-cream-400">
              Tech Stack: React • Vite • Tailwind • FastAPI • SQLite • Gemini AI • RAG
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-heritage-navy-800 flex flex-col sm:flex-row items-center justify-between text-xs text-heritage-cream-400">
          <p>© 2026 HeritageAI. Developed for Academic Evaluation & Cultural Preservation.</p>
          <p className="mt-2 sm:mt-0 flex items-center space-x-1">
            <span>Preserving Indian Heritage with</span>
            <span className="text-heritage-terracotta">❤️</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
