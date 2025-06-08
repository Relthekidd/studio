'use client';

import Image from 'next/image';
import { usePlayerStore } from './store';
import { DEFAULT_COVER_URL } from '@/utils/helpers';
import { Play, Pause } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { formatArtists } from '@/utils/formatArtists';

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

  // Debug log for cover URL
  console.log('Cover URL:', currentTrack.coverURL);

  // Calculate progress percentage
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
          fill // Use `fill` for the image
          style={{ objectFit: 'cover' }} // Replace `objectFit` with inline style
          priority // Add priority for LCP optimization
          unoptimized
        />
      </div>

      {/* Track Info */}
      <div className="flex-1 truncate">
        <p className="truncate text-left text-sm font-semibold text-foreground md:text-base">
          {currentTrack.title || 'Unknown Title'}
        </p>
        <p className="truncate text-left text-xs text-muted-foreground md:text-sm">
          {formatArtists(currentTrack.artists)}
        </p>
      </div>

      {/* Play/Pause */}
      <button
        className="ml-3 flex items-center justify-center rounded-full bg-primary p-2 text-white shadow-md hover:bg-primary/90"
        onClick={(e) => {
          e.stopPropagation();
          togglePlayPause();
        }}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
      </button>

      {/* Progress Bar */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-secondary/30">
        <Progress
          value={progress}
          className="h-full [&>div]:bg-gradient-to-r [&>div]:from-accent/70 [&>div]:to-primary/70"
        />
      </div>
    </div>
  );
}
