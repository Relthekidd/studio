
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string; // Optional: For display in queue or elsewhere
  imageUrl: string;
  audioSrc?: string; 
  dataAiHint?: string;
  duration?: number; 
}

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  isExpanded: boolean;
  progress: number; 
  currentTime: number; 
  duration: number; 
  volume: number; // 0 to 1
  isMuted: boolean;
  shuffleMode: boolean;
  repeatMode: 'off' | 'one' | 'all';
  playTrack: (track: Track, playNext?: Track[], playPrevious?: Track[]) => void; // Optional queue context
  togglePlayPause: () => void;
  toggleExpand: () => void;
  closeFullScreenPlayer: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  playNextTrack: () => void; // Placeholder
  playPreviousTrack: () => void; // Placeholder
  // TODO: Add queue management functions
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.75); // Default volume
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [shuffleMode, setShuffleMode] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'one' | 'all'>('off');
  
  // TODO: Implement actual queue logic
  // const [queue, setQueue] = useState<Track[]>([]);
  // const [history, setHistory] = useState<Track[]>([]);


  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
        audioRef.current = new Audio();
        
        audioRef.current.addEventListener('loadedmetadata', () => {
            setDuration(audioRef.current?.duration || 0);
        });
        audioRef.current.addEventListener('timeupdate', () => {
            const curTime = audioRef.current?.currentTime || 0;
            const dur = audioRef.current?.duration || 0;
            setCurrentTime(curTime);
            if (dur > 0) {
                setProgress((curTime / dur) * 100);
            } else {
                setProgress(0);
            }
        });
        audioRef.current.addEventListener('ended', () => {
            // TODO: Implement repeat logic and auto-play next track from queue
            if (repeatMode === 'one' && audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play();
            } else {
              // playNextTrack(); // Implement this
              setIsPlaying(false); // Fallback
            }
        });
        audioRef.current.addEventListener('volumechange', () => {
            if(audioRef.current) {
                setVolume(audioRef.current.volume);
                setIsMuted(audioRef.current.muted);
            }
        });
    }
    return () => {
        if (audioRef.current) {
            audioRef.current.removeEventListener('loadedmetadata', () => {});
            audioRef.current.removeEventListener('timeupdate', () => {});
            audioRef.current.removeEventListener('ended', () => {});
            audioRef.current.removeEventListener('volumechange', () => {});
        }
    };
  }, [repeatMode]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);


  const playTrack = useCallback((track: Track, playNext?: Track[], playPrevious?: Track[]) => {
    setCurrentTrack(track);
    if (audioRef.current) {
      audioRef.current.src = track.audioSrc || ''; 
      audioRef.current.load(); 
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error("Error playing track:", error);
        setIsPlaying(false);
      });
    }
    if (!track.audioSrc) {
      setIsPlaying(true); 
      setDuration(track.duration || 180); 
      setProgress(0);
      setCurrentTime(0);
    }
     // TODO: Set queue and history: setQueue(playNext || []); setHistory(playPrevious || []);
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
    if (audioRef.current && duration > 0) {
      const newTime = Math.min(Math.max(0, time), duration);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  }, [duration]);

  const handleSetVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.min(Math.max(0, newVolume), 1);
    setVolume(clampedVolume);
    if (audioRef.current) {
        audioRef.current.volume = clampedVolume;
        if (clampedVolume > 0 && isMuted) {
            setIsMuted(false);
            audioRef.current.muted = false;
        }
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
        if(audioRef.current) audioRef.current.muted = !prev;
        return !prev;
    });
  }, []);

  const toggleShuffle = useCallback(() => setShuffleMode(prev => !prev), []);
  const toggleRepeat = useCallback(() => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  const playNextTrack = useCallback(() => {
    // TODO: Implement logic to play the next track from the queue, considering shuffle
    console.log("Play next track (not implemented)");
  }, []);

  const playPreviousTrack = useCallback(() => {
    // TODO: Implement logic to play the previous track from history
    console.log("Play previous track (not implemented)");
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
        volume,
        isMuted,
        shuffleMode,
        repeatMode,
        playTrack,
        togglePlayPause,
        toggleExpand,
        closeFullScreenPlayer,
        seek,
        setVolume: handleSetVolume,
        toggleMute,
        toggleShuffle,
        toggleRepeat,
        playNextTrack,
        playPreviousTrack,
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

