import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSettingsStore = create(
  persist(
    (set, get) => ({
      country: 'India',
      activeCategory: null,
      theme: 'dark',
      audioQuality: 'high',
      autoplay: true,
      
      setCountry: (country) => set({ country }),
      setActiveCategory: (category) => set({ activeCategory: category }),
      setTheme: (theme) => set({ theme }),
      setAudioQuality: (quality) => set({ audioQuality: quality }),
      setAutoplay: (autoplay) => set({ autoplay })
    }),
    {
      name: 'musica-settings-storage',
    }
  )
);

export default useSettingsStore;
