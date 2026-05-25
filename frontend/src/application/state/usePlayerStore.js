import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const usePlayerStore = create(
  persist(
    (set, get) => ({
      queue: [],
      currentIndex: -1,
      isPlaying: false,
      volume: 1,
      progress: 0,
      duration: 0,
      isShuffle: false,
      isRepeat: false,
      history: [], // For recently played & recommendations

      setQueue: (queue, startIndex = 0) => {
        set((state) => {
          const track = queue[startIndex];
          const newHistory = track ? [track, ...state.history.filter(t => t.id !== track.id)].slice(0, 50) : state.history;
          return { 
            queue, 
            currentIndex: startIndex,
            isPlaying: true,
            progress: 0,
            history: newHistory
          };
        });
      },

      setCurrentTrack: (track) => {
        const { queue } = get();
        const index = queue.findIndex(t => t.id === track.id);
        
        set((state) => {
          const newHistory = [track, ...state.history.filter(t => t.id !== track.id)].slice(0, 50);
          if (index !== -1) {
            return { currentIndex: index, isPlaying: true, progress: 0, history: newHistory };
          } else {
            // Not in queue, create a single item queue
            return { queue: [track], currentIndex: 0, isPlaying: true, progress: 0, history: newHistory };
          }
        });
      },

      setIsPlaying: (isPlaying) => set({ isPlaying }),
      setVolume: (volume) => set({ volume }),
      setProgress: (progress) => set({ progress }),
      setDuration: (duration) => set({ duration }),
      toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),
      toggleRepeat: () => set((state) => ({ isRepeat: !state.isRepeat })),
      
      playNext: () => {
        const { queue, currentIndex, isShuffle, isRepeat } = get();
        if (queue.length === 0) return;
        
        if (isRepeat) {
          set({ progress: 0, isPlaying: true });
          return;
        }
        
        if (isShuffle) {
          const randomIndex = Math.floor(Math.random() * queue.length);
          set((state) => {
            const track = queue[randomIndex];
            const newHistory = track ? [track, ...state.history.filter(t => t.id !== track.id)].slice(0, 50) : state.history;
            return { currentIndex: randomIndex, isPlaying: true, progress: 0, history: newHistory };
          });
          return;
        }
        
        if (currentIndex < queue.length - 1) {
          set((state) => {
            const track = queue[currentIndex + 1];
            const newHistory = track ? [track, ...state.history.filter(t => t.id !== track.id)].slice(0, 50) : state.history;
            return { currentIndex: currentIndex + 1, isPlaying: true, progress: 0, history: newHistory };
          });
        } else {
          set({ isPlaying: false, progress: 0 });
        }
      },
      
      playPrevious: () => {
        const { queue, currentIndex, progress } = get();
        if (queue.length === 0) return;
        
        if (progress > 3) {
          set({ progress: 0 });
          return;
        }
        
        if (currentIndex > 0) {
          set((state) => {
            const track = queue[currentIndex - 1];
            const newHistory = track ? [track, ...state.history.filter(t => t.id !== track.id)].slice(0, 50) : state.history;
            return { currentIndex: currentIndex - 1, isPlaying: true, progress: 0, history: newHistory };
          });
        } else {
          set({ progress: 0 });
        }
      }
    }),
    {
      name: 'music-player-storage'
    }
  )
);

export default usePlayerStore;
