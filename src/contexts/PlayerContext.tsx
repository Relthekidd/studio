
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

export interface ArtistStub {
  id: string;
  name: string;
}

export interface Track {
  id: string;
  title: string;
  artist?: string; // Primary display artist string
  artists?: ArtistStub[]; // Array of artist objects for linking
  album?: string; // Album title display
  albumId?: string; // For linking to album page
  imageUrl: string;
  audioSrc?: string;
  dataAiHint?: string;
  duration?: number; // in seconds
  releaseDate?: string; // For album/single pages
  credits?: string; // For album/single pages
  trackNumber?: number; // For tracklists
  // For album type tracks
  tracklist?: Track[]; 
  type?: 'track' | 'playlist' | 'album' | 'artist' | 'user'; // To help AlbumCard differentiate
  description?: string; // For playlists or other item types
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
  playNextTrack: () => void; 
  playPreviousTrack: () => void; 
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.75); 
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [shuffleMode, setShuffleMode] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'one' | 'all'>('off');

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
        audioRef.current = new Audio();

        const audio = audioRef.current;

        const handleLoadedMetadata = () => setDuration(audio.duration || 0);
        const handleTimeUpdate = () => {
            const curTime = audio.currentTime || 0;
            const dur = audio.duration || 0;
            setCurrentTime(curTime);
            if (dur > 0) {
                setProgress((curTime / dur) * 100);
            } else {
                setProgress(0);
            }
        };
        const handleEnded = () => {
            if (audio && currentTrack?.audioSrc) {
              if (repeatMode === 'one') {
                audio.currentTime = 0;
                audio.play().catch(e => console.error("Error restarting track on repeat one:", e));
              } else if (repeatMode === 'all') {
                // playNextTrack(); // TODO: Implement this, potentially looping queue
                audio.currentTime = 0;
                audio.play().catch(e => console.error("Error restarting track on repeat all:", e));
              } else {
                setIsPlaying(false);
                // playNextTrack(); // TODO: Implement this
              }
            } else {
               setIsPlaying(false);
            }
        };
        const handleVolumeChange = () => {
            setVolume(audio.volume);
            setIsMuted(audio.muted);
        };
        const handleError = (e: Event) => {
            console.error("Audio Element Error:", e);
            const errorEvent = e as ErrorEvent;
            if (errorEvent.error) {
                console.error("Specific audio error:", errorEvent.error);
            }
            setIsPlaying(false);
        };

        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('volumechange', handleVolumeChange);
        audio.addEventListener('error', handleError);
    
        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('volumechange', handleVolumeChange);
            audio.removeEventListener('error', handleError);
            if (!audio.paused) audio.pause();
            audio.src = ""; 
        };
    }
  }, [repeatMode, currentTrack]); // Added currentTrack dependency

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume; // Reflect mute state in actual volume
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);


  const playTrack = useCallback((track: Track, playNext?: Track[], playPrevious?: Track[]) => {
    setCurrentTrack(track);
    if (track.audioSrc && audioRef.current) {
      audioRef.current.src = track.audioSrc;
      audioRef.current.load();
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
        }).catch(error => {
          console.error("Error playing track:", track.title, error);
          setIsPlaying(false);
        });
      }
    } else {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
      }
      setIsPlaying(true); // Simulate play
      setDuration(track.duration || 180);
      setProgress(0);
      setCurrentTime(0);
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (!currentTrack) return;

    if (isPlaying) {
      if (currentTrack.audioSrc && audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      if (currentTrack.audioSrc && audioRef.current) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                setIsPlaying(true);
            }).catch(error => {
                console.error("Error resuming playback:", error);
                setIsPlaying(false);
            });
        } else { // Should not happen with modern browsers if src is set
           setIsPlaying(false);
        }
      } else if (!currentTrack.audioSrc) {
        setIsPlaying(true); // Simulate play
      }
    }
  }, [currentTrack, isPlaying]);

  const seek = useCallback((time: number) => {
    const targetDuration = currentTrack?.duration || duration; // Use track-specific duration if available
    if (currentTrack?.audioSrc && audioRef.current && targetDuration > 0) {
      const newTime = Math.min(Math.max(0, time), targetDuration);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    } else if (!currentTrack?.audioSrc && targetDuration > 0) {
      const newTime = Math.min(Math.max(0, time), targetDuration);
      setCurrentTime(newTime);
      setProgress((newTime / targetDuration) * 100);
    }
  }, [currentTrack, duration]);


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
        const newMutedState = !prev;
        if(audioRef.current) {
            audioRef.current.muted = newMutedState;
        }
        // If unmuting and volume was 0, set to a default volume (e.g., previous non-zero or 0.5)
        if (!newMutedState && volume === 0) {
          setVolume(0.5); // Or restore a previousVolume state
          if(audioRef.current) audioRef.current.volume = 0.5;
        }
        return newMutedState;
    });
  }, [volume]);

  const toggleShuffle = useCallback(() => setShuffleMode(prev => !prev), []);
  const toggleRepeat = useCallback(() => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  const playNextTrack = useCallback(() => {
    console.log("Play next track (not implemented)");
  }, []);

  const playPreviousTrack = useCallback(() => {
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

    