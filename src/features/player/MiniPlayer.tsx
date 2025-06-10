'use client';

import Image from 'next/image';
import { usePlayerStore } from './store';
import { DEFAULT_COVER_URL } from '@/utils/helpers';
import { Play, Pause } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { formatArtists } from '@/utils/formatArtists';

export default function MiniPlayer() {
  const { currentTrack, isPlaying, togglePlayPause, toggleExpand, currentTime, duration } =
    usePlayerStore();

  if (!currentTrack || !currentTrack.audioURL) {
    console.warn('MiniPlayer: No current track or missing audioURL.');
    return null;
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className="animate-slideInUpMini fixed inset-x-0 z-50 flex h-20 items-center border-t border-border/70 bg-card/80 px-4 shadow-2xl backdrop-blur-lg transition-transform duration-300 ease-in-out md:bottom-4 md:px-6"
      style={{ bottom: `calc(4rem + env(safe-area-inset-bottom))` }}
      role="button"
      tabIndex={0}
      aria-label="Mini Music Player"
      onClick={() => toggleExpand()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          toggleExpand();
        }
      }}
    >
      {/* Cover Image */}
      <div
        className={`relative mr-3 size-12 overflow-hidden rounded-md shadow-md transition-shadow group-hover:shadow-primary/30 md:mr-4 md:size-14 ${isPlaying ? 'animate-pulse' : ''}`}
      >
        <Image
          src={currentTrack.coverURL || DEFAULT_COVER_URL}
          alt={currentTrack.title || 'Unknown Track'}
          fill
          style={{ objectFit: 'cover' }}
          priority
          unoptimized
        />
      </div>

      {/* Track Info */}
      <div className="flex-1 truncate">
        <p className="truncate text-left text-base font-semibold text-foreground md:text-lg">
          {currentTrack.title || 'Unknown Title'}
        </p>
        <p className="truncate text-left text-sm text-muted-foreground md:text-base">
          {formatArtists(currentTrack.artists)}
        </p>
      </div>

      {/* Play/Pause */}
      <button
        className="ml-4 flex items-center justify-center rounded-full bg-primary p-3 text-white shadow-lg hover:bg-primary/90"
        onClick={(e) => {
          e.stopPropagation();
          togglePlayPause();
        }}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause size={28} /> : <Play size={28} />}
      </button>

      {/* Progress Bar */}
      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-secondary/30">
        <Progress
          value={progress}
          className="h-full [&>div]:bg-gradient-to-r [&>div]:from-accent/70 [&>div]:to-primary/70"
        />
      </div>
    </div>
  );
}
