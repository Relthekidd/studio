'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, serverTimestamp, doc, setDoc } from 'firebase/firestore';

import { db, storage } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthProvider';
import { useToast } from '@/hooks/use-toast';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminUploadPage() {
  const router = useRouter();
  const { user, isAdmin, loading } = useAuth();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [type, setType] = useState<'single' | 'album'>('single');

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      toast({ title: 'Access Denied', description: 'Admin access only.' });
      router.replace('/');
    }
  }, [user, loading]);

  const handleUpload = async () => {
    if (!title || !artist || !audioFile || !coverFile) {
      toast({ title: 'Missing Fields', description: 'Please fill all fields.' });
      return;
    }

    setUploading(true);
    try {
      const coverRef = ref(storage, `covers/${Date.now()}-${coverFile.name}`);
      const audioRef = ref(storage, `audio/${Date.now()}-${audioFile.name}`);

      await uploadBytesResumable(coverRef, coverFile);
      await uploadBytesResumable(audioRef, audioFile);

      const coverURL = await getDownloadURL(coverRef);
      const audioURL = await getDownloadURL(audioRef);

      // Calculate audio duration
      const audioElement = new Audio(audioURL);
      const duration = await new Promise<number>((resolve) => {
        audioElement.addEventListener('loadedmetadata', () => {
          resolve(audioElement.duration);
        });
      });

      // Generate custom ID for track
      const newDocRef = doc(collection(db, type === 'album' ? 'albums' : 'songs'));

      await setDoc(newDocRef, {
        id: newDocRef.id,
        title,
        artist,
        genre,
        audioURL,
        coverURL,
        duration,
        type,
        createdAt: serverTimestamp(),
      });

      toast({ title: 'Upload successful!' });
      setTitle('');
      setArtist('');
      setGenre('');
      setCoverFile(null);
      setAudioFile(null);
    } catch (err) {
      console.error(err);
      toast({ title: 'Upload failed', description: 'Check console for details.' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container max-w-xl py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Upload New Track</h1>
        <Link href="/profile" className="text-sm text-muted-foreground hover:underline flex items-center gap-1">
          <ArrowLeft size={16} /> Back
        </Link>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Type</Label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'single' | 'album')}
            className="border px-3 py-2 rounded w-full"
          >
            <option value="single">Single</option>
            <option value="album">Album</option>
          </select>
        </div>

        <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input placeholder="Artist" value={artist} onChange={(e) => setArtist(e.target.value)} />
        <Input placeholder="Genre" value={genre} onChange={(e) => setGenre(e.target.value)} />

        <div className="space-y-2">
          <Label>Cover Image</Label>
          <Input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} />
        </div>

        <div className="space-y-2">
          <Label>Audio File</Label>
          <Input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files?.[0] || null)} />
        </div>

        <Button disabled={uploading} onClick={handleUpload} className="w-full">
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
      </div>
    </div>
  );
}
