'use client';

import { useEffect, useRef } from 'react';
import { usePlayerStore } from './store';

export function AudioProvider() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    setCurrentTime,
    setDuration,
    setProgress,
    skipToNext,
  } = usePlayerStore();

  // Handle track change or play/pause toggle
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    audio.src = currentTrack.audioURL;
    audio.load();

    if (isPlaying) {
      audio.play().catch((err) => console.warn('Playback error:', err));
    } else {
      audio.pause();
    }
  }, [currentTrack, isPlaying]);

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

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <audio ref={audioRef} onEnded={skipToNext} style={{ display: 'none' }} />
  );
}
