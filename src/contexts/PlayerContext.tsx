
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

export interface Track {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
  audioSrc?: string; // Actual path to audio file
  dataAiHint?: string;
  duration?: number; // Duration in seconds
}

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  isExpanded: boolean;
  progress: number; // 0-100
  currentTime: number; // in seconds
  duration: number; // in seconds
  playTrack: (track: Track) => void;
  togglePlayPause: () => void;
  toggleExpand: () => void;
  closeFullScreenPlayer: () => void;
  seek: (time: number) => void;
  // TODO: Add volume controls, shuffle, repeat
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
        audioRef.current = new Audio();
        
        audioRef.current.addEventListener('loadedmetadata', () => {
            setDuration(audioRef.current?.duration || 0);
        });
        audioRef.current.addEventListener('timeupdate', () => {
            setCurrentTime(audioRef.current?.currentTime || 0);
            if (audioRef.current?.duration) {
                setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
            }
        });
        audioRef.current.addEventListener('ended', () => {
            setIsPlaying(false);
            // TODO: Implement auto-play next track
        });
         // TODO: Add error handling for audio playback
    }
    return () => {
        // Cleanup: remove event listeners
        if (audioRef.current) {
            audioRef.current.removeEventListener('loadedmetadata', () => {});
            audioRef.current.removeEventListener('timeupdate', () => {});
            audioRef.current.removeEventListener('ended', () => {});
        }
    };
  }, []);


  const playTrack = useCallback((track: Track) => {
    setCurrentTrack(track);
    if (audioRef.current) {
      audioRef.current.src = track.audioSrc || ''; // Fallback to empty string if no src
      audioRef.current.load(); // Important to load new src
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error("Error playing track:", error);
        // TODO: Handle playback error (e.g., show toast)
        setIsPlaying(false);
      });
    }
    // If audioSrc is not available, we are in mock play mode.
    if (!track.audioSrc) {
      setIsPlaying(true); // For UI purposes
      setDuration(track.duration || 180); // Mock duration
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (!currentTrack) return;

    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play().catch(error => console.error("Error resuming playback:", error));
      setIsPlaying(true);
    }
  }, [currentTrack, isPlaying]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const toggleExpand = useCallback(() => {
    if (currentTrack) {
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
        progress,
        currentTime,
        duration,
        playTrack,
        togglePlayPause,
        toggleExpand,
        closeFullScreenPlayer,
        seek
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
