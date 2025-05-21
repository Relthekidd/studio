
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
            if (audioRef.current && currentTrack?.audioSrc) { // Only handle for tracks with audio
              if (repeatMode === 'one') {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(e => console.error("Error restarting track on repeat one:", e));
              } else if (repeatMode === 'all') {
                // playNextTrack(); // TODO: Implement this, potentially looping queue
                // For now, just replay or stop
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(e => console.error("Error restarting track on repeat all:", e));
              } else {
                setIsPlaying(false);
                // playNextTrack(); // TODO: Implement this
              }
            } else {
               setIsPlaying(false); // For simulated tracks or if no audioSrc
            }
        });
        audioRef.current.addEventListener('volumechange', () => {
            if(audioRef.current) {
                setVolume(audioRef.current.volume);
                setIsMuted(audioRef.current.muted);
            }
        });
        // Error handling for the audio element itself
        audioRef.current.addEventListener('error', (e) => {
            console.error("Audio Element Error:", e);
            setIsPlaying(false);
            // Potentially set currentTrack to null or show an error to the user
        });
    }
    return () => {
        if (audioRef.current) {
            audioRef.current.removeEventListener('loadedmetadata', () => {});
            audioRef.current.removeEventListener('timeupdate', () => {});
            audioRef.current.removeEventListener('ended', () => {});
            audioRef.current.removeEventListener('volumechange', () => {});
            audioRef.current.removeEventListener('error', () => {});
            audioRef.current.pause();
            audioRef.current.src = ""; // Release resources
        }
    };
  }, [repeatMode, currentTrack]); // Added currentTrack dependency to re-evaluate ended logic for new tracks

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);


  const playTrack = useCallback((track: Track, playNext?: Track[], playPrevious?: Track[]) => {
    setCurrentTrack(track);
    if (track.audioSrc && audioRef.current) {
      audioRef.current.src = track.audioSrc;
      audioRef.current.load(); // Good practice to call load() before play() when changing src
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
        }).catch(error => {
          console.error("Error playing track:", track.title, error);
          setIsPlaying(false);
          // Potentially inform the user that playback failed for this track
        });
      }
    } else if (!track.audioSrc) {
      // Simulate playback for tracks without an audio source
      // If there was a previously playing track with audio, pause it.
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
      }
      setIsPlaying(true);
      setDuration(track.duration || 180); // Use provided duration or default (e.g., 3 minutes)
      setProgress(0);
      setCurrentTime(0);
    }
     // TODO: Set queue and history: setQueue(playNext || []); setHistory(playPrevious || []);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (!currentTrack) return;

    if (isPlaying) {
      // Currently playing, so pause it
      if (currentTrack.audioSrc && audioRef.current) {
        audioRef.current.pause();
      }
      // For simulated tracks or actual audio, UI should reflect paused state
      setIsPlaying(false);
    } else {
      // Currently paused, so play it
      if (currentTrack.audioSrc && audioRef.current) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                setIsPlaying(true);
            }).catch(error => {
                console.error("Error resuming playback:", error);
                setIsPlaying(false); // Set to false if play fails
            });
        }
      } else if (!currentTrack.audioSrc) {
        // If no audioSrc, simulate play for UI purposes
        setIsPlaying(true);
      }
    }
  }, [currentTrack, isPlaying]);

  const seek = useCallback((time: number) => {
    if (currentTrack?.audioSrc && audioRef.current && duration > 0) { // Only seek if there's an audio source
      const newTime = Math.min(Math.max(0, time), duration);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime); // Keep UI in sync
    } else if (!currentTrack?.audioSrc && duration > 0) {
      // For simulated tracks, update simulated progress
      const newTime = Math.min(Math.max(0, time), duration);
      setCurrentTime(newTime);
      setProgress((newTime / duration) * 100);
    }
  }, [currentTrack, duration]);


  const handleSetVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.min(Math.max(0, newVolume), 1);
    setVolume(clampedVolume); // Update React state
    if (audioRef.current) {
        audioRef.current.volume = clampedVolume; // Update HTMLAudioElement
        if (clampedVolume > 0 && isMuted) { // If volume is turned up while muted, unmute
            setIsMuted(false);
            audioRef.current.muted = false;
        }
    }
  }, [isMuted]); // isMuted dependency for unmuting logic

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
        const newMutedState = !prev;
        if(audioRef.current) audioRef.current.muted = newMutedState;
        return newMutedState;
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
    if (currentTrack) { // Only allow expanding if there's a track
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

