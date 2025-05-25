'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from 'react';

export interface Track {
  type: string;
  id: string;
  title: string;
  artist: { id: string; name: string }[];
  audioURL: string;
  coverURL: string;
  albumId?: string;
  albumName?: string;
  album?: { id: string; name: string; coverURL?: string };
  duration?: number;
  trackNumber?: number;
  description?: string;
  dataAiHint?: string;
}

export interface PlayerContextType {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  playTrack: (track: Track) => void;
  togglePlayPause: (track?: Track) => void;
  pause: () => void;
  play: () => void;
  setQueue: (tracks: Track[]) => void;
  seek: (seconds: number) => void;
  currentTime: number;
  duration: number;
  progress: number;
  volume: number;
  setVolume: (volume: number) => void;
  isMuted: boolean;
  toggleMute: () => void;
  setMuted: (muted: boolean) => void;
  repeatMode: 'off' | 'one' | 'all';
  toggleRepeat: () => void;
  shuffleMode: boolean;
  toggleShuffleMode: () => void;
  isExpanded: boolean;
  toggleExpand: () => void;
  closeFullScreenPlayer: () => void;
  playNextTrack: () => void;
  playPreviousTrack: () => void;
}

// SafeTrack function to ensure a valid Track object
const safeTrack = (track: Partial<Track>): Track => ({
  id: track.id || '',
  title: track.title || 'Untitled',
  artist: track.artist || [{ id: '', name: 'Unknown Artist' }],
  audioURL: track.audioURL || '',
  coverURL: track.coverURL || '/placeholder.png',
  type: track.type || 'single',
  albumId: track.albumId || '',
  albumName: track.albumName || '',
  album: track.album || { id: '', name: 'Unknown Album', coverURL: '/placeholder.png' },
  duration: track.duration || 0,
  trackNumber: track.trackNumber || 1,
  description: track.description || '',
  dataAiHint: track.dataAiHint || '',
});

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'one' | 'all'>('off');
  const [shuffleMode, setShuffleMode] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  const play = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((err) => console.error('Error playing audio:', err));
      setIsPlaying(true);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const seek = (seconds: number) => {
    if (audioRef.current && !isNaN(audioRef.current.duration)) {
      audioRef.current.currentTime = seconds;
    }
  };

  const setMuted = (muted: boolean) => {
    setIsMuted(muted);
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      if (!isNaN(audio.duration)) {
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const onLoadedMetadata = () => {
      if (!isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const onEnded = () => {
      setIsPlaying(false);
      playNextTrack(); // Automatically play the next track
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        queue,
        isPlaying,
        playTrack: (track: Track) => {
          const safe = safeTrack(track);
          setCurrentTrack(safe);
          setTimeout(() => play(), 50);
        },
        togglePlayPause: (track?: Track) => {
          if (track) {
            const safe = safeTrack(track);
            if (safe.id !== currentTrack?.id) {
              setCurrentTrack(safe);
              setTimeout(() => play(), 50);
            } else {
              isPlaying ? pause() : play();
            }
          } else {
            isPlaying ? pause() : play();
          }
        },
        pause,
        play,
        setQueue: (tracks: Track[]) => {
          const safeQueue = tracks.map((track) => safeTrack(track));
          setQueue(safeQueue);
        },
        seek,
        currentTime,
        duration,
        progress,
        volume,
        setVolume,
        isMuted,
        toggleMute: () => setIsMuted((prev) => !prev),
        setMuted,
        repeatMode,
        toggleRepeat: () => {
          setRepeatMode((prev) =>
            prev === 'off' ? 'one' : prev === 'one' ? 'all' : 'off'
          );
        },
        shuffleMode,
        toggleShuffleMode: () => setShuffleMode((prev) => !prev),
        isExpanded,
        toggleExpand: () => setIsExpanded((prev) => !prev),
        closeFullScreenPlayer: () => setIsExpanded(false),
        playNextTrack: () => {
          setCurrentTrack((prevTrack) => {
            const currentIndex = queue.findIndex((track) => track.id === prevTrack?.id);
            const nextIndex = (currentIndex + 1) % queue.length;
            return queue[nextIndex] || null;
          });
        },
        playPreviousTrack: () => {
          setCurrentTrack((prevTrack) => {
            const currentIndex = queue.findIndex((track) => track.id === prevTrack?.id);
            const previousIndex = (currentIndex - 1 + queue.length) % queue.length;
            return queue[previousIndex] || null;
          });
        },
      }}
    >
      {children}
      {currentTrack?.audioURL && <audio ref={audioRef} src={currentTrack.audioURL} />}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used within PlayerProvider');
  return context;
};

function playNextTrack() {
  throw new Error('Function not implemented.');
}

