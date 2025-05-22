'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  Heart,
  Plus,
  ListPlus,
  User,
  Disc,
} from 'lucide-react';
import { usePlayer } from '@/contexts/PlayerContext';
import { useRouter } from 'next/navigation';
import type { Track } from '@/contexts/PlayerContext';
import AddToPlaylistModal from '@/components/playlists/AddToPlaylistModal';


interface Props {
  track: Track;
}

export default function TrackActions({ track }: Props) {
  const { setQueue } = usePlayer(); // Fallback since addToQueue isn't defined
  const router = useRouter();

  const handleAddToQueue = () => {
    setQueue([...usePlayer().queue, track]);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 rounded-full hover:bg-muted/70 transition">
          <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => console.log('Favorite', track.id)}>
          <Heart className="mr-2 h-4 w-4" />
          Favorite
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => console.log('Add to playlist', track.id)}>
          <ListPlus className="mr-2 h-4 w-4" />
          Add to Playlist
        </DropdownMenuItem>
        <AddToPlaylistModal
          track={track}
          trigger={
            <button className="w-full flex items-center px-2 py-1.5 text-sm hover:bg-muted/70 transition">
              <ListPlus className="mr-2 h-4 w-4" />
              Add to Playlist
            </button>
          }
        />
        <DropdownMenuItem onClick={handleAddToQueue}>
          <Plus className="mr-2 h-4 w-4" />
          Add to Queue
        </DropdownMenuItem>
        {track.artist && typeof track.artist === 'string' && (
          <DropdownMenuItem onClick={() => router.push(`/artist/${track.artist}`)}>
            <User className="mr-2 h-4 w-4" />
            Go to Artist
          </DropdownMenuItem>
        )}
        {track.albumId && (
          <DropdownMenuItem onClick={() => router.push(`/album/${track.albumId}`)}>
            <Disc className="mr-2 h-4 w-4" />
            Go to Album
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
