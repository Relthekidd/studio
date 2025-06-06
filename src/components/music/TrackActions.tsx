'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Heart, Plus, ListPlus, User, Disc } from 'lucide-react';
import { usePlayerStore } from '@/features/player/store';
import { useRouter } from 'next/navigation';
import type { Track } from '@/types/music';
import AddToPlaylistModal from '@/components/playlists/AddToPlaylistModal';

interface Props {
  track: Track;
}

export default function TrackActions({ track }: Props) {
  const queue = usePlayerStore((s) => s.queue);
  const setQueue = usePlayerStore((s) => s.setQueue);
  const router = useRouter();

  const handleFavorite = () => {
    // TODO: implement favorite functionality
  };

  
  const handleAddToQueue = () => {
    // Add the track to the queue
    setQueue([...queue, track]);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full p-2 transition hover:bg-muted/70">
          <MoreHorizontal className="size-5 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleFavorite}>
          <Heart className="mr-2 size-4" />
          Favorite
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => console.log('Add to playlist', track.id)}>
          <ListPlus className="mr-2 size-4" />
          Add to Playlist
        </DropdownMenuItem>
        <AddToPlaylistModal
          track={track}
          trigger={
            <button className="flex w-full items-center px-2 py-1.5 text-sm transition hover:bg-muted/70">
              <ListPlus className="mr-2 size-4" />
              Add to Playlist
            </button>
          }
        />
        <DropdownMenuItem onClick={handleAddToQueue}>
          <Plus className="mr-2 size-4" />
          Add to Queue
        </DropdownMenuItem>
        {track.artists && typeof track.artists === 'string' && (
          <DropdownMenuItem onClick={() => router.push(`/artist/${track.artists}`)}>
            <User className="mr-2 size-4" />
            Go to Artist
          </DropdownMenuItem>
        )}
        {track.albumId && (
          <DropdownMenuItem onClick={() => router.push(`/album/${track.albumId}`)}>
            <Disc className="mr-2 size-4" />
            Go to Album
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
