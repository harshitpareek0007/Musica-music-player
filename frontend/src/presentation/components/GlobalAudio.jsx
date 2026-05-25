import React, { useRef, useEffect, useState } from 'react';
import usePlayerStore from '../../application/state/usePlayerStore';
import axios from 'axios';

// Global cache for host to make song switching instant
let cachedHost = '';
const FALLBACK_HOSTS = [
  'https://audius-discovery-1.theblueprint.xyz',
  'https://discoveryprovider.audius.co',
  'https://audius-dp.singularity.net'
];

const GlobalAudio = () => {
  const {
    queue,
    currentIndex,
    isPlaying,
    setIsPlaying,
    volume,
    progress,
    setProgress,
    setDuration,
    playNext,
    isRepeat
  } = usePlayerStore();

  const currentTrack = queue[currentIndex];
  const nextTrack = queue[currentIndex + 1] || (isRepeat ? queue[0] : null);
  
  const audioRef = useRef(null);
  const nextAudioRef = useRef(null);
  
  const [streamUrl, setStreamUrl] = useState('');
  const [nextStreamUrl, setNextStreamUrl] = useState('');
  
  // Track play promises to prevent AbortError
  const playPromiseRef = useRef(null);

  // 1. Host Discovery & Stream URL Resolution
  const resolveStreamUrl = async (trackId, forceNewHost = false) => {
    if (!cachedHost || forceNewHost) {
      try {
        const res = await axios.get('https://api.audius.co');
        cachedHost = res.data.data[0] || FALLBACK_HOSTS[0];
      } catch (err) {
        cachedHost = FALLBACK_HOSTS[Math.floor(Math.random() * FALLBACK_HOSTS.length)];
      }
    }
    return `${cachedHost}/v1/tracks/${trackId}/stream?app_name=MusicaApp`;
  };

  // 2. Load Current Track
  useEffect(() => {
    if (currentTrack) {
      resolveStreamUrl(currentTrack.id).then(url => {
        setStreamUrl(url);
      });
    } else {
      setStreamUrl('');
    }
  }, [currentTrack]);

  // 3. Preload Next Track
  useEffect(() => {
    if (nextTrack) {
      resolveStreamUrl(nextTrack.id).then(url => {
        setNextStreamUrl(url);
      });
    } else {
      setNextStreamUrl('');
    }
  }, [nextTrack]);

  // 4. Playback & State Management
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !streamUrl) return;

    if (isPlaying) {
      if (progress === 0 && audio.currentTime > 0.5) {
        audio.currentTime = 0;
      }
      
      // Safely handle play promise
      playPromiseRef.current = audio.play();
      if (playPromiseRef.current !== undefined) {
        playPromiseRef.current.catch(e => {
          if (e.name !== 'AbortError') {
            console.warn('Playback error:', e);
            if (e.name === 'NotAllowedError') {
              setIsPlaying(false);
            }
          }
        });
      }
    } else {
      // Safely pause only if a play promise isn't pending
      if (playPromiseRef.current !== undefined) {
        playPromiseRef.current.then(() => {
          audio.pause();
        }).catch(() => {
          audio.pause();
        });
      } else {
        audio.pause();
      }
    }
  }, [isPlaying, streamUrl]);

  // 5. Volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // 6. Manual Seeking
  useEffect(() => {
    if (audioRef.current && Math.abs(audioRef.current.currentTime - progress) > 1.5) {
      audioRef.current.currentTime = progress;
    }
  }, [progress]);

  // --- Audio Event Handlers ---
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      if (Math.abs(audioRef.current.currentTime - progress) < 1.5 || isPlaying) {
        setProgress(audioRef.current.currentTime);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    playNext();
  };

  // Only recover on fatal network errors, NOT on standard buffering (waiting/stalled)
  const handleError = (e) => {
    console.error("Audio network error (fatal):", e);
    // Find a new host and try again seamlessly
    if (currentTrack) {
      resolveStreamUrl(currentTrack.id, true).then(url => {
        setStreamUrl(url);
        // It will automatically play because isPlaying is true and streamUrl changes
      });
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={streamUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={handleError}
        loop={isRepeat}
        preload="auto"
        crossOrigin="anonymous"
      />
      
      {nextStreamUrl && (
        <audio
          ref={nextAudioRef}
          src={nextStreamUrl}
          preload="auto"
          crossOrigin="anonymous"
          muted
          className="hidden"
        />
      )}
    </>
  );
};

export default GlobalAudio;
