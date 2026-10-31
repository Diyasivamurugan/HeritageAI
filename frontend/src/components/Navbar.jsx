import React, { useState } from 'react';
import { 
  Compass, 
  BookOpen, 
  Volume2, 
  Bot, 
  MapPin, 
  Award, 
  Info, 
  Menu, 
  X, 
  Sparkles,
  Globe2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar({ activePage, setActivePage }) {
  const { language, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: t.nav.home, icon: Compass },
    { id: 'explore', label: t.nav.explore, icon: MapPin },
    { id: 'stories', label: t.nav.stories, icon: Sparkles },
    { id: 'audio', label: t.nav.audio, icon: Volume2 },
    { id: 'chatbot', label: t.nav.chatbot, icon: Bot },
    { id: 'map', label: t.nav.map, icon: MapPin },
    { id: 'quiz', label: t.nav.quiz, icon: Award },
    { id: 'about', label: t.nav.about, icon: Info },
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-heritage-navy-950/90 backdrop-blur-md border-b border-heritage-gold/30 text-heritage-cream-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 group focus:outline-none text-left"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-heritage-gold via-heritage-gold-accent to-heritage-navy-800 p-0.5 shadow-lg group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-heritage-navy-950 rounded-[10px] flex items-center justify-center">
                <span className="text-xl">🏛️</span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-serif text-2xl font-bold tracking-wider gold-gradient-text">
                  HERITAGE<span className="text-white">AI</span>
                </span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-heritage-gold/20 text-heritage-gold border border-heritage-gold/40">
                  {language === 'ta' ? 'தமிழ்' : 'INDIA'}
                </span>
              </div>
              <p className="text-[10px] tracking-widest text-heritage-gold/70 uppercase">
                {language === 'ta' ? 'கலாச்சார மரபுத் தளம்' : 'Cultural Heritage Platform'}
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-heritage-gold/20 text-heritage-gold border border-heritage-gold/40 shadow-sm'
                      : 'text-heritage-cream-200/80 hover:text-heritage-gold hover:bg-heritage-navy-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-heritage-gold' : 'text-heritage-cream-300'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Language Switcher & Action CTA */}
          <div className="hidden sm:flex items-center space-x-3">
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-heritage-gold/50 bg-heritage-navy-900 text-heritage-gold hover:bg-heritage-gold hover:text-heritage-navy-950 font-medium text-xs transition-all duration-300 shadow-sm"
              title="Toggle Tamil / English"
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>{t.nav.langSwitch}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 rounded-md border border-heritage-gold/40 text-heritage-gold text-xs font-semibold"
            >
              {t.nav.langSwitch}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-heritage-cream-100 hover:text-heritage-gold hover:bg-heritage-navy-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-heritage-navy-900/98 border-b border-heritage-gold/30 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-heritage-gold/20 text-heritage-gold border border-heritage-gold/40'
                    : 'text-heritage-cream-200 hover:bg-heritage-navy-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
