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
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { toast } from '@/hooks/use-toast';
import { savePlaylist } from '@/utils/saveLibraryData';

interface CreatePlaylistModalProps {
  onPlaylistCreated?: () => void;
}

export default function CreatePlaylistModal({ onPlaylistCreated }: CreatePlaylistModalProps) {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');

  const handleCreate = async () => {
    if (!title.trim() || !user?.uid) {
      toast({ title: 'Missing info', description: 'Please enter a title.' });
      return;
    }

    try {
      // Call savePlaylist utility to save the playlist in Firestore
      await savePlaylist({
        userId: user.uid, // Pass the current user's ID
        playlistData: {
          name: title,
          description,
          imageUrl: coverImage || '/placeholder.png', // Default cover image
          songs: [], // Initialize with an empty songs array
          createdAt: new Date().toISOString(),
          ownerId: ''
        },
      });

      toast({ title: 'Playlist created!' });
      setTitle('');
      setDescription('');
      setCoverImage('');
      setOpen(false);

      // Call the onPlaylistCreated callback
      if (onPlaylistCreated) {
        onPlaylistCreated();
      }
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
          <Input
            placeholder="Cover image URL (optional)"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
          />
          <Button onClick={handleCreate} className="w-full">
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
