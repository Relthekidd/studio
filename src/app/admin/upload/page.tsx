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
  arrayUnion,
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

  const [albumName, setAlbumName] = useState('');
  const [mainArtistsInput, setMainArtistsInput] = useState('');
  const [featuredArtistsInput, setFeaturedArtistsInput] = useState('');
  const [genre, setGenre] = useState('');
  const [albumDescription, setAlbumDescription] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [songs, setSongs] = useState<
    { file: File; title: string; mainArtists: string; featuredArtists: string }[]
  >([]);
  const [uploading, setUploading] = useState(false);
  const [type, setType] = useState<'single' | 'album'>('single');

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
    field: 'title' | 'mainArtists' | 'featuredArtists',
    value: string
  ) => {
    const updatedSongs = [...songs];
    updatedSongs[index][field] = value;
    setSongs(updatedSongs);
  };

  const handleUpload = async () => {
    if (
      !albumName ||
      !mainArtistsInput ||
      !coverFile ||
      (type === 'album' && songs.length === 0) ||
      (type === 'single' && songs.length !== 1)
    ) {
      toast({ title: 'Missing Fields', description: 'Please fill all fields.' });
      return;
    }

    setUploading(true);
    try {
      // Helper map to avoid duplicate queries for the same artist name
      const artistCache = new Map<string, { id: string; name: string }>();

      // Parse album level artist names
      const parseNames = (input: string) =>
        input
          .split(',')
          .map((n) => n.trim())
          .filter(Boolean);

      const albumMainNames = parseNames(mainArtistsInput);
      const albumFeaturedNames = parseNames(featuredArtistsInput);

      // Collect all artist names from the album and individual tracks
      const collectNames = new Set<string>([...albumMainNames, ...albumFeaturedNames]);
      for (const song of songs) {
        parseNames(song.mainArtists).forEach((n) => collectNames.add(n));
        parseNames(song.featuredArtists).forEach((n) => collectNames.add(n));
      }

      // Ensure all artists exist and store in cache
      const ensureArtist = async (name: string) => {
        if (artistCache.has(name)) return artistCache.get(name)!;
        const q = await getDocs(query(collection(db, 'artists'), where('name', '==', name)));
        let data;
        if (q.empty) {
          const newRef = doc(collection(db, 'artists'));
          data = { id: newRef.id, name };
          await setDoc(newRef, { ...data, createdAt: serverTimestamp() });
        } else {
          const d = q.docs[0];
          data = { id: d.id, name: d.data().name };
        }
        artistCache.set(name, data);
        return data;
      };

      // Preload artists for the entire album
      for (const name of collectNames) {
        await ensureArtist(name);
      }

      const albumArtistIds = new Set<string>();
      artistCache.forEach((value) => {
        albumArtistIds.add(value.id);
      });

      // Upload cover file
      const coverRef = ref(storage, `covers/${Date.now()}-${coverFile.name}`);
      await uploadBytesResumable(coverRef, coverFile);
      const coverURL = await getDownloadURL(coverRef);

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
            artistIds: Array.from(albumArtistIds),
            coverURL,
            genre,
            description: albumDescription.trim(),
            createdAt: serverTimestamp(),
          });
        } else {
          const albumDoc = albumQuery.docs[0];
          albumId = albumDoc.id;
        }
      }

      // Upload songs
      for (const [index, song] of songs.entries()) {
        const audioRef = ref(storage, `audio/${Date.now()}-${song.file.name}`);
        await uploadBytesResumable(audioRef, song.file);
        const audioURL = await getDownloadURL(audioRef);

        // Calculate audio duration
        const audioElement = new Audio(audioURL);
        const duration = await new Promise<number>((resolve) => {
          audioElement.addEventListener('loadedmetadata', () => {
            resolve(audioElement.duration);
          });
        });

        const newDocRef = doc(collection(db, 'songs'));

        const songMainNames = song.mainArtists ? parseNames(song.mainArtists) : albumMainNames;
        const songFeaturedNames = song.featuredArtists
          ? parseNames(song.featuredArtists)
          : albumFeaturedNames;

        const songArtists: { id: string; name: string }[] = [];
        const mainIdsForSong: string[] = [];
        const featuredIdsForSong: string[] = [];
        const allSongNames = new Set<string>([...songMainNames, ...songFeaturedNames]);
        for (const n of allSongNames) {
          const data = await ensureArtist(n);
          songArtists.push(data);
          if (songMainNames.includes(n)) mainIdsForSong.push(data.id);
          else featuredIdsForSong.push(data.id);
          albumArtistIds.add(data.id);
        }

        const songData: Record<string, any> = {
          id: newDocRef.id,
          title: song.title,
          artists: songArtists,
          artistIds: songArtists.map((a) => a.id),
          mainArtistIds: mainIdsForSong,
          featuredArtistIds: featuredIdsForSong,
          albumId,
          genre,
          audioURL,
          coverURL,
          duration,
          type,
          description: '',
          order: index + 1, // Save the order of the song
          createdAt: serverTimestamp(),
        };

        if (type === 'album') {
          songData.albumName = albumName.trim();
          songData.albumDescription = albumDescription.trim();
        }

        await setDoc(newDocRef, songData);

        // Update artist pages with the new song
        for (const artistId of [...mainIdsForSong, ...featuredIdsForSong]) {
          const artistRef = doc(db, 'artists', artistId);
          await setDoc(artistRef, { songs: arrayUnion(newDocRef.id) }, { merge: true });
        }
      }

      toast({ title: 'Upload successful!' });
      setAlbumName('');
      setMainArtistsInput('');
      setFeaturedArtistsInput('');
      setGenre('');
      setAlbumDescription('');
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

          {type === 'album' && (
            <Input
              placeholder="Album Name"
              value={albumName}
              onChange={(e) => setAlbumName(e.target.value)}
              className="rounded border border-gray-700 bg-black px-3 py-2 text-white"
            />
          )}

          <Input
            placeholder="Main Artists (comma separated)"
            value={mainArtistsInput}
            onChange={(e) => setMainArtistsInput(e.target.value)}
            className="rounded border border-gray-700 bg-black px-3 py-2 text-white"
          />
          <Input
            placeholder="Featured Artists (comma separated)"
            value={featuredArtistsInput}
            onChange={(e) => setFeaturedArtistsInput(e.target.value)}
            className="rounded border border-gray-700 bg-black px-3 py-2 text-white"
          />
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
          {type === 'album' && (
            <textarea
              className="w-full rounded border border-gray-700 bg-black p-2 text-white"
              placeholder="Album Description"
              value={albumDescription}
              onChange={(e) => setAlbumDescription(e.target.value)}
            />
          )}

          <div className="space-y-2">
            <Label>Cover Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
              className="rounded border border-gray-700 bg-black px-3 py-2 text-white"
            />
          </div>

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
                    mainArtists: '',
                    featuredArtists: '',
                  })),
                ])
              }
              className="rounded border border-gray-700 bg-black px-3 py-2 text-white"
            />
            {songs.length > 0 && (
              <ul className="space-y-4">
                {songs.map((song, index) => (
                  <li key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>
                        Track {index + 1}: {song.file.name}
                      </span>
                      <div className="flex gap-2">
                        {index > 0 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleReorder(index, index - 1)}
                          >
                            ↑
                          </Button>
                        )}
                        {index < songs.length - 1 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleReorder(index, index + 1)}
                          >
                            ↓
                          </Button>
                        )}
                      </div>
                    </div>
                    <Input
                      placeholder="Song Title"
                      value={song.title}
                      onChange={(e) => handleSongMetadataChange(index, 'title', e.target.value)}
                      className="rounded border border-gray-700 bg-black px-3 py-2 text-white"
                    />
                    <Input
                      placeholder="Main Artists (comma separated)"
                      value={song.mainArtists}
                      onChange={(e) =>
                        handleSongMetadataChange(index, 'mainArtists', e.target.value)
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
          </div>

          <Button disabled={uploading} onClick={handleUpload} className="w-full">
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
