import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat, Maximize2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import usePlayerStore from '../../application/state/usePlayerStore';
import axios from 'axios';

const Player = () => {
  const navigate = useNavigate();
  const {
    queue,
    currentIndex,
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
    progress,
    setProgress,
    duration,
    setDuration,
    playNext,
    playPrevious,
    isShuffle,
    toggleShuffle,
    isRepeat,
    toggleRepeat
  } = usePlayerStore();

  const currentTrack = queue[currentIndex];

  const handleSeek = (e) => {
    const time = Number(e.target.value);
    setProgress(time);
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleEnded = () => {
    playNext();
  };

  const navigateToPlayer = () => {
    if (currentTrack) {
      navigate(`/player/${currentTrack.id}`);
    }
  };

  if (!currentTrack) return null;

  return (
    <div className="h-16 md:h-24 bg-card/80 backdrop-blur-xl border-t border-white/10 flex items-center justify-between px-4 md:px-6 z-50 transition-all">
      
      {/* Track Info */}
      <div className="flex items-center gap-3 md:gap-4 w-1/2 md:w-1/3 cursor-pointer group" onClick={navigateToPlayer}>
        <div className="relative">
          <img
            src={currentTrack.artwork?.['150x150'] || 'https://via.placeholder.com/150'}
            alt="artwork"
            className="w-10 h-10 md:w-14 md:h-14 rounded-md shadow-lg group-hover:opacity-75 transition-opacity"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-md">
            <Maximize2 size={20} className="text-white" />
          </div>
        </div>
        <div className="flex flex-col overflow-hidden min-w-0 w-full pr-2">
          <span className="text-white font-medium text-sm truncate group-hover:underline" title={currentTrack.title}>{currentTrack.title}</span>
          <span className="text-light text-xs truncate" title={currentTrack.user?.name}>{currentTrack.user?.name}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center justify-center w-1/2 md:w-1/3 gap-3">
        <div className="flex items-center gap-4 md:gap-10">
          <button onClick={toggleShuffle} className={`hidden md:block ${isShuffle ? 'text-primary' : 'text-light'} hover:text-white transition`}>
            <Shuffle size={20} />
          </button>
          <button onClick={playPrevious} className="text-light hover:text-white transition hover:scale-110">
            <SkipBack size={24} fill="currentColor" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center hover:scale-105 transition shadow-lg shadow-white/10"
          >
            {isPlaying ? <Pause size={20} className="text-black md:w-6 md:h-6" fill="currentColor" /> : <Play size={20} className="text-black ml-1 md:w-6 md:h-6" fill="currentColor" />}
          </button>
          <button onClick={playNext} className="text-light hover:text-white transition hover:scale-110">
            <SkipForward size={24} fill="currentColor" />
          </button>
          <button onClick={toggleRepeat} className={`hidden md:block ${isRepeat ? 'text-primary' : 'text-light'} hover:text-white transition`}>
            <Repeat size={20} />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="hidden md:flex items-center gap-3 w-full max-w-[500px] group">
          <span className="text-xs text-light min-w-[40px] text-right">{formatTime(progress)}</span>
          <div className="relative w-full h-1 bg-white/20 rounded-lg flex items-center">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={progress}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div 
              className="h-full bg-primary rounded-lg pointer-events-none group-hover:bg-green-400 transition-colors" 
              style={{ width: `${(progress / (duration || 1)) * 100}%` }} 
            />
          </div>
          <span className="text-xs text-light min-w-[40px]">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume */}
      <div className="hidden md:flex items-center justify-end w-1/3 gap-2 group">
        <Volume2 size={20} className="text-light" />
        <div className="relative w-24 h-1 bg-white/20 rounded-lg flex items-center">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div 
            className="h-full bg-light rounded-lg pointer-events-none group-hover:bg-primary transition-colors" 
            style={{ width: `${volume * 100}%` }} 
          />
        </div>
      </div>
    </div>
  );
};

export default Player;
