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
import { getAuth } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface Props {
  track: Track;
}

export default function TrackActions({ track }: Props) {
  const addToQueue = usePlayerStore((s) => s.addToQueue);
  const router = useRouter();
  const { toast } = useToast();

  const handleFavorite = () => {
    // TODO: implement favorite functionality
  };

  const handleAddToQueue = () => {
    addToQueue(track);
  };

  const handleAddToLibrary = async () => {
    const user = getAuth().currentUser;
    if (!user) return;
    await setDoc(doc(db, 'profiles', user.uid, 'likedSongs', track.id), {
      id: track.id,
      addedAt: serverTimestamp(),
    });
    toast({ title: 'Saved to library' });
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
        <DropdownMenuItem onClick={handleAddToLibrary}>
          <Heart className="mr-2 size-4" />
          Add to Library
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
