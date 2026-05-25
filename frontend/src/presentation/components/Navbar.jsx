import React, { useState } from 'react';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = React.memo(() => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Simple auth check - using local storage for mockup
  const token = localStorage.getItem('token');
  const user = token ? JSON.parse(localStorage.getItem('user')) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="w-full h-16 bg-transparent flex items-center justify-between px-8 z-50">
      <div className="flex-1" />
      <div className="flex items-center gap-4 relative">
        {user ? (
          <>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-3 py-1.5 rounded-full"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-500 rounded-full flex items-center justify-center font-bold text-white shadow-lg">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium">{user.name}</span>
              <ChevronDown size={16} />
            </button>

            {dropdownOpen && (
              <div className="absolute top-12 right-0 w-48 bg-card border border-white/10 rounded-xl shadow-2xl py-2 flex flex-col z-50 backdrop-blur-xl">
                <Link to="/profile" className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 transition-colors" onClick={() => setDropdownOpen(false)}>
                  <User size={16} />
                  <span className="text-sm">Profile</span>
                </Link>
                <Link to="/settings" className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 transition-colors" onClick={() => setDropdownOpen(false)}>
                  <Settings size={16} />
                  <span className="text-sm">Settings</span>
                </Link>
                <div className="w-full h-px bg-white/10 my-1" />
                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 transition-colors text-red-400 w-full text-left">
                  <LogOut size={16} />
                  <span className="text-sm">Log out</span>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex gap-3">
            <Link to="/login" className="px-5 py-2 rounded-full font-medium text-white hover:text-primary transition-colors">Log in</Link>
            <Link to="/signup" className="px-5 py-2 bg-white text-black rounded-full font-medium hover:scale-105 transition-transform shadow-lg">Sign up</Link>
          </div>
        )}
      </div>
    </div>
  );
});

export default Navbar;
