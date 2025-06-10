'use client';

import { PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TrackActions from './TrackActions';
import { usePlayerStore } from '@/features/player/store';
import type { Track } from '@/types/music';
import { formatArtists } from '@/utils/formatArtists';
import { DEFAULT_COVER_URL } from '@/utils/helpers';

export type TrackListItemProps = {
  track: Track;
  onPlay: (track: Track) => void;
  coverURL?: string;
};

export default function TrackListItem({ track, onPlay, coverURL }: TrackListItemProps) {
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const togglePlayPause = usePlayerStore((s) => s.togglePlayPause);
  const isCurrent = currentTrack?.id === track.id;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlayPause();
    } else {
      onPlay(track);
    }
  };

  return (
    <div
      className="group flex cursor-pointer items-center justify-between rounded px-2 py-1 transition hover:bg-muted"
      role="button"
      tabIndex={0}
      onClick={() => onPlay(track)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onPlay(track);
        }
      }}
      aria-label={`Play ${track.title}`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePlayClick}
          aria-label={`Play ${track.title}`}
        >
          {isCurrent && isPlaying ? (
            <PlayCircle size={20} className="text-primary" />
          ) : (
            <PlayCircle size={20} />
          )}
        </Button>
        <div className="min-w-0">
          <div className="truncate font-medium">{track.title}</div>
          <div className="truncate text-xs text-muted-foreground">
            {formatArtists(track.artists)}
          </div>
        </div>
      </div>
      <TrackActions
        track={{
          ...track,
          artists: track.artists,
          coverURL: track.album?.coverURL || coverURL || DEFAULT_COVER_URL,
        }}
      />
    </div>
  );
}
