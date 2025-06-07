'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { usePlayerStore } from './store';
import { formatArtists } from '@/utils/formatArtists';
import { formatTime } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import QueueModal from './QueueModal';
import {
  ChevronDown,
  Shuffle,
  Repeat,
  Repeat1,
  VolumeX,
  Volume2,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  ListMusic,
} from 'lucide-react';

// Import or define the Track type

export default function FullScreenPlayer() {
  const [showQueue, setShowQueue] = useState(false); // State to toggle queue modal
  const {
    currentTrack,
    isPlaying,
    togglePlayPause,
    toggleExpand,
    currentTime,
    duration,
    seek,
    volume,
    setVolume,
    isMuted,
    setMuted,
    shuffleMode,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
    queue,
    queueIndex,
    setCurrentTrack,
  } = usePlayerStore();

  if (!currentTrack || !currentTrack.audioURL) {
    console.warn('FullScreenPlayer: No current track or missing audioURL.');
    return null;
  }

  const handleSeek = (value: number[]) => {
    const targetTime = (value[0] / 100) * duration;
    seek(targetTime);
  };

  const toggleMute = () => {
    setMuted(!isMuted);
  };

  const getRepeatIcon = () => {
    if (repeatMode === 'one') return <Repeat1 size={20} className="text-primary" />;
    if (repeatMode === 'all') return <Repeat size={20} className="text-primary" />;
    return <Repeat size={20} />;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSkipToNext = () => {
    if (queueIndex < queue.length - 1) {
      setCurrentTrack(queue[queueIndex + 1]);
      usePlayerStore.setState({ queueIndex: queueIndex + 1 });
    } else {
      console.warn('No next track in the queue.');
    }
  };

  const handleSkipToPrev = () => {
    if (queueIndex > 0) {
      setCurrentTrack(queue[queueIndex - 1]);
      usePlayerStore.setState({ queueIndex: queueIndex - 1 });
    } else {
      console.warn('No previous track in the queue.');
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center bg-card p-4 shadow-lg md:mx-auto md:max-w-3xl md:rounded-t-lg">
      {/* Top Controls */}
      <div className="mb-4 flex w-full items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleExpand}
          aria-label="Close full screen player"
        >
          <ChevronDown size={24} />
        </Button>
        <h2 className="text-sm font-semibold text-muted-foreground">Now Playing</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowQueue(true)} // Open queue modal
          aria-label="View Queue"
        >
          <ListMusic size={20} />
        </Button>
      </div>

      {/* Album Art & Track Info */}
      <div className="flex w-full items-center gap-4">
        <div className="relative size-20 overflow-hidden rounded-md shadow-md">
          <Image
            src={currentTrack.coverURL || '/placeholder.png'}
            alt={currentTrack.title || 'Unknown Track'}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-foreground">{currentTrack.title}</h3>
          <p className="text-sm text-muted-foreground">{formatArtists(currentTrack.artists)}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 w-full">
        <Slider
          value={[progress]}
          max={100}
          step={0.1}
          onValueChange={handleSeek}
          className="h-2 [&>span:first-child>span]:bg-primary [&>span:first-child]:h-2 [&>span:last-child]:size-4"
          aria-label="Seek bar"
        />
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="mt-4 flex w-full items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleShuffle}
          aria-label="Shuffle"
          className={shuffleMode ? 'text-primary' : 'text-muted-foreground'}
        >
          <Shuffle size={20} />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleSkipToPrev} aria-label="Previous Track">
          <SkipBack size={24} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={togglePlayPause}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={32} /> : <Play size={32} />}
        </Button>
        <Button variant="ghost" size="icon" onClick={handleSkipToNext} aria-label="Next Track">
          <SkipForward size={24} />
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleRepeat} aria-label="Repeat">
          {getRepeatIcon()}
        </Button>
      </div>

      {/* Volume Control */}
      <div className="mt-4 flex w-full items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </Button>
        <Slider
          value={[volume * 100]}
          max={100}
          step={1}
          onValueChange={(value) => setVolume(value[0] / 100)}
          className="h-1.5 [&>span:first-child>span]:bg-primary [&>span:first-child]:h-1.5 [&>span:last-child]:size-3"
          aria-label="Volume control"
        />
      </div>

      {/* Queue Modal */}
      {showQueue && <QueueModal isOpen={showQueue} onClose={() => setShowQueue(false)} />}
    </div>
  );
}
