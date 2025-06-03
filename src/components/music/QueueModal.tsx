'use client';

import { usePlayerStore } from '@/features/player/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatArtists } from '@/utils/formatArtists';

interface QueueModalProps {
  open: boolean;
  onClose: () => void;
}

export default function QueueModal({ open, onClose }: QueueModalProps) {
  const queue = usePlayerStore((s) => s.queue);
  const queueIndex = usePlayerStore((s) => s.queueIndex);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">Playback Queue</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {queue.map((track, index) => (
            <div
              key={track.id}
              className={`rounded-md px-2 py-1 flex items-center gap-2 ${
                index === queueIndex ? 'font-semibold text-primary bg-primary/10' : ''
              }`}
            >
              <span className="truncate text-sm">{track.title}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {formatArtists(track.artists)}
              </span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
