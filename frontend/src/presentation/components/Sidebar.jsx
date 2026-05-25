import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Library, Heart } from 'lucide-react';

const Sidebar = React.memo(() => {
  const activeClass = "flex items-center gap-4 text-white font-semibold";
  const inactiveClass = "flex items-center gap-4 text-light hover:text-white transition-colors duration-200";

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 h-full bg-darker p-6 flex-col glass border-r border-white/5">
        <div className="text-2xl font-bold text-white mb-8 tracking-wider">
          <span className="text-primary">M</span>USICA
        </div>
        
        <nav className="flex flex-col gap-6">
          <NavLink to="/" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
            <Home size={24} />
            <span>Home</span>
          </NavLink>
          <NavLink to="/search" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
            <Search size={24} />
            <span>Search</span>
          </NavLink>
          <NavLink to="/library" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
            <Library size={24} />
            <span>Your Library</span>
          </NavLink>
        </nav>

        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col gap-4">
          <button className="flex items-center gap-4 text-light hover:text-white transition-colors duration-200 text-left">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 rounded-sm">
              <Heart size={16} className="text-white fill-white" />
            </div>
            <span>Liked Songs</span>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card/95 backdrop-blur-xl border-t border-white/10 z-[60] flex items-center justify-around px-4">
        <NavLink to="/" className={({ isActive }) => isActive ? "text-white" : "text-light hover:text-white transition-colors"}>
          <Home size={24} />
        </NavLink>
        <NavLink to="/search" className={({ isActive }) => isActive ? "text-white" : "text-light hover:text-white transition-colors"}>
          <Search size={24} />
        </NavLink>
        <NavLink to="/library" className={({ isActive }) => isActive ? "text-white" : "text-light hover:text-white transition-colors"}>
          <Library size={24} />
        </NavLink>
      </div>
    </>
  );
});

export default Sidebar;
