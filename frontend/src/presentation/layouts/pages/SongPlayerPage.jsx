import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Heart, Share2, Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, ListMusic, PlusCircle, MoreHorizontal } from 'lucide-react';
import usePlayerStore from '../../../application/state/usePlayerStore';
import { musicApi } from '../../../infrastructure/api/musicApi';

const SongPlayerPage = () => {
  const { songId } = useParams();
  const navigate = useNavigate();
  const {
    queue,
    currentIndex,
    isPlaying,
    setIsPlaying,
    progress,
    duration,
    setProgress,
    playNext,
    playPrevious,
    isShuffle,
    toggleShuffle,
    isRepeat,
    toggleRepeat,
    setQueue
  } = usePlayerStore();

  const currentTrack = queue[currentIndex];
  const [similarTracks, setSimilarTracks] = useState([]);
  const [activeTab, setActiveTab] = useState('lyrics'); // lyrics or similar
  
  useEffect(() => {
    if (songId && (!currentTrack || currentTrack.id !== songId)) {
      musicApi.searchTracks(songId).then(res => {
        if (res && res.length > 0) {
          setQueue(res, 0);
        }
      });
    }
  }, [songId]);

  useEffect(() => {
    if (currentTrack) {
      // Fetch similar tracks based on genre or artist
      const query = currentTrack.genre || currentTrack.user?.name || 'pop';
      musicApi.searchTracks(query).then(res => {
        if (res) {
          setSimilarTracks(res.filter(t => t.id !== currentTrack.id).slice(0, 10));
        }
      });
    }
  }, [currentTrack]);

  if (!currentTrack) {
    return <div className="h-screen w-full bg-black flex items-center justify-center text-white">Loading premium player...</div>;
  }

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const bgImage = currentTrack.artwork?.['480x480'] || currentTrack.artwork?.['150x150'] || 'https://via.placeholder.com/480';

  return (
    <motion.div 
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[100] bg-darker text-white flex flex-col overflow-y-auto"
    >
      {/* Animated Abstract Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-[-50%] opacity-40 blur-[120px] transition-all duration-[2000ms] ease-in-out mix-blend-screen scale-150 animate-pulse-slow"
          style={{ backgroundImage: `url(${bgImage})`, backgroundPosition: 'center', backgroundSize: 'cover' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/95" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6 sticky top-0 bg-gradient-to-b from-black/50 to-transparent backdrop-blur-sm">
        <button onClick={() => navigate(-1)} className="p-3 bg-black/20 hover:bg-white/20 rounded-full backdrop-blur-md transition-colors">
          <ChevronDown size={28} />
        </button>
        <div className="text-center">
          <p className="text-[10px] text-light uppercase tracking-[0.2em] font-bold mb-1">Now Playing</p>
          <p className="font-medium text-sm text-white/90 drop-shadow-md">from your library</p>
        </div>
        <button className="p-3 bg-black/20 hover:bg-white/20 rounded-full backdrop-blur-md transition-colors">
          <MoreHorizontal size={28} />
        </button>
      </div>

      {/* Main Content Layout */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row items-center lg:items-start justify-center p-6 gap-16 max-w-7xl mx-auto w-full mt-4 lg:mt-12 mb-20">
        
        {/* Left Column: Artwork & Info */}
        <div className="w-full max-w-md flex flex-col items-center">
          {/* Album Art */}
          <motion.div 
            key={currentTrack.id}
            initial={{ scale: 0.9, opacity: 0, rotateY: -20 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ duration: 0.7, type: 'spring' }}
            className="w-full aspect-square shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-3xl overflow-hidden relative mb-10 group"
          >
            <img 
              src={bgImage} 
              alt={currentTrack.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.3)] pointer-events-none" />
          </motion.div>

          {/* Info & Action Buttons */}
          <div className="w-full flex items-center justify-between mb-8 px-4">
            <div className="flex flex-col flex-1 mr-4 overflow-hidden">
              <h1 className="text-3xl md:text-4xl font-extrabold mb-1 truncate drop-shadow-lg">{currentTrack.title}</h1>
              <h2 className="text-lg md:text-xl text-light font-medium truncate">{currentTrack.user?.name}</h2>
            </div>
            <div className="flex gap-4 items-center">
              <button className="text-white/60 hover:text-primary transition hover:scale-110"><PlusCircle size={28} /></button>
              <button className="text-white/60 hover:text-red-500 transition hover:scale-110"><Heart size={28} /></button>
            </div>
          </div>

          {/* Progress & Controls */}
          <div className="w-full flex flex-col gap-8 px-4">
            
            {/* Progress bar */}
            <div className="flex flex-col gap-3 group cursor-pointer">
              <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                <div 
                  className="absolute top-0 left-0 h-full bg-white group-hover:bg-primary transition-all duration-300 ease-linear" 
                  style={{ width: `${(progress / (duration || 1)) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-white/60 font-medium font-mono tracking-wider">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Playback Buttons */}
            <div className="flex items-center justify-between px-2">
              <button onClick={toggleShuffle} className={`${isShuffle ? 'text-primary' : 'text-white/50'} hover:text-white transition`}>
                <Shuffle size={24} />
              </button>
              <button onClick={playPrevious} className="text-white hover:text-primary transition hover:scale-110">
                <SkipBack size={40} fill="currentColor" />
              </button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)]"
              >
                {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} className="ml-2" fill="currentColor" />}
              </button>
              <button onClick={playNext} className="text-white hover:text-primary transition hover:scale-110">
                <SkipForward size={40} fill="currentColor" />
              </button>
              <button onClick={toggleRepeat} className={`${isRepeat ? 'text-primary' : 'text-white/50'} hover:text-white transition`}>
                <Repeat size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Tabs (Lyrics & Similar) */}
        <div className="w-full lg:w-[500px] flex flex-col mt-12 lg:mt-0">
          <div className="flex gap-8 mb-6 border-b border-white/10 pb-4">
            <button 
              onClick={() => setActiveTab('lyrics')}
              className={`text-lg font-bold transition-colors relative ${activeTab === 'lyrics' ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
            >
              Lyrics
              {activeTab === 'lyrics' && <div className="absolute -bottom-4 left-0 right-0 h-1 bg-primary rounded-t-full" />}
            </button>
            <button 
              onClick={() => setActiveTab('similar')}
              className={`text-lg font-bold transition-colors relative ${activeTab === 'similar' ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
            >
              Similar Songs
              {activeTab === 'similar' && <div className="absolute -bottom-4 left-0 right-0 h-1 bg-primary rounded-t-full" />}
            </button>
          </div>

          <div className="flex-1 overflow-hidden h-[400px] bg-white/5 rounded-3xl p-6 backdrop-blur-md border border-white/10 shadow-2xl">
            <AnimatePresence mode="wait">
              {activeTab === 'lyrics' ? (
                <motion.div 
                  key="lyrics"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="h-full overflow-y-auto scrollbar-hide flex flex-col gap-6"
                >
                  <p className="text-2xl font-bold text-white/90 leading-relaxed">
                    ♪<br/>
                    Music is playing...<br/>
                    (Lyrics are not available for this track yet, enjoy the instrumental vibes.)
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  key="similar"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="h-full overflow-y-auto scrollbar-hide flex flex-col gap-4"
                >
                  {similarTracks.length === 0 ? (
                    <div className="text-light text-center mt-10 animate-pulse">Finding similar tracks...</div>
                  ) : (
                    similarTracks.map((track) => (
                      <div key={track.id} className="flex items-center gap-4 p-3 hover:bg-white/10 rounded-xl transition-colors cursor-pointer group">
                        <img src={track.artwork?.['150x150'] || 'https://via.placeholder.com/150'} className="w-14 h-14 rounded-lg shadow-md" alt={track.title} />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium truncate group-hover:text-primary transition-colors">{track.title}</h4>
                          <p className="text-white/60 text-sm truncate">{track.user?.name}</p>
                        </div>
                        <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:border-primary hover:text-primary">
                          <Play size={16} fill="currentColor" />
                        </button>
                      </div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
      </div>
    </motion.div>
  );
};

export default SongPlayerPage;
