import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Volume2, 
  Sparkles, 
  ShieldCheck, 
  User, 
  Globe2, 
  Loader2, 
  RefreshCw 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAudio } from '../context/AudioContext';
import { sendChatMessage } from '../services/chatService';

export default function ChatbotPage({ monuments, initialSelectedMonument }) {
  const { language: globalLang } = useLanguage();
  const { playAudio } = useAudio();

  const [chatLang, setChatLang] = useState(globalLang || 'en');
  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMonumentId, setSelectedMonumentId] = useState(
    initialSelectedMonument ? initialSelectedMonument.id : null
  );

  const messagesEndRef = useRef(null);
  const isTamil = chatLang === 'ta';

  const defaultPrompts = isTamil ? [
    "தஞ்சைப் பெரிய கோயில் விமானத்தின் உச்சிக்கு 80 டன் கல் எவ்வாறு ஏற்றப்பட்டது?",
    "மாமல்லபுரம் அர்ச்சுனன் தவம் பாறைச் சிற்பத்தின் தாத்பரியம் என்ன?",
    "மதுரை ஆயிரங்கால் மண்டபத்தில் உள்ள உண்மையான தூண்கள் எத்தனை?",
    "கங்கைகொண்ட சோழபுரத்தின் சிங்கமுகக் கிணற்றின் வரலாறு என்ன?",
    "செஞ்சிக் கோட்டை ஏன் 'கிழக்கின் ட்ராய்' என்று அழைக்கப்பட்டது?"
  ] : [
    "How was the 80-tonne granite capstone hoisted onto Thanjavur temple?",
    "What is the historical meaning of the Descent of the Ganges in Mahabalipuram?",
    "How many actual stone pillars exist in Meenakshi temple's Thousand Pillar Hall?",
    "What is the story behind the Lion Well at Gangaikonda Cholapuram?",
    "Why was Gingee Fort hailed by the British as the 'Troy of the East'?"
  ];

  // Initialize welcome message
  useEffect(() => {
    const welcome = isTamil ? {
      id: 'welcome',
      role: 'assistant',
      content: 'வணக்கம்! நான் உங்கள் ஹெரிடேஜ் ஏஐ வரலாற்று வழிகாட்டி (மரபு அறிவன்). சோழ, பல்லவ, பாண்டிய மற்றும் நாயக்க மன்னர்களின் கட்டிடக்கலை மற்றும் வரலாற்று ஆய்வுகள் குறித்து நீங்கள் எதை வேண்டுமானாலும் கேட்கலாம்.',
      citations: [
        {
          monument_name: "தமிழ்நாடு தொல்லியல் துறை",
          category: "ஆவணக் காப்பகம்",
          fact_snippet: "அனைத்துப் பதில்களும் இந்திய தொல்லியல் துறை (ASI) மற்றும் யுனெஸ்கோ ஆவணங்களை அடிப்படையாகக் கொண்டவை.",
          source: "ASI Records"
        }
      ]
    } : {
      id: 'welcome',
      role: 'assistant',
      content: 'Greetings explorer! I am Heritage Sage, your conversational AI guide. Ask me anything about the monumental Dravidian architecture, dynasty timelines, or engineering feats of Tamil Nadu.',
      citations: [
        {
          monument_name: "Archaeological Survey of India",
          category: "Verified Archive",
          fact_snippet: "Responses are strictly grounded on ASI Epigraphia Indica and UNESCO technical dossiers.",
          source: "ASI / UNESCO"
        }
      ]
    };
    setMessages([welcome]);
  }, [chatLang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (queryText) => {
    const query = queryText || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: query.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const result = await sendChatMessage(query.trim(), chatLang, selectedMonumentId);
      const botMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.reply,
        citations: result.citations || [],
        suggestedFollowups: result.suggested_followups || []
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error("Chatbot query error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleListenResponse = (text) => {
    playAudio("Heritage Sage Reply", text, chatLang, "AI Archaeological Guide");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-heritage-navy-950 text-heritage-cream-100 p-6 rounded-3xl border border-heritage-gold/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-heritage-gold/20 border border-heritage-gold/50 flex items-center justify-center text-heritage-gold text-2xl shadow-inner">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold gold-gradient-text">
              {isTamil ? 'மரபு அறிவன் — AI வரலாற்று வழிகாட்டி' : 'Heritage Sage — AI RAG Assistant'}
            </h1>
            <p className="text-xs text-heritage-cream-300/80">
              {isTamil ? 'தொல்லியல் ஆவணங்களால் சரிபார்க்கப்பட்ட அறிவுத் தளம்' : 'Grounded on Verified ASI & UNESCO Archaeological Archives'}
            </p>
          </div>
        </div>

        {/* Language & Monument Filter Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setChatLang(prev => prev === 'en' ? 'ta' : 'en')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-heritage-gold/40 bg-heritage-navy-900 text-heritage-gold text-xs font-semibold hover:bg-heritage-gold hover:text-heritage-navy-950 transition"
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>{isTamil ? 'Switch to English' : 'தமிழில் பேச'}</span>
          </button>
        </div>
      </div>

      {/* Suggested Questions Ribbon */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin">
        <span className="text-xs font-bold text-heritage-gold-dark uppercase tracking-wider flex-shrink-0">
          {isTamil ? 'பரிந்துரை கேள்விகள்:' : 'Suggested Questions:'}
        </span>
        {defaultPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="flex-shrink-0 text-xs bg-white border border-heritage-gold/30 hover:border-heritage-gold px-3.5 py-1.5 rounded-xl text-heritage-navy-900 hover:bg-heritage-cream-50 transition shadow-sm font-medium"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Stream */}
      <div className="bg-heritage-cream-50 rounded-3xl border border-heritage-gold/30 shadow-inner p-6 min-h-[500px] max-h-[600px] overflow-y-auto space-y-6">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm shadow-sm ${
                isUser 
                  ? 'bg-heritage-navy-900 text-heritage-gold' 
                  : 'bg-heritage-gold text-heritage-navy-950 font-bold'
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-2xl rounded-2xl p-4 shadow-sm space-y-2 ${
                isUser 
                  ? 'bg-heritage-navy-900 text-heritage-cream-100 rounded-tr-none' 
                  : 'bg-white text-heritage-navy-950 border border-heritage-cream-300 rounded-tl-none'
              }`}>
                <div className="text-sm leading-relaxed whitespace-pre-line">
                  {msg.content}
                </div>

                {/* Assistant Controls & Citations */}
                {!isUser && (
                  <div className="pt-2 border-t border-heritage-cream-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleListenResponse(msg.content)}
                        className="flex items-center space-x-1.5 text-xs text-heritage-gold-dark hover:text-heritage-navy-900 font-semibold transition"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{isTamil ? 'பதிலை வாசிக்கக் கேட்க' : 'Listen Answer'}</span>
                      </button>

                      <div className="flex items-center space-x-1 text-[11px] text-emerald-700">
                        <ShieldCheck className="w-3 h-3" />
                        <span>ASI Verified</span>
                      </div>
                    </div>

                    {/* Citations Box */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="bg-heritage-cream-100/60 p-2.5 rounded-lg border border-heritage-gold/20 text-[11px] text-heritage-navy-800 space-y-1">
                        <span className="font-bold uppercase tracking-wider text-heritage-gold-dark block">
                          Verified Source Grounding:
                        </span>
                        {msg.citations.map((c, i) => (
                          <div key={i} className="leading-snug">
                            • <span className="font-semibold">{c.monument_name}</span>: {c.fact_snippet} ({c.source})
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center space-x-3 text-heritage-gold-dark">
            <div className="w-9 h-9 rounded-xl bg-heritage-gold/20 flex items-center justify-center">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-heritage-cream-300 text-xs flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-heritage-gold" />
              <span>{isTamil ? 'தொல்லியல் ஆவணங்கள் சரிபார்க்கப்படுகின்றன...' : 'Consulting verified archaeological archives...'}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center space-x-2 bg-white rounded-2xl p-2 border border-heritage-gold/50 shadow-lg"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={isTamil ? "சோழ, பல்லவ, பாண்டிய வரலாறு குறித்து கேட்க..." : "Ask Heritage Sage about Tamil Nadu history, architecture, or dynasties..."}
          className="flex-1 py-3 px-4 bg-transparent text-sm text-heritage-navy-950 focus:outline-none placeholder:text-heritage-navy-700/50"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isLoading}
          className="px-5 py-3 rounded-xl bg-heritage-navy-950 text-heritage-gold font-semibold text-xs tracking-wider uppercase hover:bg-heritage-gold hover:text-heritage-navy-950 transition disabled:opacity-40 flex items-center space-x-1.5 shadow-md"
        >
          <span>{isTamil ? 'அனுப்புக' : 'Send'}</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

    </div>
  );
}
