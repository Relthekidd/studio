"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback } from 'react';

export interface Track {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
  audioSrc?: string; // Optional: for actual playback
  dataAiHint?: string;
}

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  isExpanded: boolean;
  playTrack: (track: Track) => void;
  togglePlayPause: () => void;
  toggleExpand: () => void;
  closeFullScreenPlayer: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const playTrack = useCallback((track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    // Optionally, if miniplayer is hidden and a new track is played, show it.
    // if (isExpanded) setIsExpanded(false); // Or manage this based on UX preference
  }, []);

  const togglePlayPause = useCallback(() => {
    if (currentTrack) {
      setIsPlaying((prev) => !prev);
    }
  }, [currentTrack]);

  const toggleExpand = useCallback(() => {
    if (currentTrack) { // Only allow expand if there's a track
      setIsExpanded((prev) => !prev);
    }
  }, [currentTrack]);
  
  const closeFullScreenPlayer = useCallback(() => {
    setIsExpanded(false);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        isExpanded,
        playTrack,
        togglePlayPause,
        toggleExpand,
        closeFullScreenPlayer,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
