'use client';

import { usePlayerStore } from './store';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import Image from 'next/image';
import { DEFAULT_COVER_URL } from '@/utils/helpers';
import { formatArtists } from '@/utils/formatArtists';
import { X } from 'lucide-react';
import { Track } from '@/types/music';

interface QueueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QueueModal({ isOpen, onClose }: QueueModalProps) {
  const queue = usePlayerStore((state) => state.queue);
  const queueIndex = usePlayerStore((state) => state.queueIndex);
  const setTrack = usePlayerStore((state) => state.setTrack);
  const setQueue = usePlayerStore((state) => state.setQueue);

  const handleTrackClick = (track: Track, index: number) => {
    setTrack(track);
    usePlayerStore.setState({ queueIndex: index });
  };

  const handleRemoveTrack = (index: number) => {
    if (index === queueIndex) return; // Prevent removing the currently playing track
    const updatedQueue = queue.filter((_, i) => i !== index);
    setQueue(updatedQueue);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="max-h-[80vh] overflow-y-auto rounded-t-lg bg-card p-4 shadow-lg"
      >
        <SheetHeader>
          <SheetTitle className="text-lg font-bold">Up Next</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-2">
          {queue.map((track, index) => (
            <button
              key={track.id}
              className={`flex items-center gap-3 rounded-md p-2 text-left ${
                index === queueIndex ? 'bg-primary/10 font-semibold text-primary' : ''
              }`}
              onClick={() => handleTrackClick(track, index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleTrackClick(track, index);
                }
              }}
              aria-label={`Play ${track.title}`}
            >
              {/* Thumbnail */}
              <div className="relative size-12 overflow-hidden rounded-md shadow-md">
                <Image
                  src={track.coverURL || DEFAULT_COVER_URL}
                  alt={track.title || 'Unknown Track'}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Track Info */}
              <div className="flex min-w-0 flex-col">
                <p className="truncate text-sm font-semibold">{track.title || 'Untitled'}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {formatArtists(track.artists)}
                </p>
              </div>

              {/* Remove Button */}
              {index !== queueIndex && (
                <button
                  className="ml-auto text-muted-foreground hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the track click
                    handleRemoveTrack(index);
                  }}
                  aria-label={`Remove ${track.title} from queue`}
                >
                  <X size={16} />
                </button>
              )}
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
