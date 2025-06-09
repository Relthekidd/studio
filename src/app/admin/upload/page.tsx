'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import {
  collection,
  serverTimestamp,
  doc,
  setDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';

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

  const [type, setType] = useState<'single' | 'album'>('single');
  const [albumName, setAlbumName] = useState('');
  const [mainArtist, setMainArtist] = useState('');
  const [featuredArtists, setFeaturedArtists] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [songs, setSongs] = useState<
    { file: File; title: string; mainArtist: string; featuredArtists: string }[]
  >([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      toast({ title: 'Access Denied', description: 'Admin access only.' });
      router.replace('/');
    }
  }, [user, loading, isAdmin, router, toast]);

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const updatedSongs = [...songs];
    const [movedSong] = updatedSongs.splice(fromIndex, 1);
    updatedSongs.splice(toIndex, 0, movedSong);
    setSongs(updatedSongs);
  };

  const handleSongMetadataChange = (
    index: number,
    field: 'title' | 'mainArtist' | 'featuredArtists',
    value: string
  ) => {
    const updatedSongs = [...songs];
    updatedSongs[index][field] = value;
    setSongs(updatedSongs);
  };

  const handleUpload = async () => {
    if (
      !mainArtist ||
      !coverFile ||
      (type === 'album' && (!albumName || songs.length === 0)) ||
      (type === 'single' && songs.length !== 1)
    ) {
      toast({ title: 'Missing Fields', description: 'Please fill all fields.' });
      return;
    }

    setUploading(true);
    try {
      const parseNames = (input: string) =>
        input
          .split(',')
          .map((n) => n.trim())
          .filter(Boolean);

      const mainArtistName = mainArtist.trim();
      const featuredArtistNames = parseNames(featuredArtists);

      // Upload cover file
      const coverRef = ref(storage, `covers/${Date.now()}-${coverFile.name}`);
      await uploadBytesResumable(coverRef, coverFile);
      const coverURL = await getDownloadURL(coverRef);

      let albumId = '';
      if (type === 'album') {
        const albumRef = doc(collection(db, 'albums'));
        albumId = albumRef.id;
        await setDoc(albumRef, {
          id: albumId,
          title: albumName.trim(),
          mainArtist: mainArtistName,
          coverURL,
          genre,
          description: description.trim(),
          createdAt: serverTimestamp(),
        });
      }

      // Upload songs
      for (const [index, song] of songs.entries()) {
        const audioRef = ref(storage, `audio/${Date.now()}-${song.file.name}`);
        await uploadBytesResumable(audioRef, song.file);
        const audioURL = await getDownloadURL(audioRef);

        const songRef =
          type === 'album'
            ? doc(collection(db, 'albums', albumId, 'songs'))
            : doc(collection(db, 'songs'));

        await setDoc(songRef, {
          id: songRef.id,
          title: song.title,
          mainArtist: song.mainArtist || mainArtistName,
          featuredArtists: parseNames(song.featuredArtists),
          albumId: type === 'album' ? albumId : null,
          genre,
          audioURL,
          coverURL,
          type,
          order: index + 1,
          createdAt: serverTimestamp(),
        });
      }

      toast({ title: 'Upload successful!' });
      setAlbumName('');
      setMainArtist('');
      setFeaturedArtists('');
      setGenre('');
      setDescription('');
      setCoverFile(null);
      setSongs([]);
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
          {/* Type Selection */}
          <div className="space-y-2">
            <Label>Type</Label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'single' | 'album')}
              className="w-full rounded border border-gray-700 bg-black px-3 py-2 text-white"
            >
              <option value="single">Single</option>
              <option value="album">Album</option>
            </select>
          </div>

          {/* Cover Art */}
          <div className="space-y-2">
            <Label>Cover Art</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
              className="rounded border border-gray-700 bg-black px-3 py-2 text-white"
            />
          </div>

          {/* Main Artist */}
          <Input
            placeholder="Main Artist"
            value={mainArtist}
            onChange={(e) => setMainArtist(e.target.value)}
            className="rounded border border-gray-700 bg-black px-3 py-2 text-white"
          />

          {/* Album-Specific Fields */}
          {type === 'album' && (
            <>
              <Input
                placeholder="Album Name"
                value={albumName}
                onChange={(e) => setAlbumName(e.target.value)}
                className="rounded border border-gray-700 bg-black px-3 py-2 text-white"
              />
              <textarea
                className="w-full rounded border border-gray-700 bg-black p-2 text-white"
                placeholder="Album Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="space-y-2">
                <Label>Audio Files</Label>
                <Input
                  type="file"
                  accept="audio/*"
                  multiple
                  onChange={(e) =>
                    setSongs((prevSongs) => [
                      ...prevSongs,
                      ...Array.from(e.target.files || []).map((file) => ({
                        file,
                        title: '',
                        mainArtist: mainArtist,
                        featuredArtists: '',
                      })),
                    ])
                  }
                  className="rounded border border-gray-700 bg-black px-3 py-2 text-white"
                />
              </div>
              {songs.length > 0 && (
                <ul className="space-y-4">
                  {songs.map((song, index) => (
                    <li key={index} className="space-y-2">
                      <Input
                        placeholder="Song Title"
                        value={song.title}
                        onChange={(e) =>
                          handleSongMetadataChange(index, 'title', e.target.value)
                        }
                        className="rounded border border-gray-700 bg-black px-3 py-2 text-white"
                      />
                      <Input
                        placeholder="Main Artist"
                        value={song.mainArtist}
                        onChange={(e) =>
                          handleSongMetadataChange(index, 'mainArtist', e.target.value)
                        }
                        className="rounded border border-gray-700 bg-black px-3 py-2 text-white"
                      />
                      <Input
                        placeholder="Featured Artists (comma separated)"
                        value={song.featuredArtists}
                        onChange={(e) =>
                          handleSongMetadataChange(index, 'featuredArtists', e.target.value)
                        }
                        className="rounded border border-gray-700 bg-black px-3 py-2 text-white"
                      />
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {/* Single-Specific Fields */}
          {type === 'single' && (
            <>
              <Input
                placeholder="Featured Artists (comma separated)"
                value={featuredArtists}
                onChange={(e) => setFeaturedArtists(e.target.value)}
                className="rounded border border-gray-700 bg-black px-3 py-2 text-white"
              />
              <div className="space-y-2">
                <Label>Audio File</Label>
                <Input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0];
                    if (selectedFile) {
                      setSongs([
                        {
                          file: selectedFile,
                          title: '',
                          mainArtist: mainArtist,
                          featuredArtists: '',
                        },
                      ]);
                    }
                  }}
                  className="rounded border border-gray-700 bg-black px-3 py-2 text-white"
                />
              </div>
            </>
          )}

          {/* Genre */}
          <div className="space-y-2">
            <Label>Genre</Label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full rounded border border-gray-700 bg-black px-3 py-2 text-white"
            >
              <option value="">Select genre</option>
              <option value="Pop">Pop</option>
              <option value="Hip-Hop">Hip-Hop</option>
              <option value="Rock">Rock</option>
              <option value="Electronic">Electronic</option>
              <option value="Country">Country</option>
            </select>
          </div>

          {/* Upload Button */}
          <Button disabled={uploading} onClick={handleUpload} className="w-full">
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
