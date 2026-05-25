import React from 'react';
import Sidebar from '../components/Sidebar';
import Player from '../components/Player';
import GlobalAudio from '../components/GlobalAudio';
import Navbar from '../components/Navbar';
import usePlayerStore from '../../application/state/usePlayerStore';
import { useLocation } from 'react-router-dom';

const MainLayout = ({ children }) => {
  const { queue, currentIndex } = usePlayerStore();
  const location = useLocation();
  const currentTrack = queue[currentIndex];

  // We don't render the typical sidebar/player on the full screen player page
  const isPlayerPage = location.pathname.startsWith('/player/') || location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="h-screen w-full flex flex-col bg-darker overflow-hidden text-white font-sans selection:bg-primary selection:text-white">
      <GlobalAudio />
      {!isPlayerPage ? (
        <div className="flex flex-1 overflow-hidden relative">
          <Sidebar />
          
          <main className="flex-1 overflow-y-auto relative z-10 flex flex-col pb-16 md:pb-0">
            {/* Ambient Animated Background Gradients */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none animate-pulse-slow" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[180px] pointer-events-none" />
            
            <Navbar />
            
            <div className="relative z-10 w-full flex-1 p-4 md:p-8 bg-gradient-to-b from-darker/50 to-darker">
              {children}
            </div>
          </main>
        </div>
      ) : (
        <div className="flex-1 relative z-10 overflow-hidden">
          {children}
        </div>
      )}

      {/* Persist player at bottom if track exists and we are not on full screen player */}
      <div className={`transition-all duration-500 ease-in-out z-40 mb-16 md:mb-0 ${currentTrack && !isPlayerPage ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 absolute bottom-0 w-full'}`}>
        {currentTrack && !isPlayerPage && <Player />}
      </div>
    </div>
  );
};

export default MainLayout;
