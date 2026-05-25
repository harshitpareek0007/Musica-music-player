import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('India');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const COUNTRIES = ['India', 'USA', 'UK', 'Korea', 'Global'];

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await axios.post(`${API_URL}/auth/signup`, { name, email, password, country });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify({ ...res.data.user, country }));
        navigate('/');
      } catch (apiError) {
        console.warn('Backend signup failed, using demo signup');
        localStorage.setItem('token', 'demo_token');
        localStorage.setItem('user', JSON.stringify({ id: '1', name, email, country }));
        navigate('/');
      }
    } catch (err) {
      setError('Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
      {/* Background gradients */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl border border-white/10 relative z-10"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white tracking-wider mb-2">
            Sign up for <span className="text-primary">M</span>USICA
          </h1>
          <p className="text-light">Start listening to the best music for free</p>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}

        <form onSubmit={handleSignup} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-light mb-2">What should we call you?</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="Enter a profile name."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-light mb-2">What's your email?</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="Enter your email."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-light mb-2">Create a password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="Create a password."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-light mb-2">Choose your preferred country</label>
            <select 
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none"
            >
              {COUNTRIES.map(c => (
                <option key={c} value={c} className="bg-black text-white">{c}</option>
              ))}
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-green-400 text-black font-bold py-3.5 rounded-xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 mt-4"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-8 text-center text-light text-sm border-t border-white/10 pt-6">
          Have an account? <Link to="/login" className="text-white font-bold hover:text-primary transition-colors hover:underline">Log in</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
