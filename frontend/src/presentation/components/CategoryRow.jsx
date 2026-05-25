import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { musicApi } from '../../infrastructure/api/musicApi';
import usePlayerStore from '../../application/state/usePlayerStore';
import { toast } from 'react-toastify';

const CategoryRow = React.memo(({ title, query, isCircle = false }) => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const { setQueue } = usePlayerStore();
  const rowRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasFetched) {
          fetchData();
        }
      },
      { threshold: 0.1 }
    );

    if (rowRef.current) observer.observe(rowRef.current);
    return () => observer.disconnect();
  }, [hasFetched, query]);

  const fetchData = async () => {
    setLoading(true);
    setHasFetched(true);
    try {
      const data = await musicApi.searchTracks(query);
      setTracks(data || []);
    } catch (error) {
      console.error('Failed to fetch', query, error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayTrack = (index) => {
    setQueue(tracks, index);
    toast.success(`Playing ${tracks[index].title}`);
  };

  if (!loading && tracks.length === 0 && hasFetched) return null;

  return (
    <div className="mt-8" ref={rowRef}>
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 px-1">{title}</h2>
      
      <div className="flex gap-4 md:gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x px-1">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className={`flex-shrink-0 w-36 md:w-48 animate-pulse bg-white/5 p-3 md:p-4 ${isCircle ? 'rounded-full' : 'rounded-2xl'} flex flex-col gap-4`}>
              <div className={`w-full aspect-square bg-white/10 ${isCircle ? 'rounded-full' : 'rounded-xl'}`} />
              <div className="h-4 bg-white/10 rounded w-3/4 mx-auto" />
            </div>
          ))
        ) : (
          tracks.map((track, index) => (
            <motion.div 
              key={track.id + index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`flex-shrink-0 w-36 md:w-48 bg-white/5 hover:bg-white/10 p-3 md:p-4 transition-all duration-300 group cursor-pointer border border-transparent hover:border-white/10 shadow-lg backdrop-blur-sm snap-start ${isCircle ? 'rounded-full hover:-translate-y-2' : 'rounded-2xl hover:-translate-y-2'}`}
              onClick={() => handlePlayTrack(index)}
            >
              <div className={`relative w-full aspect-square mb-3 md:mb-4 overflow-hidden shadow-md ${isCircle ? 'rounded-full border-4 border-transparent group-hover:border-primary' : 'rounded-xl'}`}>
                <img 
                  src={track.artwork?.['480x480'] || 'https://via.placeholder.com/480'} 
                  alt={track.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <button className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all hover:scale-105">
                    <Play size={28} className="text-black ml-1" fill="currentColor" />
                  </button>
                </div>
              </div>
              <h3 className={`text-white font-bold truncate text-base mb-1 group-hover:text-primary transition-colors ${isCircle ? 'text-center' : ''}`}>{track.title}</h3>
              <p className={`text-light text-sm truncate font-medium ${isCircle ? 'text-center' : ''}`}>{track.user?.name}</p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
});

export default CategoryRow;
