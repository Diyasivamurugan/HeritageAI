import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { playNarrationSpeech, stopNarrationSpeech } from '../services/storyService';

const AudioContext = createContext();

export function AudioProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null); 
  // { title, audioUrl, downloadUrl, text, language, languageLabel, monumentName }
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [audioError, setAudioError] = useState(null);

  const audioRef = useRef(null);
  const isUsingBrowserSpeechRef = useRef(false);

  // Initialize Audio element
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const onLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
      setIsBuffering(false);
    };

    const onWaiting = () => setIsBuffering(true);
    const onPlaying = () => {
      setIsBuffering(false);
      setIsPlaying(true);
    };
    const onPause = () => setIsPlaying(false);
    
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const onError = (e) => {
      console.warn("Backend audio element error, switching to browser speech synthesis fallback:", e);
      setIsBuffering(false);
      // Seamlessly fall back to browser SpeechSynthesis
      if (currentTrack?.text) {
        isUsingBrowserSpeechRef.current = true;
        playNarrationSpeech(currentTrack.text, currentTrack.language, () => {
          setIsPlaying(false);
        }, playbackRate);
      } else {
        setAudioError("Audio playback error occurred.");
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [currentTrack, playbackRate]);

  // Main play function
  const playTrack = (trackData) => {
    setAudioError(null);
    stopNarrationSpeech();

    const langLabel = trackData.language === 'ta' 
      ? 'Tamil Narration (தமிழ்)' 
      : 'English Narration (English)';

    const enrichedTrack = {
      ...trackData,
      languageLabel: trackData.languageLabel || langLabel
    };

    setCurrentTrack(enrichedTrack);
    setCurrentTime(0);
    setDuration(0);

    const audio = audioRef.current;

    // 1. If backend MP3 audioUrl is available, stream via HTML5 Audio element
    if (enrichedTrack.audioUrl) {
      isUsingBrowserSpeechRef.current = false;
      const fullUrl = enrichedTrack.audioUrl.startsWith('http')
        ? enrichedTrack.audioUrl
        : `http://127.0.0.1:8000${enrichedTrack.audioUrl}`;

      audio.src = fullUrl;
      audio.playbackRate = playbackRate;
      setIsBuffering(true);

      audio.play().then(() => {
        setIsPlaying(true);
        setIsBuffering(false);
      }).catch((err) => {
        console.warn("Could not autoplay backend audio, falling back to Web Speech API:", err);
        isUsingBrowserSpeechRef.current = true;
        playNarrationSpeech(enrichedTrack.text, enrichedTrack.language, () => {
          setIsPlaying(false);
        }, playbackRate);
        setIsPlaying(true);
      });
    } else {
      // 2. Play using browser SpeechSynthesis
      isUsingBrowserSpeechRef.current = true;
      setIsPlaying(true);
      // Rough duration estimate based on word count (130 words per minute)
      const words = (enrichedTrack.text || "").split(/\s+/).length;
      setDuration(Math.max(15, Math.round((words / 130) * 60)));

      playNarrationSpeech(enrichedTrack.text, enrichedTrack.language, () => {
        setIsPlaying(false);
      }, playbackRate);
    }
  };

  const pauseAudio = () => {
    if (isUsingBrowserSpeechRef.current) {
      stopNarrationSpeech();
      setIsPlaying(false);
    } else if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resumeAudio = () => {
    if (isUsingBrowserSpeechRef.current && currentTrack) {
      setIsPlaying(true);
      playNarrationSpeech(currentTrack.text, currentTrack.language, () => {
        setIsPlaying(false);
      }, playbackRate);
    } else if (audioRef.current && currentTrack?.audioUrl) {
      audioRef.current.play().then(() => setIsPlaying(true));
    }
  };

  const stopAudio = () => {
    stopNarrationSpeech();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTrack(null);
    setCurrentTime(0);
    setDuration(0);
  };

  const seekTo = (seconds) => {
    if (!isUsingBrowserSpeechRef.current && audioRef.current && duration > 0) {
      audioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  };

  const changeRate = (rate) => {
    setPlaybackRate(rate);
    if (!isUsingBrowserSpeechRef.current && audioRef.current) {
      audioRef.current.playbackRate = rate;
    } else if (isPlaying && currentTrack) {
      stopNarrationSpeech();
      playNarrationSpeech(currentTrack.text, currentTrack.language, () => {
        setIsPlaying(false);
      }, rate);
    }
  };

  return (
    <AudioContext.Provider value={{
      currentTrack,
      isPlaying,
      currentTime,
      duration,
      playbackRate,
      isBuffering,
      audioError,
      playTrack,
      pauseAudio,
      resumeAudio,
      stopAudio,
      seekTo,
      changeRate
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
