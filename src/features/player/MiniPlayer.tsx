'use client';

import Image from 'next/image';
import { usePlayerStore } from './store';
import { formatArtists } from '@/utils/formatArtists';
import { DEFAULT_COVER_URL } from '@/utils/helpers';
import { Play, Pause } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function MiniPlayer() {
  const {
    currentTrack,
    isPlaying,
    togglePlayPause,
    toggleExpand,
    currentTime,
    duration,
  } = usePlayerStore();

  // Show MiniPlayer only if currentTrack exists
  if (!currentTrack || !currentTrack.audioURL) {
    console.warn('MiniPlayer: No current track or missing audioURL.');
    return null;
  }

  // Calculate progress percentage
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <button
      type="button"
      className="animate-slideInUpMini fixed inset-x-0 z-50 flex h-20 items-center border-t border-border/70 bg-card/80 px-4 shadow-2xl backdrop-blur-lg transition-transform duration-300 ease-in-out md:bottom-4 md:px-6"
      style={{ bottom: 'calc(5rem + env(safe-area-inset-bottom))' }}
      aria-label="Mini Music Player"
      onClick={() => toggleExpand()}
    >
      {/* Expand FullScreenPlayer */}
      <div className="group flex min-w-0 flex-1 items-center gap-3 md:gap-4">
        {/* Cover Image */}
        <div
          className={`relative size-12 overflow-hidden rounded-md shadow-md transition-shadow group-hover:shadow-primary/30 md:size-14 ${
            isPlaying ? 'animate-pulse' : ''
          }`}
        >
          <Image
            src={currentTrack.coverURL || DEFAULT_COVER_URL}
            alt={currentTrack.title || 'Unknown Track'}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        {/* Track Info */}
        <div className="flex min-w-0 flex-col">
          <p className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary md:text-base">
            {currentTrack.title || 'Unknown Title'}
          </p>
          <p className="truncate text-xs text-muted-foreground md:text-sm">
            {formatArtists(currentTrack.artists)}
          </p>
        </div>
      </div>

      {/* Play/Pause Button */}
      <button
        className="ml-auto flex items-center justify-center rounded-full bg-primary p-2 text-white shadow-md hover:bg-primary/90"
        onClick={(e) => {
          e.stopPropagation();
          togglePlayPause();
        }}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-secondary/30">
        <Progress
          value={progress}
          className="h-full [&>div]:bg-gradient-to-r [&>div]:from-accent/70 [&>div]:to-primary/70"
        />
      </div>
    </button>
  );
}
