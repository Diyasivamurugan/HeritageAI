import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AudioProvider } from './context/AudioContext';
import { fetchMonuments, FALLBACK_MONUMENTS } from './services/heritageService';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AudioPlayerBar from './components/AudioPlayerBar';

import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import DetailsPage from './pages/DetailsPage';
import StorytellingPage from './pages/StorytellingPage';
import ChatbotPage from './pages/ChatbotPage';
import AudioStoriesPage from './pages/AudioStoriesPage';
import MapPage from './pages/MapPage';
import QuizPage from './pages/QuizPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [monuments, setMonuments] = useState(FALLBACK_MONUMENTS);
  const [selectedMonument, setSelectedMonument] = useState(null);
  const [exploreFilterParams, setExploreFilterParams] = useState({ search: '', dynasty: 'all' });

  // Load monuments from FastAPI backend or fallback
  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchMonuments();
        if (data && data.length > 0) {
          setMonuments(data);
        }
      } catch (err) {
        console.warn("Using offline heritage dataset:", err);
      }
    }
    loadData();
  }, []);

  // Navigation handlers
  const handleSelectMonument = (monument) => {
    setSelectedMonument(monument);
    setActivePage('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (pageId, params = {}) => {
    if (pageId === 'explore' && params) {
      setExploreFilterParams({
        search: params.search || '',
        dynasty: params.dynasty || 'all',
      });
    }
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenerateStoryForMonument = (monument) => {
    setSelectedMonument(monument);
    setActivePage('stories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAskChatbotForMonument = (monument) => {
    setSelectedMonument(monument);
    setActivePage('chatbot');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewOnMap = (monument) => {
    setSelectedMonument(monument);
    setActivePage('map');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <LanguageProvider>
      <AudioProvider>
        <div className="flex flex-col min-h-screen bg-heritage-cream-100 text-heritage-navy-900 selection:bg-heritage-gold selection:text-heritage-navy-950 font-sans">
          
          {/* Top Sticky Navigation */}
          <Navbar activePage={activePage} setActivePage={setActivePage} />

          {/* Dynamic Page Views */}
          <main className="flex-1">
            {activePage === 'home' && (
              <HomePage
                monuments={monuments}
                onSelectMonument={handleSelectMonument}
                onNavigate={handleNavigate}
                onGenerateStory={handleGenerateStoryForMonument}
              />
            )}

            {activePage === 'explore' && (
              <ExplorePage
                monuments={monuments}
                onSelectMonument={handleSelectMonument}
                onGenerateStory={handleGenerateStoryForMonument}
                initialSearch={exploreFilterParams.search}
                initialDynasty={exploreFilterParams.dynasty}
              />
            )}

            {activePage === 'details' && (
              <DetailsPage
                monument={selectedMonument || monuments[0]}
                onBack={() => handleNavigate('explore')}
                onGenerateStory={handleGenerateStoryForMonument}
                onAskChatbot={handleAskChatbotForMonument}
                onViewOnMap={handleViewOnMap}
              />
            )}

            {activePage === 'stories' && (
              <StorytellingPage
                monuments={monuments}
                initialSelectedMonument={selectedMonument}
              />
            )}

            {activePage === 'chatbot' && (
              <ChatbotPage
                monuments={monuments}
                initialSelectedMonument={selectedMonument}
              />
            )}

            {activePage === 'audio' && (
              <AudioStoriesPage
                monuments={monuments}
                onNavigate={handleNavigate}
              />
            )}

            {activePage === 'map' && (
              <MapPage
                monuments={monuments}
                onSelectMonument={handleSelectMonument}
              />
            )}

            {activePage === 'quiz' && (
              <QuizPage />
            )}

            {activePage === 'about' && (
              <AboutPage />
            )}
          </main>

          {/* Floating Audio Player Bar */}
          <AudioPlayerBar />

          {/* Comprehensive Footer */}
          <Footer setActivePage={setActivePage} />

        </div>
      </AudioProvider>
    </LanguageProvider>
  );
}
