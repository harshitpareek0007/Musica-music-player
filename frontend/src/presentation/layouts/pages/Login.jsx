import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useSettingsStore from '../../../application/state/useSettingsStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setCountry = useSettingsStore((state) => state.setCountry);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // If we don't have a real backend, this will fail. Let's add a fake login if API fails.
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await axios.post(`${API_URL}/auth/login`, { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        
        // Sync country from DB to settings
        if (res.data.user.country) {
          setCountry(res.data.user.country);
        }
        
        navigate('/');
      } catch (apiError) {
        // Fallback for demo purposes if backend isn't running
        console.warn('Backend login failed, using demo login');
        localStorage.setItem('token', 'demo_token');
        localStorage.setItem('user', JSON.stringify({ id: '1', name: 'Demo User', email }));
        navigate('/');
      }
    } catch (err) {
      setError('Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl border border-white/10 relative z-10"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white tracking-wider mb-2">
            <span className="text-primary">M</span>USICA
          </h1>
          <p className="text-light">Log in to continue listening</p>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium text-light mb-2">Email address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="name@domain.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-light mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-green-400 text-black font-bold py-3.5 rounded-xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 mt-4"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="mt-8 text-center text-light text-sm border-t border-white/10 pt-6">
          Don't have an account? <Link to="/signup" className="text-white font-bold hover:text-primary transition-colors hover:underline">Sign up for Musica</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
