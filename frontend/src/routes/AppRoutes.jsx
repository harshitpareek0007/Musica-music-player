import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

const Home = lazy(() => import('../presentation/layouts/pages/Home'));
const Search = lazy(() => import('../presentation/layouts/pages/Search'));
const Library = lazy(() => import('../presentation/layouts/pages/Library'));
const SongPlayerPage = lazy(() => import('../presentation/layouts/pages/SongPlayerPage'));
const Login = lazy(() => import('../presentation/layouts/pages/Login'));
const Signup = lazy(() => import('../presentation/layouts/pages/Signup'));
const Profile = lazy(() => import('../presentation/layouts/pages/Profile'));
const Settings = lazy(() => import('../presentation/layouts/pages/Settings'));
const Premium = lazy(() => import('../presentation/layouts/pages/Premium'));

const LoadingFallback = () => (
  <div className="flex-1 h-screen flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(30,215,96,0.5)]"></div>
  </div>
);

const AppRoutes = () => {
  const location = useLocation();

  return (
    <Suspense fallback={<LoadingFallback />}>
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/library" element={<Library />} />
      <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/premium" element={<Premium />} />
        {/* We place SongPlayerPage outside MainLayout visual boundaries typically, 
            but it can just be rendered over everything via fixed positioning in the component itself. */}
        <Route path="/player/:songId" element={<SongPlayerPage />} />
        <Route path="*" element={<div className="text-white text-center mt-20">404 - Page Not Found</div>} />
    </Routes>
    </Suspense>
  );
};

export default AppRoutes;
