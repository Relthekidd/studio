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
    <Sheet
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose(); // Only close the modal without affecting playback
        }
      }}
    >
      <SheetContent
        side="bottom"
        className="max-h-[80vh] overflow-y-auto rounded-t-lg bg-card p-4 shadow-lg"
        aria-describedby="queue-description"
      >
        <SheetHeader>
          <SheetTitle className="text-lg font-bold">Up Next</SheetTitle>
          <p id="queue-description" className="text-sm text-muted-foreground">
            View and manage the tracks in your playback queue.
          </p>
        </SheetHeader>
        <div className="flex flex-col gap-2">
          {queue.map((track, index) => (
            <div
              key={`${track.id}-${index}`} // Use a combination of track.id and index for a unique key
              className={`flex cursor-pointer items-center gap-3 rounded-md p-2 text-left ${
                index === queueIndex ? 'bg-primary/10 font-semibold text-primary' : ''
              }`}
              role="button"
              tabIndex={0}
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
                  style={{ objectFit: 'cover' }} // Ensure the image fills the container
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
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
