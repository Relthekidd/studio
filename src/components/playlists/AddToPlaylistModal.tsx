'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { useUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import {
  collection,
  addDoc,
  getDocs,
  doc
} from 'firebase/firestore';
import type { Track } from '@/contexts/PlayerContext';

interface Props {
  trigger: React.ReactNode;
  track: Track;
}

export default function AddToPlaylistModal({ trigger, track }: Props) {
  const { user } = useUser();
  const [playlists, setPlaylists] = useState<any[]>([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!user?.uid) return;
      const snap = await getDocs(collection(db, 'users', user.uid, 'playlists'));
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPlaylists(list);
    };
    fetchPlaylists();
  }, [user]);

  const addToPlaylist = async (playlistId: string) => {
    if (!user?.uid) return;
    try {
      await addDoc(collection(db, 'users', user.uid, 'playlists', playlistId, 'tracks'), track);
      toast({ title: 'Added to Playlist' });
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to add to playlist.' });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Playlist</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {playlists.length > 0 ? (
            playlists.map(pl => (
              <Button key={pl.id} variant="outline" className="w-full justify-start" onClick={() => addToPlaylist(pl.id)}>
                {pl.title}
              </Button>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No playlists available.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
