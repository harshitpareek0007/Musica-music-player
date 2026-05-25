import React from 'react';
import { motion } from 'framer-motion';
import { User, Clock, Heart, ListMusic, Edit2 } from 'lucide-react';
import usePlayerStore from '../../../application/state/usePlayerStore';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = token ? JSON.parse(localStorage.getItem('user')) : null;
  const { history, setQueue } = usePlayerStore();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handlePlayTrack = (tracks, startIndex) => {
    setQueue(tracks, startIndex);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-10 pb-20 max-w-7xl mx-auto"
    >
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-8 bg-white/5 p-10 rounded-3xl border border-white/10 backdrop-blur-md relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-primary/20 opacity-50 blur-3xl" />
        
        <div className="relative z-10 w-48 h-48 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl flex items-center justify-center text-7xl font-bold text-white border-4 border-white/10 group">
          {user.name?.charAt(0).toUpperCase()}
          <button className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Edit2 size={32} />
          </button>
        </div>
        
        <div className="relative z-10 flex flex-col items-center md:items-start">
          <p className="uppercase text-sm font-bold tracking-widest text-light mb-2">Profile</p>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-lg">{user.name}</h1>
          <div className="flex gap-6 text-sm font-medium text-white/80">
            <span className="flex items-center gap-2"><User size={16} /> 1 Follower</span>
            <span className="flex items-center gap-2"><Heart size={16} /> 24 Liked Songs</span>
            <span className="flex items-center gap-2"><ListMusic size={16} /> 3 Playlists</span>
          </div>
        </div>
      </div>

      {/* Listening History */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Clock size={24} className="text-primary" />
          <h2 className="text-2xl font-bold text-white">Recently Played</h2>
        </div>
        
        {history.length === 0 ? (
          <div className="bg-white/5 rounded-2xl p-10 text-center text-light border border-white/10">
            You haven't played any songs yet. Go discover some music!
          </div>
        ) : (
          <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-sm">
            {history.slice(0, 10).map((track, index) => (
              <div 
                key={track.id + index}
                onClick={() => handlePlayTrack(history, index)}
                className="flex items-center gap-4 p-4 hover:bg-white/10 transition-colors cursor-pointer border-b border-white/5 last:border-0 group"
              >
                <div className="text-light w-6 text-center font-medium group-hover:text-primary">{index + 1}</div>
                <img src={track.artwork?.['150x150'] || 'https://via.placeholder.com/150'} className="w-12 h-12 rounded-md shadow-md" alt={track.title} />
                <div className="flex-1">
                  <h3 className="text-white font-medium group-hover:text-primary transition-colors">{track.title}</h3>
                  <p className="text-light text-sm">{track.user?.name}</p>
                </div>
                <div className="text-light text-sm pr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Heart size={20} className="hover:text-white transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Your Playlists */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Your Playlists</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {/* Create New Playlist Card */}
          <div className="bg-white/5 hover:bg-white/10 p-6 rounded-2xl border border-white/10 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-all hover:scale-105 min-h-[200px]">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-3xl font-light text-white">+</span>
            </div>
            <span className="font-medium text-white">Create Playlist</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
