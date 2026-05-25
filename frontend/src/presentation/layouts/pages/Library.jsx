import React, { useState, useEffect } from 'react';
import { Heart, Clock, ListMusic, Plus, Trash2, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import usePlayerStore from '../../../application/state/usePlayerStore';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Library = () => {
  const { queue, currentIndex, setQueue, history } = usePlayerStore();
  const currentTrack = queue[currentIndex];
  const navigate = useNavigate();
  
  const [playlists, setPlaylists] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  const token = localStorage.getItem('token');
  const user = token ? JSON.parse(localStorage.getItem('user')) : null;

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPlaylists(res.data.playlists || []);
        setLikedSongs(res.data.likedSongs || []);
      } catch (e) {
        console.log('Failed to fetch library data, using local mock data for demo');
        // Fallback for demo
        const localUser = JSON.parse(localStorage.getItem('user') || '{}');
        setPlaylists(localUser.playlists || []);
        setLikedSongs(localUser.likedSongs || []);
      }
    };
    fetchData();
  }, [token, navigate]);

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await axios.post(`${API_URL}/user/playlists`, 
        { name: newPlaylistName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPlaylists([...playlists, res.data]);
    } catch (e) {
      console.log('Using local state for playlist creation');
      const newPlaylist = { id: Date.now().toString(), name: newPlaylistName, songs: [] };
      const updatedPlaylists = [...playlists, newPlaylist];
      setPlaylists(updatedPlaylists);
      const user = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({ ...user, playlists: updatedPlaylists }));
    }
    setNewPlaylistName('');
    setIsCreating(false);
  };

  const handleDeletePlaylist = async (id, e) => {
    e.stopPropagation();
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      await axios.delete(`${API_URL}/user/playlists/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlaylists(playlists.filter(p => p.id !== id));
    } catch (e) {
      const updatedPlaylists = playlists.filter(p => p.id !== id);
      setPlaylists(updatedPlaylists);
      const user = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({ ...user, playlists: updatedPlaylists }));
    }
  };

  const playPlaylist = (songs) => {
    if (songs && songs.length > 0) {
      setQueue(songs, 0);
    }
  };

  return (
    <div className="flex flex-col gap-12 h-full pb-20">
      <div>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400 mb-8">
          Your Library
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            onClick={() => playPlaylist(likedSongs)}
            className="bg-gradient-to-br from-indigo-600 to-purple-800 p-8 rounded-3xl h-56 flex flex-col justify-end cursor-pointer shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-6 right-6">
              <Heart size={64} className="text-white/20 group-hover:text-white/40 transition-colors" fill="currentColor" />
            </div>
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Play size={48} className="text-white" fill="currentColor" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 relative z-10">Liked Songs</h2>
            <p className="text-white/80 font-medium relative z-10">{likedSongs.length} liked songs</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            onClick={() => playPlaylist(history)}
            className="bg-white/5 p-8 rounded-3xl h-56 flex flex-col justify-end cursor-pointer shadow-xl border border-white/10 hover:border-white/30 backdrop-blur-md transition-colors group relative overflow-hidden"
          >
            <div className="absolute top-6 right-6">
              <Clock size={64} className="text-white/5 group-hover:text-white/10 transition-colors" />
            </div>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Play size={48} className="text-white" fill="currentColor" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 relative z-10">Recently Played</h2>
            <p className="text-light font-medium relative z-10">{history.length} songs</p>
          </motion.div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Your Playlists</h2>
          <button 
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors text-sm font-medium"
          >
            <Plus size={18} /> New Playlist
          </button>
        </div>

        <AnimatePresence>
          {isCreating && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <form onSubmit={handleCreatePlaylist} className="flex gap-4">
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="My Awesome Playlist"
                  className="bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary flex-1"
                  autoFocus
                />
                <button type="submit" className="bg-primary hover:bg-green-400 text-black font-bold px-8 rounded-xl transition-colors">
                  Create
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <AnimatePresence>
            {playlists.map((playlist) => (
              <motion.div 
                key={playlist.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white/5 hover:bg-white/10 p-4 rounded-2xl cursor-pointer border border-transparent hover:border-white/10 transition-all group relative backdrop-blur-md"
                onClick={() => playPlaylist(playlist.songs)}
              >
                <button 
                  onClick={(e) => handleDeletePlaylist(playlist.id, e)}
                  className="absolute top-2 right-2 p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all z-20"
                >
                  <Trash2 size={16} />
                </button>
                <div className="w-full aspect-square bg-white/5 rounded-xl flex items-center justify-center mb-4 relative overflow-hidden group-hover:shadow-lg">
                  <ListMusic size={40} className="text-white/20" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play size={32} className="text-white" fill="currentColor" />
                  </div>
                </div>
                <h3 className="text-white font-bold truncate text-lg mb-1">{playlist.name}</h3>
                <p className="text-light text-sm">{playlist.songs?.length || 0} songs</p>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {playlists.length === 0 && !isCreating && (
            <div className="col-span-full py-10 text-center text-light">
              You haven't created any playlists yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Library;
