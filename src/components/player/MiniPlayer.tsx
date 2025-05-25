'use client';

import Image from 'next/image';
import { usePlayer } from '@/contexts/PlayerContext';
import PlayerControls from './PlayerControls';
import { Progress } from '@/components/ui/progress';
import { formatArtists } from '@/utils/formatArtists';

export default function MiniPlayer() {
  const { currentTrack, isPlaying, isExpanded, toggleExpand, progress } = usePlayer();

  // Handle cases where currentTrack or audioURL is missing
  if (!currentTrack || !currentTrack.audioURL) {
    console.warn('MiniPlayer: No current track or missing audioURL.');
    return null;
  }

  // Hide MiniPlayer if FullScreenPlayer is expanded
  if (isExpanded) return null;

  return (
    <div
      className="animate-slideInUpMini fixed inset-x-0 bottom-16 z-50 flex h-20 items-center border-t border-border/70 bg-card/80 px-4 shadow-2xl backdrop-blur-lg transition-transform duration-300 ease-in-out md:bottom-0 md:px-6"
      role="complementary"
      aria-label="Music Player"
    >
      <div
        className="group flex min-w-0 flex-1 cursor-pointer items-center gap-3 md:gap-4"
        onClick={() => toggleExpand()}
      >
        <div className="relative size-12 overflow-hidden rounded-md shadow-md transition-shadow group-hover:shadow-primary/30 md:size-14">
          <Image
            src={currentTrack.coverURL || '/placeholder.png'}
            alt={currentTrack.title || 'Unknown Track'}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="flex min-w-0 flex-col">
          <p className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary md:text-base">
            {currentTrack.title || 'Unknown Title'}
          </p>
          <p className="truncate text-xs text-muted-foreground md:text-sm">
            {formatArtists(currentTrack.artist)}
          </p>
        </div>
      </div>

      <div className="mx-4 hidden w-1/3 flex-col items-center md:flex">
        <PlayerControls variant="mini" />
        <Progress
          value={progress}
          className="mt-1 h-1 w-full bg-secondary/30 [&>div]:bg-gradient-to-r [&>div]:from-accent/70 [&>div]:to-primary/70"
        />
      </div>

      <div className="ml-auto md:hidden">
        <PlayerControls variant="mini" />
      </div>
    </div>
  );
}
