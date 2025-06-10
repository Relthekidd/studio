'use client';

import { useEffect, useRef } from 'react';
import { usePlayerStore } from './store';
import { useAuth } from '@/contexts/AuthProvider';
import { recordStream } from '@/utils/streamTracker';

export function AudioProvider() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    currentTime,
    setCurrentTime,
    setDuration,
    setProgress,
    skipToNext,
  } = usePlayerStore();
  const { user } = useAuth();

  // Load new track
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    audio.src = currentTrack.audioURL;
    audio.load();
  }, [currentTrack]);

  // Play / pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch((err) => console.warn('Playback error:', err));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Seek to currentTime changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (Math.abs(audio.currentTime - currentTime) > 0.1) {
      audio.currentTime = currentTime;
    }
  }, [currentTime]);

  // Sync volume and mute
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
    audioRef.current.muted = isMuted;
  }, [volume, isMuted]);

  // Update progress and current time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      const current = audio.currentTime;
      const dur = audio.duration || 1;
      setCurrentTime(current);
      setDuration(dur);
      setProgress((current / dur) * 100);
    };

    audio.addEventListener('timeupdate', updateTime);
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
    };
  }, [setCurrentTime, setDuration, setProgress]);

  // Inject seek method into store
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    usePlayerStore.setState({
      seek: (time: number) => {
        audio.currentTime = time;
        const dur = audio.duration || 1;
        setCurrentTime(time);
        setProgress((time / dur) * 100);
      },
    });
  }, [setCurrentTime, setProgress]);

  const handleEnded = () => {
    if (currentTrack) {
      recordStream(user?.uid ?? null, { id: currentTrack.id, albumId: currentTrack.albumId });
    }
    skipToNext();
  };

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <audio ref={audioRef} onEnded={handleEnded} style={{ display: 'none' }} />
  );
}
