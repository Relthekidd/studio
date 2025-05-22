'use client';

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
} from 'react';

export interface Track {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  coverUrl?: string;
  [key: string]: any;
}

export interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  setTrack: (track: Track) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const play = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const setTrack = (track: Track) => {
    setCurrentTrack(track);
    setTimeout(() => {
      play();
    }, 100); // ensures audioRef is ready
  };

  // Pause when track ends
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        play,
        pause,
        setTrack,
        audioRef,
      }}
    >
      {children}
      <audio ref={audioRef} src={currentTrack?.audioUrl ?? ''} />
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
