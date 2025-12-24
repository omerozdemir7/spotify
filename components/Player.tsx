
import React, { useState, useEffect, useRef } from 'react';
import { PlayIcon, PauseIcon, SkipForwardIcon, SkipBackIcon, VolumeIcon } from './Icons';
import { Track } from '../types';

interface PlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  onNext: () => void;
  onPrevious: () => void;
  isExpanded: boolean;
  setIsExpanded: (val: boolean) => void;
  aiAnalysis: string;
  isLoadingAnalysis: boolean;
}

const Player: React.FC<PlayerProps> = ({ 
  currentTrack, isPlaying, setIsPlaying, onNext, onPrevious, 
  isExpanded, setIsExpanded, aiAnalysis, isLoadingAnalysis 
}) => {
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.audioUrl;
      if (isPlaying) {
        audioRef.current.play().catch(e => console.warn("Playback interrupted", e));
      }
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => console.warn("Play error", e));
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setCurrentTime(current);
      setProgress((current / (duration || 1)) * 100);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) return null;

  return (
    <>
      {/* Expanded Mobile View */}
      <div className={`fixed inset-0 bg-gradient-to-b from-[#4d4d4d] to-black z-[100] p-6 flex flex-col md:hidden transition-transform duration-300 ease-in-out ${isExpanded ? 'translate-y-0' : 'translate-y-full'}`}>
          <header className="flex items-center justify-between mb-8">
            <button onClick={() => setIsExpanded(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/></svg>
            </button>
            <span className="text-[10px] font-bold uppercase tracking-widest">Çalma Listesinden</span>
            <div className="w-10 h-10"></div>
          </header>

          <div className="flex-1 flex flex-col items-center justify-center gap-8">
            <img src={currentTrack.coverUrl} className="w-full aspect-square rounded-xl shadow-2xl max-w-[350px]" alt="" />
            <div className="w-full space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{currentTrack.title}</h2>
                  <p className="text-[#b3b3b3]">{currentTrack.artist}</p>
                </div>
                <button className="text-[#1DB954]"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></button>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1 py-4">
                <div className="h-1 bg-white/10 rounded-full relative overflow-hidden">
                  <div className="absolute inset-y-0 left-0 bg-white" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="flex justify-between text-[10px] text-[#b3b3b3] font-bold">
                  <span>{formatTime(currentTime)}</span>
                  <span>0:30 (Önizleme)</span>
                </div>
              </div>

              {/* AI Insight Card for Mobile */}
              <div className="bg-black/20 p-4 rounded-xl border border-white/5 mt-4 min-h-[100px]">
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-1.5 h-1.5 bg-[#1DB954] rounded-full animate-pulse"></div>
                   <span className="text-[8px] font-bold tracking-widest text-white/50 uppercase">DJ Yorumu</span>
                </div>
                {isLoadingAnalysis ? (
                  <div className="w-full h-12 bg-white/5 animate-pulse rounded"></div>
                ) : (
                  <p className="text-sm italic text-white/80 leading-relaxed">"{aiAnalysis || 'Bu parça hakkında eşsiz bir bilgi toplanıyor...'}"</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-around py-8">
            <button className="text-[#b3b3b3]"><SkipBackIcon /></button>
            <button onClick={() => setIsPlaying(!isPlaying)} className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center active:scale-90 transition-transform shadow-xl">
              {isPlaying ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8 ml-1" />}
            </button>
            <button className="text-[#b3b3b3]"><SkipForwardIcon /></button>
          </div>
        </div>
      
      {/* Bottom Player Bar */}
      <div
        className={`fixed md:bottom-0 ${isExpanded ? 'hidden md:flex' : 'bottom-16 md:bottom-0'} left-0 right-0 h-20 md:h-24 bg-black border-t border-[#282828] px-3 md:px-4 flex items-center justify-between select-none z-[70] transition-all`}
        onClick={() => !isExpanded && window.innerWidth < 768 && setIsExpanded(true)}
      >
        <audio 
          ref={audioRef} 
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        />
        
        {/* Track Info */}
        <div className="flex items-center gap-3 w-[60%] md:w-[30%] overflow-hidden">
          <img src={currentTrack.coverUrl} className="w-12 h-12 md:w-14 md:h-14 rounded shadow-md flex-shrink-0" alt="" />
          <div className="flex flex-col min-w-0">
            <span className="text-white text-xs md:text-sm font-bold truncate">{currentTrack.title}</span>
            <span className="text-[#b3b3b3] text-[10px] md:text-xs truncate">{currentTrack.artist}</span>
          </div>
        </div>

        {/* Desktop Controls */}
        <div className="hidden md:flex flex-col items-center gap-2 w-[40%]">
          <div className="flex items-center gap-5">
            <button className="text-[#b3b3b3] hover:text-white"><SkipBackIcon /></button>
            <button onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }} className="bg-white text-black p-2.5 rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg">
              {isPlaying ? <PauseIcon /> : <PlayIcon className="ml-0.5" />}
            </button>
            <button className="text-[#b3b3b3] hover:text-white"><SkipForwardIcon /></button>
          </div>
          <div className="flex items-center gap-2 w-full max-w-[500px]">
            <span className="text-[10px] text-[#b3b3b3] min-w-[32px] text-right">{formatTime(currentTime)}</span>
            <div className="relative flex-1 group h-1 bg-[#4d4d4d] rounded-full overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-[#1DB954]" style={{ width: `${progress}%` }}></div>
            </div>
            <span className="text-[10px] text-[#b3b3b3] min-w-[32px]">0:30</span>
          </div>
        </div>

        {/* Mobile Right Controls */}
        <div className="md:hidden flex items-center gap-4 pr-2">
          <button onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }} className="text-white">
            {isPlaying ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8" />}
          </button>
        </div>

        {/* Volume - Desktop Only */}
        <div className="hidden md:flex items-center justify-end gap-3 w-[30%]">
          <VolumeIcon />
          <input 
            type="range" min="0" max="1" step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-24 h-1 rounded-full appearance-none cursor-pointer bg-[#4d4d4d]"
          />
        </div>
      </div>
    </>
  );
};

export default Player;
