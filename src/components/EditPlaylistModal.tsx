'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useUser } from '@/hooks/useUser';
import { toast } from '@/hooks/use-toast';

export default function EditPlaylistModal({
  playlistId,
  currentTitle,
}: {
  playlistId: string;
  currentTitle: string;
}) {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(currentTitle);

  const handleUpdate = async () => {
    if (!title.trim() || !user?.uid) {
      toast({ title: 'Missing info', description: 'Title cannot be empty.' });
      return;
    }

    try {
      const playlistRef = doc(db, 'users', user.uid, 'playlists', playlistId);
      await updateDoc(playlistRef, { title });
      toast({ title: 'Playlist renamed!' });
      setOpen(false);
      location.reload(); // optional: or update state from parent
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Could not rename playlist.' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full text-left">
          Edit Playlist
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Playlist</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New playlist title"
          />
          <Button onClick={handleUpdate} className="w-full">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
