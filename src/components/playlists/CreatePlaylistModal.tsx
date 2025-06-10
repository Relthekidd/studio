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
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { PlusCircle } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { toast } from '@/hooks/use-toast';
import { savePlaylist } from '@/utils/saveLibraryData';
import { generateCoverFromTitle } from '@/utils/helpers';

interface CreatePlaylistModalProps {
  onPlaylistCreated?: () => void;
}

export default function CreatePlaylistModal({ onPlaylistCreated }: CreatePlaylistModalProps) {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const handleCreate = async () => {
    if (!title.trim() || !user?.uid) {
      toast({ title: 'Missing info', description: 'Please enter a title.' });
      return;
    }

    try {
      let imageUrl = generateCoverFromTitle(title);
      if (coverFile) {
        const coverRef = ref(storage, `playlistCovers/${Date.now()}-${coverFile.name}`);
        await uploadBytesResumable(coverRef, coverFile);
        imageUrl = await getDownloadURL(coverRef);
      }

      await savePlaylist({
        userId: user.uid, // Pass the current user's ID
        playlistData: {
          title,
          description,
          imageUrl,
          songs: [], // Initialize with an empty songs array
          createdAt: new Date().toISOString(),
          ownerId: '',
        },
      });

      toast({ title: 'Playlist created!' });
      setTitle('');
      setDescription('');
      setCoverFile(null);
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
          <div className="space-y-2">
            <Label htmlFor="playlist-title">Playlist Title</Label>
            <Input
              id="playlist-title"
              placeholder="Playlist name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="playlist-description">Description</Label>
            <Textarea
              id="playlist-description"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="playlist-cover">Cover Image</Label>
            <Input
              id="playlist-cover"
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
            />
          </div>
          <Button onClick={handleCreate} className="w-full">
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
