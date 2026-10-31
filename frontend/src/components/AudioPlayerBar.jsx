import React from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  X, 
  Download, 
  Loader2, 
  Globe2 
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function AudioPlayerBar() {
  const { 
    currentTrack, 
    isPlaying, 
    currentTime, 
    duration, 
    playbackRate, 
    isBuffering, 
    pauseAudio, 
    resumeAudio, 
    stopAudio, 
    seekTo, 
    changeRate 
  } = useAudio();

  if (!currentTrack) return null;

  const rates = [0.75, 1.0, 1.25, 1.5];
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeekChange = (e) => {
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    seekTo(newTime);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:max-w-2xl z-50 animate-slide-up">
      <div className="bg-heritage-navy-950/98 border border-heritage-gold/60 rounded-2xl p-4 shadow-2xl backdrop-blur-xl space-y-3 gold-glow">
        
        {/* Top Row: Track Meta, Language Badge, Controls */}
        <div className="flex items-center justify-between space-x-4">
          
          {/* Track Info & Animated Waveform */}
          <div className="flex items-center space-x-3 overflow-hidden flex-1">
            <div className="w-11 h-11 rounded-xl bg-heritage-gold/20 border border-heritage-gold/50 flex items-center justify-center text-heritage-gold flex-shrink-0">
              {isBuffering ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Volume2 className="w-5 h-5 animate-pulse" />
              )}
            </div>

            <div className="truncate flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] text-heritage-gold font-bold uppercase tracking-wider truncate">
                  {currentTrack.monumentName || "Historical Narration"}
                </span>
                {/* Language Indicator */}
                <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-heritage-navy-800 text-[10px] font-semibold text-heritage-gold-light border border-heritage-gold/30">
                  <Globe2 className="w-2.5 h-2.5" />
                  <span>{currentTrack.language === 'ta' ? 'தமிழ்' : 'EN'}</span>
                </span>
              </div>

              <h4 className="text-sm font-serif font-bold text-heritage-cream-100 truncate">
                {currentTrack.title}
              </h4>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            
            {/* Playback Rate Selector */}
            <div className="hidden sm:flex items-center bg-heritage-navy-900 rounded-lg p-0.5 border border-heritage-gold/20 text-[10px]">
              {rates.map(rate => (
                <button
                  key={rate}
                  onClick={() => changeRate(rate)}
                  className={`px-2 py-1 rounded font-medium transition ${
                    playbackRate === rate
                      ? 'bg-heritage-gold text-heritage-navy-950 font-bold'
                      : 'text-heritage-cream-300 hover:text-white'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>

            {/* Play / Pause Toggle Button */}
            <button
              onClick={isPlaying ? pauseAudio : resumeAudio}
              className="w-10 h-10 rounded-full bg-heritage-gold text-heritage-navy-950 flex items-center justify-center hover:scale-105 active:scale-95 transition shadow-lg"
              title={isPlaying ? "Pause Narration" : "Play Narration"}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            {/* Download MP3 (If available) */}
            {currentTrack.downloadUrl && (
              <a
                href={currentTrack.downloadUrl.startsWith('http') ? currentTrack.downloadUrl : `http://127.0.0.1:8000${currentTrack.downloadUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-heritage-cream-300 hover:text-heritage-gold transition rounded-lg"
                title="Download MP3"
              >
                <Download className="w-4 h-4" />
              </a>
            )}

            {/* Close Button */}
            <button
              onClick={stopAudio}
              className="p-2 text-heritage-cream-300 hover:text-heritage-gold hover:bg-heritage-navy-900 rounded-lg transition"
              title="Stop Narration"
            >
              <X className="w-4 h-4" />
            </button>

          </div>

        </div>

        {/* Bottom Row: Interactive Scrubber Slider & Timers */}
        <div className="space-y-1">
          <div className="relative flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              value={progressPercent || 0}
              onChange={handleSeekChange}
              className="w-full h-1.5 bg-heritage-navy-800 rounded-lg appearance-none cursor-pointer accent-heritage-gold"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-heritage-cream-300/70 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span className="text-[10px] text-heritage-gold font-sans uppercase tracking-widest">
              {currentTrack.languageLabel || (currentTrack.language === 'ta' ? 'தமிழ் ஒலி வடிவம்' : 'English Narration')}
            </span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
