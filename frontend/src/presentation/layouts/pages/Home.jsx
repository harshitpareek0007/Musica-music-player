import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import useSettingsStore from '../../../application/state/useSettingsStore';
import usePlayerStore from '../../../application/state/usePlayerStore';
import CategoryRow from '../../components/CategoryRow';

const getDynamicSections = (country) => {
  const isIndia = country === 'India';

  const main = [
    { title: `Trending ${country}`, query: `${country} trending top hit`, isCircle: false },
    { title: `New Releases in ${country}`, query: `new release ${country}`, isCircle: false },
    { title: `Popular ${country} Artists`, query: `popular ${country} singer artist`, isCircle: true },
    { title: 'Viral Songs', query: `viral trending ${country}`, isCircle: false },
  ];

  const regional = isIndia ? [
    { title: 'Bollywood Hits', query: 'Bollywood Hindi trending', isCircle: false },
    { title: 'Punjabi Hits', query: 'Punjabi hit tracks', isCircle: false },
    { title: '90s Classics', query: '90s Hindi hits', isCircle: false },
    { title: 'Regional Music', query: 'Tamil Telugu Malayalam hit', isCircle: false },
    { title: 'Indie India', query: 'Indian indie pop', isCircle: false },
    { title: 'Devotional India', query: 'Indian devotional bhajan', isCircle: true },
  ] : [];

  const mood = [
    { title: 'Chill Music', query: `${isIndia ? 'Hindi ' : ''}lofi chill study`, isCircle: false },
    { title: 'Workout Music', query: `${isIndia ? 'Bollywood ' : ''}gym workout edm pump`, isCircle: false },
    { title: 'Love Songs', query: `${isIndia ? 'Bollywood ' : ''}romantic love hits`, isCircle: false },
    { title: 'Sad Songs', query: `${isIndia ? 'Hindi ' : ''}sad emotional breakup`, isCircle: false },
    { title: 'Party Songs', query: `${isIndia ? 'Bollywood ' : ''}party dance club`, isCircle: false },
  ];

  const podcasts = [
    { title: 'Motivation Podcasts', query: `${isIndia ? 'Hindi ' : ''}motivation speech podcast`, isCircle: false },
    ...(isIndia ? [{ title: 'Indian Podcasts', query: 'hindi podcast talk', isCircle: false }] : []),
    { title: 'Comedy Podcasts', query: `${isIndia ? 'Hindi ' : ''}comedy standup podcast`, isCircle: false },
  ];

  const genres = [
    { title: 'Pop', query: `${country} pop hits`, isCircle: false },
    { title: 'Hip Hop', query: `${country} hip hop rap`, isCircle: false },
    { title: 'EDM', query: 'electronic dance music', isCircle: false },
  ];

  return { main, regional, mood, podcasts, genres };
};

const Home = () => {
  const { country: activeCountry } = useSettingsStore();
  const { history } = usePlayerStore();

  const lastPlayed = history && history.length > 0 ? history[0] : null;
  const historyQuery = lastPlayed ? lastPlayed.title : 'pop hits';
  
  const dynamicSections = getDynamicSections(activeCountry);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col gap-6 pb-20 max-w-[1600px] mx-auto overflow-hidden"
    >
      {/* Hero Banner */}
      <div className="relative w-full h-[40vh] min-h-[300px] rounded-3xl overflow-hidden shadow-2xl mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-primary/40 to-black z-10 opacity-80" />
        <img 
          src="https://images.unsplash.com/photo-1614113489855-66422ad300a4?q=80&w=2000&auto=format&fit=crop" 
          alt="Hero" 
          fetchpriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-10">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-2"
          >
            Welcome to Musica
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-light max-w-2xl font-medium"
          >
            Your intelligent Musica platform. Discover thousands of tracks, curated specifically for you.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full w-fit border border-white/20"
          >
            <Globe size={18} className="text-primary" />
            <span className="text-white font-medium">Country: {activeCountry}</span>
          </motion.div>
        </div>
      </div>

      {/* Personalized Section based on history */}
      {lastPlayed && (
        <CategoryRow title="Because You Listened To" query={historyQuery} isCircle={false} />
      )}
      <CategoryRow title="Based On Your Taste" query={`${activeCountry} trending hits`} isCircle={false} />

      {/* Dynamic Sections Mapping */}
      {dynamicSections.main.map(section => (
        <CategoryRow key={section.title} title={section.title} query={section.query} isCircle={section.isCircle} />
      ))}

      {dynamicSections.regional.map(section => (
        <CategoryRow key={section.title} title={section.title} query={section.query} isCircle={section.isCircle} />
      ))}
      
      {dynamicSections.mood.map(section => (
        <CategoryRow key={section.title} title={section.title} query={section.query} isCircle={section.isCircle} />
      ))}

      {dynamicSections.genres.map(section => (
        <CategoryRow key={section.title} title={section.title} query={section.query} isCircle={section.isCircle} />
      ))}

      {dynamicSections.podcasts.map(section => (
        <CategoryRow key={section.title} title={section.title} query={section.query} isCircle={section.isCircle} />
      ))}

    </motion.div>
  );
};

export default Home;
