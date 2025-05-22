'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

export interface ArtistStub {
  id: string;
  name: string;
}

export type Track = {
  id: string;
  title: string;
  imageUrl: string;
  artist?: string;
  audioSrc?: string;
  albumId?: string;
  artists?: ArtistStub[];
  genre?: string;
  duration?: number;
  lastPlayed?: string;
  dateAdded?: string;
  description?: string;
  trackNumber?: number; // ✅ Fixes trackNumber errors
  album?: {
    id: string;
    name: string;
  }; 
  albumName?: string;
  dataAiHint?: string;
  type?: 'track' | 'album' | 'playlist' | 'artist' | 'user' | 'single';
};

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  isExpanded: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  shuffleMode: boolean;
  repeatMode: 'off' | 'one' | 'all';
  queue: Track[];
  setQueue: (queue: Track[]) => void;
  playTrack: (track: Track, playNext?: Track[], playPrevious?: Track[]) => void;
  togglePlayPause: () => void;
  toggleExpand: () => void;
  closeFullScreenPlayer: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  playNextTrack: () => void;
  playPreviousTrack: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [shuffleMode, setShuffleMode] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'one' | 'all'>('off');
  const [queue, setQueue] = useState<Track[]>([]);

  const currentIndex = currentTrack
    ? queue.findIndex((t) => t.id === currentTrack.id)
    : -1;

  const playTrack = (track: Track, queueOverride?: Track[]) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    if (queueOverride) {
      setQueue(queueOverride);
    } else if (!queue.find((t) => t.id === track.id)) {
      setQueue([track]);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const closeFullScreenPlayer = () => {
    setIsExpanded(false);
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleSetVolume = (vol: number) => {
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
    setVolumeState(vol);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !audioRef.current.muted;
    setIsMuted(audioRef.current.muted);
  };

  const toggleShuffle = () => {
    setShuffleMode((prev) => !prev);
  };

  const toggleRepeat = () => {
    setRepeatMode((prev) =>
      prev === 'off' ? 'one' : prev === 'one' ? 'all' : 'off'
    );
  };

  const playNextTrack = () => {
    if (repeatMode === 'one' && currentTrack) {
      playTrack(currentTrack);
      return;
    }

    if (shuffleMode && queue.length > 1) {
      let next;
      do {
        next = queue[Math.floor(Math.random() * queue.length)];
      } while (next.id === currentTrack?.id);
      playTrack(next);
      return;
    }

    if (currentIndex !== -1 && currentIndex < queue.length - 1) {
      playTrack(queue[currentIndex + 1]);
    } else if (repeatMode === 'all') {
      playTrack(queue[0]);
    } else {
      setIsPlaying(false);
    }
  };

  const playPreviousTrack = () => {
    if (currentIndex > 0) {
      playTrack(queue[currentIndex - 1]);
    }
  };

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.volume = volume;

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      playNextTrack();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack, queue, repeatMode, shuffleMode]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch((e) => console.error('Playback error', e));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

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
        queue,
        setQueue,
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
      <audio ref={audioRef} src={currentTrack?.audioSrc} />
    </PlayerContext.Provider>
  );
};

