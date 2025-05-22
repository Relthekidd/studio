'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useUser } from '@/hooks/useUser';
import { toast } from '@/hooks/use-toast';

export default function CreatePlaylistModal() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = async () => {
    if (!title.trim() || !user?.uid) {
      toast({ title: 'Missing info', description: 'Please enter a title.' });
      return;
    }

    try {
      await addDoc(collection(db, 'users', user.uid, 'playlists'), {
        title,
        description,
        createdAt: serverTimestamp(),
      });
      toast({ title: 'Playlist created!' });
      setTitle('');
      setDescription('');
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Could not create playlist.' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <PlusCircle size={16} />
          New Playlist
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Playlist</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Playlist name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button onClick={handleCreate} className="w-full">
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
