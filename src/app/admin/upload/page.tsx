'use client';
/* eslint-disable jsx-a11y/media-has-caption */

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
  addDoc,
} from 'firebase/firestore';

import { db, storage } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthProvider';
import { useToast } from '@/hooks/use-toast';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowDown, ArrowUp, GripVertical } from 'lucide-react';
import Link from 'next/link';
import SectionTitle from '@/components/SectionTitle';

async function getOrCreateArtistIdByName(name: string) {
  const q = query(collection(db, 'artists'), where('name', '==', name.trim()));
  const snap = await getDocs(q);
  if (!snap.empty) {
    return snap.docs[0].id;
  }
  // Create new artist
  const newArtistRef = await addDoc(collection(db, 'artists'), { name: name.trim() });
  return newArtistRef.id;
}

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
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [songs, setSongs] = useState<
    { file: File; title: string; mainArtist: string; featuredArtists: string; duration?: number }[]
  >([]);
  const [uploading, setUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

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

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) {
      setDraggedIndex(null);
      return;
    }
    handleReorder(draggedIndex, index);
    setDraggedIndex(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
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

      // Upload cover file
      const coverRef = ref(storage, `covers/${Date.now()}-${coverFile.name}`);
      await uploadBytesResumable(coverRef, coverFile);
      const coverURL = await getDownloadURL(coverRef);

      let albumId = '';
      if (type === 'album') {
        const albumRef = doc(collection(db, 'albums'));
        albumId = albumRef.id;
        const mainArtistId = await getOrCreateArtistIdByName(mainArtistName);

        // Save album with mainArtistIds as [mainArtistId]
        await setDoc(albumRef, {
          id: albumId,
          title: albumName.trim(),
          mainArtistIds: [mainArtistId],
          artistIds: [mainArtistId], // or add featured artist IDs as well
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

  if (loading || !user) return <div className="p-6">Loading...</div>;

  return (
    <div className="container mx-auto space-y-6 px-4 py-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <SectionTitle>Upload Music</SectionTitle>
        <Link
          href="/"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:underline"
        >
          <ArrowLeft size={16} /> Home
        </Link>
      </div>

      <Card>
        <CardContent className="space-y-6 p-6">
          <div className="space-y-4">
            <h2 className="font-semibold text-lg">Basic Info</h2>
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
            <div className="space-y-2">
              <Label>Main Artist</Label>
              <Input
                placeholder="Main Artist"
                value={mainArtist}
                onChange={(e) => setMainArtist(e.target.value)}
                className="rounded border border-gray-700 bg-black px-3 py-2 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Cover Art</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setCoverFile(file);
                  setCoverPreview(file ? URL.createObjectURL(file) : null);
                }}
                className="rounded border border-gray-700 bg-black px-3 py-2 text-white"
              />
              {coverPreview && (
                <Image
                  src={coverPreview}
                  alt="Cover preview"
                  width={128}
                  height={128}
                  className="mt-2 rounded object-cover"
                />
              )}
            </div>
          </div>

          {type === 'album' && (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">Album Details</h2>
              <div className="space-y-2">
                <Label>Album Name</Label>
                <Input
                  placeholder="Album Name"
                  value={albumName}
                  onChange={(e) => setAlbumName(e.target.value)}
                  className="rounded border border-gray-700 bg-black px-3 py-2 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label>Album Description</Label>
                <textarea
                  className="w-full rounded border border-gray-700 bg-black p-2 text-white"
                  placeholder="Album Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Audio Files</Label>
                <Input
                  type="file"
                  accept="audio/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    const newSongs = files.map((file) => ({
                      file,
                      title: '',
                      mainArtist: mainArtist,
                      featuredArtists: '',
                      duration: 0,
                    }));
                    newSongs.forEach((song) => {
                      const audio = document.createElement('audio');
                      audio.src = URL.createObjectURL(song.file);
                      audio.addEventListener('loadedmetadata', () => {
                        song.duration = audio.duration;
                        setSongs((prev) => [...prev]);
                      });
                    });
                    setSongs((prevSongs) => [...prevSongs, ...newSongs]);
                  }}
                  className="rounded border border-gray-700 bg-black px-3 py-2 text-white"
                />
                {songs.length === 0 && (
                  <p className="text-sm text-muted-foreground">No files selected</p>
                )}
              </div>
              {songs.length > 0 && (
                <>
                  <h3 className="font-semibold">Songs</h3>
                  <ul className="space-y-4">
                    {songs.map((song, index) => (
                      <li
                        key={index}
                        className={`space-y-2 rounded border border-gray-700 p-2 ${
                          draggedIndex === index ? 'opacity-50' : ''
                        }`}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(index)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {index + 1}. {song.file.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => handleReorder(index, index - 1)}
                              aria-label="Move up"
                              className="disabled:opacity-50"
                            >
                              <ArrowUp size={16} />
                            </button>
                            <button
                              type="button"
                              disabled={index === songs.length - 1}
                              onClick={() => handleReorder(index, index + 1)}
                              aria-label="Move down"
                              className="disabled:opacity-50"
                            >
                              <ArrowDown size={16} />
                            </button>
                            <GripVertical size={16} className="cursor-grab" />
                          </div>
                        </div>
                        {(song.duration ?? 0) > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Duration: {Math.round(song.duration ?? 0)}s
                          </p>
                        )}
                        <audio controls src={URL.createObjectURL(song.file)} className="w-full" />
                        <Input
                          placeholder="Song Title"
                          value={song.title}
                          onChange={(e) => handleSongMetadataChange(index, 'title', e.target.value)}
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
                </>
              )}
            </div>
          )}

          {type === 'single' && (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">Single Details</h2>
              <div className="space-y-2">
                <Label>Featured Artists</Label>
                <Input
                  placeholder="Featured Artists (comma separated)"
                  value={featuredArtists}
                  onChange={(e) => setFeaturedArtists(e.target.value)}
                  className="rounded border border-gray-700 bg-black px-3 py-2 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label>Audio File</Label>
                <Input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0];
                    if (selectedFile) {
                      const song = {
                        file: selectedFile,
                        title: '',
                        mainArtist: mainArtist,
                        featuredArtists: '',
                        duration: 0,
                      };
                      const audio = document.createElement('audio');
                      audio.src = URL.createObjectURL(selectedFile);
                      audio.addEventListener('loadedmetadata', () => {
                        song.duration = audio.duration;
                        setSongs((prev) => [...prev]);
                      });
                      setSongs([song]);
                    }
                  }}
                  className="rounded border border-gray-700 bg-black px-3 py-2 text-white"
                />
                {songs.length === 0 && (
                  <p className="text-sm text-muted-foreground">No file selected</p>
                )}
                {songs[0] && (
                  <>
                    <p className="text-sm text-muted-foreground">{songs[0].file.name}</p>
                    {(songs[0].duration ?? 0) > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Duration: {Math.round(songs[0].duration ?? 0)}s
                      </p>
                    )}
                    <audio controls src={URL.createObjectURL(songs[0].file)} className="w-full" />
                  </>
                )}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h2 className="font-semibold text-lg">Genre</h2>
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

          <div className="space-y-2">
            <h2 className="font-semibold text-lg">Description</h2>
            <Label>Description</Label>
            <textarea
              className="w-full rounded border border-gray-700 bg-black p-2 text-white"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
