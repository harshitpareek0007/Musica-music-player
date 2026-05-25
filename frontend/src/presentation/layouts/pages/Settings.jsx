import React from 'react';
import { motion } from 'framer-motion';
import useSettingsStore from '../../../application/state/useSettingsStore';
import { User, Settings as SettingsIcon, Globe, PlayCircle, Shield, Bell, Music } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const COUNTRIES = ['India', 'USA', 'UK', 'Korea', 'Global'];
const QUALITIES = ['Low', 'Normal', 'High', 'Very High'];

const Settings = () => {
  const { country, setCountry, audioQuality, setAudioQuality, autoplay, setAutoplay } = useSettingsStore();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleCountryChange = async (e) => {
    const newCountry = e.target.value;
    setCountry(newCountry);
    
    // Sync with database
    if (token && token !== 'demo_token') {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        await axios.put(`${API_URL}/user/settings`, 
          { country: newCountry },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Update local storage user object
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          localStorage.setItem('user', JSON.stringify({ ...user, country: newCountry }));
        }
      } catch (err) {
        console.error('Failed to sync country to database');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const Section = ({ title, icon, children }) => (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
        {icon}
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>
      <div className="flex flex-col gap-6 pl-2 md:pl-10">
        {children}
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto pb-20"
    >
      <h1 className="text-4xl font-extrabold text-white mb-10">Settings</h1>

      <Section title="Account & Profile" icon={<User className="text-primary" size={28} />}>
        <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl">
          <div>
            <h3 className="font-medium text-white">Edit Profile</h3>
            <p className="text-sm text-light">Change your username and avatar</p>
          </div>
          <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-sm font-medium">Edit</button>
        </div>
        <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl">
          <div>
            <h3 className="font-medium text-white">Subscription</h3>
            <p className="text-sm text-light">Manage your plan</p>
          </div>
          <button onClick={() => navigate('/premium')} className="px-4 py-2 bg-primary text-black rounded-full transition-colors text-sm font-bold shadow-lg">Upgrade to Premium</button>
        </div>
      </Section>

      <Section title="Preferences" icon={<Globe className="text-purple-400" size={28} />}>
        <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl">
          <div>
            <h3 className="font-medium text-white">Country Preference</h3>
            <p className="text-sm text-light">This prioritizes your music recommendations</p>
          </div>
          <select 
            value={country}
            onChange={handleCountryChange}
            className="bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary appearance-none cursor-pointer min-w-[120px]"
          >
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl">
          <div>
            <h3 className="font-medium text-white">Favorite Genres</h3>
            <p className="text-sm text-light">Personalize your feed further</p>
          </div>
          <button className="px-4 py-2 border border-white/20 hover:border-white/50 rounded-full transition-colors text-sm font-medium">Select Genres</button>
        </div>
      </Section>

      <Section title="Playback" icon={<PlayCircle className="text-blue-400" size={28} />}>
        <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl">
          <div>
            <h3 className="font-medium text-white">Audio Quality</h3>
            <p className="text-sm text-light">Streaming quality</p>
          </div>
          <select 
            value={audioQuality}
            onChange={(e) => setAudioQuality(e.target.value)}
            className="bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary appearance-none cursor-pointer min-w-[120px]"
          >
            {QUALITIES.map(q => <option key={q} value={q.toLowerCase()}>{q}</option>)}
          </select>
        </div>
        <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl">
          <div>
            <h3 className="font-medium text-white">Autoplay</h3>
            <p className="text-sm text-light">Keep listening to similar tracks when your music ends</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={autoplay} onChange={(e) => setAutoplay(e.target.checked)} />
            <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </Section>

      <Section title="Privacy & Security" icon={<Shield className="text-red-400" size={28} />}>
        <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl">
          <div>
            <h3 className="font-medium text-white text-red-400">Log out</h3>
            <p className="text-sm text-light">End your session</p>
          </div>
          <button onClick={handleLogout} className="px-6 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-full transition-colors font-medium border border-red-500/30">Log out</button>
        </div>
      </Section>
    </motion.div>
  );
};

export default Settings;
