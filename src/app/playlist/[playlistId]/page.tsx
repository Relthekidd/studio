'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useParams, useRouter } from 'next/navigation';
import { getAuth } from 'firebase/auth';
import {
  getDoc,
  getDocs,
  collection,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { usePlayer } from '@/contexts/PlayerContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import AlbumCard from '@/components/AlbumCard';
import SectionTitle from '@/components/SectionTitle';
import type { Track } from '@/contexts/PlayerContext';
import { PlayCircle, MoreVertical, ArrowLeft } from 'lucide-react';
import EditPlaylistModal from '@/components/EditPlaylistModal';

export default function PlaylistDetailPage() {
  const { playlistId } = useParams();
  const { toast } = useToast();
  const router = useRouter();
  const { setQueue, playTrack } = usePlayer();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [playlistName, setPlaylistName] = useState('My Playlist');

  useEffect(() => {
    const fetchData = async () => {
      const user = getAuth().currentUser;
      if (!user || !playlistId) return;

      const playlistRef = doc(db, 'users', user.uid, 'playlists', playlistId as string);
      const playlistDoc = await getDoc(playlistRef);

      if (playlistDoc.exists()) {
        setPlaylistName(playlistDoc.data().title || 'Untitled Playlist');
      }

      const trackSnap = await getDocs(
        collection(db, 'users', user.uid, 'playlists', playlistId as string, 'tracks')
      );

      const fetchedTracks = trackSnap.docs.map((docSnap) => docSnap.data() as Track);
      setTracks(fetchedTracks);
    };

    fetchData();
  }, [playlistId]);

  const handlePlayAll = () => {
    if (tracks.length === 0) return;
    setQueue(tracks);
    playTrack(tracks[0]);
    toast({ title: 'Now Playing', description: `Playlist: ${playlistName}` });
  };

  const handleDelete = async () => {
    const user = getAuth().currentUser;
    if (!user || !playlistId) return;

    try {
      await deleteDoc(doc(db, 'users', user.uid, 'playlists', playlistId as string));
      toast({ title: 'Playlist deleted' });
      router.push('/library');
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to delete playlist' });
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} size="icon">
            <ArrowLeft />
          </Button>
          <SectionTitle className="mb-0">{playlistName}</SectionTitle>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={handlePlayAll} className="flex gap-2">
            <PlayCircle size={20} />
            Play All
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <EditPlaylistModal playlistId={playlistId as string} currentTitle={playlistName} />

              <DropdownMenuItem onClick={handleDelete}>Delete Playlist</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {tracks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {tracks.map((track) => (
            <AlbumCard key={track.id} item={{ ...track, type: 'track' }} />
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground text-center py-12">
          No tracks in this playlist yet.
        </div>
      )}
    </div>
  );
}
