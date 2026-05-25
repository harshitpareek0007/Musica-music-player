import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Play } from 'lucide-react';
import { musicApi } from '../../../infrastructure/api/musicApi';
import usePlayerStore from '../../../application/state/usePlayerStore';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setCurrentTrack, setQueue } = usePlayerStore();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        performSearch(query);
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const performSearch = async (searchQuery) => {
    setLoading(true);
    try {
      const data = await musicApi.searchTracks(searchQuery);
      setResults(data || []);
    } catch (error) {
      console.error('Search failed', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayTrack = (track) => {
    setQueue(results);
    setCurrentTrack(track);
  };

  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="sticky top-0 z-20 pt-2 pb-6 bg-dark/80 backdrop-blur-md">
        <div className="relative max-w-xl">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <SearchIcon size={20} className="text-light" />
          </div>
          <input
            type="text"
            className="w-full bg-white/10 border border-white/10 text-white rounded-full py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-light font-medium"
            placeholder="What do you want to listen to?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 pb-20">
        {loading ? (
          <div className="flex justify-center mt-10">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : results.length > 0 ? (
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-white mb-4">Songs</h2>
            {results.map((track, index) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                key={track.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-white/10 transition-colors group cursor-pointer"
                onClick={() => handlePlayTrack(track)}
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                    <img 
                      src={track.artwork?.['150x150'] || 'https://via.placeholder.com/150'} 
                      alt={track.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play size={16} className="text-white ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-medium group-hover:text-primary transition-colors line-clamp-1">{track.title}</span>
                    <span className="text-light text-sm line-clamp-1">{track.user?.name}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : query ? (
          <div className="text-center text-light mt-20">
            <p className="text-xl">No results found for "{query}"</p>
            <p className="text-sm mt-2">Please make sure your words are spelled correctly or use less or different keywords.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-light/50">
            <SearchIcon size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">Search for songs, artists, or podcasts</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
