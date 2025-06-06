'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, serverTimestamp, doc, setDoc, query, where, getDocs } from 'firebase/firestore';

import { db, storage } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthProvider';
import { useToast } from '@/hooks/use-toast';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminUploadPage() {
  const router = useRouter();
  const { user, isAdmin, loading } = useAuth();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [artistsInput, setArtistsInput] = useState('');
  const [genre, setGenre] = useState('');
  const [albumName, setAlbumName] = useState(''); // Add albumName state
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [type, setType] = useState<'single' | 'album'>('single');

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      toast({ title: 'Access Denied', description: 'Admin access only.' });
      router.replace('/');
    }
  }, [user, loading, isAdmin, router, toast]);

  const handleUpload = async () => {
    if (
      !title ||
      !artistsInput ||
      !audioFile ||
      !coverFile ||
      (type === 'album' && !albumName)
    ) {
      toast({ title: 'Missing Fields', description: 'Please fill all fields.' });
      return;
    }

    setUploading(true);
    try {
      // Look up or create artists
      const artistNames = artistsInput
        .split(',')
        .map((n) => n.trim())
        .filter(Boolean);
      const artistsData: { id: string; name: string }[] = [];

      for (const name of artistNames) {
        const artistQuery = await getDocs(
          query(collection(db, 'artists'), where('name', '==', name))
        );
        let artistData;
        if (artistQuery.empty) {
          const newArtistRef = doc(collection(db, 'artists'));
          artistData = { id: newArtistRef.id, name };
          await setDoc(newArtistRef, { ...artistData, createdAt: serverTimestamp() });
        } else {
          const docData = artistQuery.docs[0];
          artistData = { id: docData.id, name: docData.data().name };
        }
        artistsData.push(artistData);
      }

      // Upload cover and audio files
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

      // Determine album
      let albumId = '';
      if (type === 'album') {
        const albumQuery = await getDocs(
          query(collection(db, 'albums'), where('title', '==', albumName.trim()))
        );
        if (albumQuery.empty) {
          const newAlbumRef = doc(collection(db, 'albums'));
          albumId = newAlbumRef.id;
          await setDoc(newAlbumRef, {
            id: albumId,
            title: albumName.trim(),
            artistIds: artistsData.map((a) => a.id),
            coverURL,
            genre,
            createdAt: serverTimestamp(),
          });
        } else {
          const albumDoc = albumQuery.docs[0];
          albumId = albumDoc.id;
        }
      }

      const newDocRef = doc(collection(db, 'songs'));

      const songData: Record<string, any> = {
        id: newDocRef.id,
        title,
        artists: artistsData,
        artistIds: artistsData.map((a) => a.id),
        albumId,
        genre,
        audioURL,
        coverURL,
        duration,
        type,
        description: '',
        createdAt: serverTimestamp(),
      };

      if (type === 'album') {
        songData.albumName = albumName.trim();
      }

      await setDoc(newDocRef, songData);

      toast({ title: 'Upload successful!' });
      setTitle('');
      setArtistsInput('');
      setGenre('');
      setAlbumName(''); // Reset albumName
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
    <div className="container max-w-xl space-y-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Upload</h1>
        <Link
          href="/"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:underline"
        >
          <ArrowLeft size={16} /> Home
        </Link>
      </div>

      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="space-y-2">
            <Label>Type</Label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'single' | 'album')}
              className="w-full rounded border px-3 py-2"
            >
              <option value="single">Single</option>
              <option value="album">Album</option>
            </select>
          </div>

        {type === 'album' && ( // Show albumName field only if type is album
          <Input
            placeholder="Album Name"
            value={albumName}
            onChange={(e) => setAlbumName(e.target.value)}
          />
        )}

        <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input
          placeholder="Artists (comma separated)"
          value={artistsInput}
          onChange={(e) => setArtistsInput(e.target.value)}
        />
        <Input placeholder="Genre" value={genre} onChange={(e) => setGenre(e.target.value)} />

        <div className="space-y-2">
          <Label>Cover Image</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
          />
        </div>

        <div className="space-y-2">
          <Label>Audio File</Label>
          <Input
            type="file"
            accept="audio/*"
            onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
          />
        </div>

        <Button disabled={uploading} onClick={handleUpload} className="w-full">
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
        </CardContent>
      </Card>
    </div>
  );
}
