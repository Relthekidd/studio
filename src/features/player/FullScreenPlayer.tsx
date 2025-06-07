'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { DEFAULT_COVER_URL } from '@/utils/helpers';
import { usePlayerStore } from './store';
import { formatArtists } from '@/utils/formatArtists';
import { formatTime } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ChevronDown, ListMusic, Shuffle, Repeat, Repeat1, VolumeX, Volume2, Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import QueueModal from './QueueModal';

export default function FullScreenPlayer() {
  const [showQueue, setShowQueue] = useState(false);
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
    skipToNext,
    skipToPrev,
  } = usePlayerStore();

  if (!currentTrack || !currentTrack.audioURL) {
    console.warn('FullScreenPlayer: No current track or missing audioURL.');
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-background via-card to-background/90 p-4 backdrop-blur-2xl md:p-6">
        <p className="text-center text-muted-foreground">No track is currently playing.</p>
      </div>
    );
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

  return (
    <div className="animate-slideInUp fixed inset-0 z-[100] flex flex-col items-center justify-between overflow-y-auto bg-gradient-to-br from-background via-card to-background/90 p-4 pb-32 backdrop-blur-2xl md:p-6">
      {/* Background Cover */}
      {currentTrack.coverURL && (
        <Image
          src={currentTrack.coverURL}
          alt={`${currentTrack.title} background`}
          fill
          className="z-[-1] scale-110 object-cover opacity-10 blur-2xl"
          unoptimized
        />
      )}

      {/* Top Controls */}
      <div className="flex w-full items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="z-[110] text-muted-foreground transition-colors hover:text-accent"
          onClick={toggleExpand}
          aria-label="Close full screen player"
        >
          <ChevronDown size={28} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="z-[110] text-muted-foreground transition-colors hover:text-accent"
          onClick={() => setShowQueue(true)}
          aria-label="View Queue"
        >
          <ListMusic size={22} />
        </Button>
      </div>

      {/* Album Art & Track Info */}
      <div className="my-auto flex flex-col items-center gap-4 md:gap-6">
        <div className="group relative size-60 overflow-hidden rounded-xl shadow-2xl shadow-primary/30 sm:size-72 md:size-80">
          <Image
            src={currentTrack.coverURL || DEFAULT_COVER_URL}
            alt={currentTrack.title || 'Unknown Track'}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-black/0"></div>
        </div>
        <div className="text-center">
          <h2 className="text-lg font-bold">{currentTrack.title}</h2>
          <p className="text-sm text-muted-foreground">{formatArtists(currentTrack.artists)}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4 w-full max-w-xl space-y-2 px-2 md:px-4">
        <Slider
          value={[progress]}
          max={100}
          step={0.1}
          onValueChange={handleSeek}
          className="h-2 [&>span:first-child>span]:bg-gradient-to-r [&>span:first-child>span]:from-accent [&>span:first-child>span]:to-primary [&>span:first-child]:h-2 [&>span:last-child]:size-4"
          aria-label="Seek bar"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Player Controls */}
      <div className="flex w-full max-w-xl items-center justify-between px-2 md:px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={skipToPrev}
          aria-label="Previous Track"
          className="text-muted-foreground hover:text-primary"
        >
          <SkipBack size={20} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={togglePlayPause}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          className="text-muted-foreground hover:text-primary"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={skipToNext}
          aria-label="Next Track"
          className="text-muted-foreground hover:text-primary"
        >
          <SkipForward size={20} />
        </Button>
      </div>

      {/* Volume + Repeat */}
      <div className="mb-4 flex w-full max-w-xl items-center justify-between px-2 md:px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleShuffle}
          aria-label="Shuffle"
          className="text-muted-foreground hover:text-primary"
        >
          <Shuffle size={20} className={shuffleMode ? 'text-primary' : ''} />
        </Button>

        <div className="flex w-1/3 max-w-[150px] items-center gap-2">
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
            className="h-1.5 [&>span:first-child>span]:bg-primary [&>span:first-child]:h-1.5 [&>span:last-child]:size-3 [&>span:last-child]:border-primary/70"
            aria-label="Volume control"
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleRepeat}
          aria-label="Repeat"
          className="text-muted-foreground hover:text-primary"
        >
          {getRepeatIcon()}
        </Button>
      </div>

      <QueueModal isOpen={showQueue} onClose={() => setShowQueue(false)} />
    </div>
  );
}
