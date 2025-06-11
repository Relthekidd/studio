import { create } from 'zustand';
import { Track } from '@/types/music';

type RepeatMode = 'off' | 'one' | 'all';

type PlayerStore = {
  currentTrack: Track | null;
  isPlaying: boolean;
  isExpanded: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  repeatMode: RepeatMode;
  shuffleMode: boolean;
  queue: Track[];
  queueIndex: number;

  // Actions
  setTrack: (track: Track) => void;
  setQueue: (tracks: Track[]) => void;
  setCurrentTrack: (track: Track | null) => void;
  setIsPlaying: (val: boolean) => void;
  addToQueue: (track: Track) => void;
  addTracksToQueue: (tracks: Track[]) => void;
  togglePlayPause: () => void;
  toggleExpand: () => void;
  setProgress: (val: number) => void;
  setCurrentTime: (val: number) => void;
  setDuration: (val: number) => void;
  seek: (val: number) => void;
  setVolume: (val: number) => void;
  setMuted: (val: boolean) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void; // Added toggleShuffle
  skipToNext: () => void;
  skipToPrev: () => void;
};

export const usePlayerStore = create<PlayerStore>()((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  isExpanded: false,
  progress: 0,
  currentTime: 0,
  duration: 0,
  volume: 1,
  isMuted: false,
  repeatMode: 'off',
  shuffleMode: false,
  queue: [],
  queueIndex: 0,

  setTrack: (track) => {
    const queue = get().queue;
    const index = queue.findIndex((t) => t.id === track.id);
    set({
      currentTrack: track,
      queueIndex: index >= 0 ? index : 0,
      isPlaying: true,
      isExpanded: false,
      currentTime: 0,
      progress: 0,
      duration: 0,
    });
  },

  setCurrentTrack: (track) =>
    set({
      currentTrack: track,
      isExpanded: false,
      currentTime: 0,
      progress: 0,
      duration: 0,
    }),
  setIsPlaying: (val) => set({ isPlaying: val }),

  addToQueue: (track) => set((s) => ({ queue: [...s.queue, track] })),
  addTracksToQueue: (tracks) => set((s) => ({ queue: [...s.queue, ...tracks] })),

  setQueue: (tracks) => {
    set({
      queue: tracks,
      queueIndex: 0,
      currentTrack: tracks[0] ?? null,
      isPlaying: !!tracks[0],
      isExpanded: false,
      currentTime: 0,
      progress: 0,
      duration: 0,
    });
  },

  togglePlayPause: () => set((s) => ({ isPlaying: !s.isPlaying })),
  toggleExpand: () => set((s) => ({ isExpanded: !s.isExpanded })),
  setProgress: (val) => set({ progress: val }),
  setCurrentTime: (val) => set({ currentTime: val }),
  setDuration: (val) => set({ duration: val }),

  seek: (val) => {
    const duration = get().duration || 1;
    set({
      currentTime: val,
      progress: (val / duration) * 100,
    });
  },

  setVolume: (val) => set({ volume: val }),
  setMuted: (val) => set({ isMuted: val }),

  toggleRepeat: () =>
    set((s) => ({
      repeatMode: s.repeatMode === 'off' ? 'all' : s.repeatMode === 'all' ? 'one' : 'off',
    })),

  toggleShuffle: () => set((s) => ({ shuffleMode: !s.shuffleMode })), // Added implementation

  skipToNext: () => {
    const { queue, queueIndex, shuffleMode, repeatMode } = get();

    if (queue.length === 0) return;

    let nextIndex = queueIndex + 1;

    if (shuffleMode) {
      // pick a random track different from the current
      if (queue.length === 1) {
        nextIndex = 0;
      } else {
        do {
          nextIndex = Math.floor(Math.random() * queue.length);
        } while (nextIndex === queueIndex);
      }
    } else if (nextIndex >= queue.length) {
      if (repeatMode === 'all') {
        nextIndex = 0;
      } else {
        // no more tracks and repeat is off
        set({ isPlaying: false });
        return;
      }
    }

    set({
      queueIndex: nextIndex,
      currentTrack: queue[nextIndex],
      isPlaying: true,
      currentTime: 0,
      progress: 0,
      duration: 0,
    });
  },

  skipToPrev: () => {
    const { queue, queueIndex, shuffleMode, repeatMode } = get();

    if (queue.length === 0) return;

    let prevIndex = queueIndex - 1;

    if (shuffleMode) {
      if (queue.length === 1) {
        prevIndex = 0;
      } else {
        do {
          prevIndex = Math.floor(Math.random() * queue.length);
        } while (prevIndex === queueIndex);
      }
    } else if (prevIndex < 0) {
      if (repeatMode === 'all') {
        prevIndex = queue.length - 1;
      } else {
        set({ isPlaying: false });
        return;
      }
    }

    set({
      queueIndex: prevIndex,
      currentTrack: queue[prevIndex],
      isPlaying: true,
      currentTime: 0,
      progress: 0,
      duration: 0,
    });
  },
}));
