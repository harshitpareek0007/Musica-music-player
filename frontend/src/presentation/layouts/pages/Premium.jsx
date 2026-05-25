import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Premium = () => {
  const navigate = useNavigate();

  const handleSubscribe = () => {
    alert("Simulating mock payment process... Subscription successful! Enjoy Premium.");
    navigate('/');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-[80vh] gap-12 pb-20 max-w-5xl mx-auto px-4"
    >
      <div className="text-center">
        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-6 drop-shadow-xl">
          Get Premium
        </h1>
        <p className="text-xl text-white/80 max-w-2xl mx-auto font-medium">
          Listen without limits. High-quality audio, ad-free music, and offline listening.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 w-full">
        {/* Free Plan */}
        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 flex flex-col h-full shadow-2xl relative overflow-hidden group hover:border-white/20 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
          <h2 className="text-2xl font-bold text-white mb-2 relative z-10">Musica Free</h2>
          <p className="text-4xl font-black text-white mb-8 relative z-10">$0<span className="text-lg text-white/50 font-normal">/month</span></p>
          
          <div className="flex flex-col gap-4 mb-10 flex-1 relative z-10">
            <div className="flex items-center gap-3 text-white/80"><Check className="text-white/40" /> Ad-supported music listening</div>
            <div className="flex items-center gap-3 text-white/80"><Check className="text-white/40" /> Standard audio quality</div>
            <div className="flex items-center gap-3 text-white/80"><Check className="text-white/40" /> 6 skips per hour</div>
            <div className="flex items-center gap-3 text-white/40 opacity-50"><Check className="text-white/20" /> Play any song (Mobile shuffle)</div>
          </div>
          
          <button className="w-full py-4 rounded-xl font-bold border border-white/20 text-white hover:bg-white/10 transition-colors relative z-10">
            Current Plan
          </button>
        </div>

        {/* Premium Plan */}
        <div className="bg-gradient-to-br from-green-900 to-black rounded-3xl p-8 border border-primary flex flex-col h-full shadow-[0_0_50px_rgba(30,215,96,0.2)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
          
          <div className="flex items-center justify-between mb-2 relative z-10">
            <h2 className="text-2xl font-bold text-primary">Musica Premium</h2>
            <div className="bg-primary text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <Star size={12} fill="currentColor" /> POPULAR
            </div>
          </div>
          
          <p className="text-4xl font-black text-white mb-8 relative z-10">$9.99<span className="text-lg text-white/50 font-normal">/month</span></p>
          
          <div className="flex flex-col gap-4 mb-10 flex-1 relative z-10">
            <div className="flex items-center gap-3 text-white"><Check className="text-primary" /> Ad-free music listening</div>
            <div className="flex items-center gap-3 text-white"><Check className="text-primary" /> High-quality audio (320kbps)</div>
            <div className="flex items-center gap-3 text-white"><Check className="text-primary" /> Unlimited skips</div>
            <div className="flex items-center gap-3 text-white"><Check className="text-primary" /> Listen offline anywhere</div>
            <div className="flex items-center gap-3 text-white"><Zap className="text-primary" /> Exclusive premium badges</div>
          </div>
          
          <button onClick={handleSubscribe} className="w-full py-4 rounded-xl font-bold bg-primary text-black hover:bg-green-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(30,215,96,0.4)] relative z-10">
            Get Premium
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Premium;
