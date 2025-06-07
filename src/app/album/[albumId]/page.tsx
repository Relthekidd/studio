'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '@/lib/firebase';
import { usePlayerStore } from '@/features/player/store';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Track } from '@/types/music';
import { normalizeTrack } from '@/utils/normalizeTrack';
import TrackListItem from '@/components/music/TrackListItem';
import Image from 'next/image'; // Import Image from next/image

interface Album {
  id: string;
  title: string;
  coverURL: string;
  description?: string;
  artist?: string;
}

interface Artist {
  id: string;
  name: string;
}

export default function AlbumPage() {
  const { albumId } = useParams();
  const [album, setAlbum] = useState<Album | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const setCurrentTrack = usePlayerStore((s) => s.setCurrentTrack);
  const setIsPlaying = usePlayerStore((s) => s.setIsPlaying);
  const setQueue = usePlayerStore((s) => s.setQueue);
  const addTracksToQueue = usePlayerStore((s) => s.addTracksToQueue);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAlbum = async () => {
      if (!albumId) return;

      const albumRef = doc(db, 'albums', String(albumId));
      const albumSnap = await getDoc(albumRef);

      if (albumSnap.exists()) {
        setAlbum({ id: albumSnap.id, ...albumSnap.data() } as Album);
      } else {
        console.error('Album not found');
      }
    };

    const fetchTracks = async () => {
      const q = query(collection(db, 'tracks'), where('albumId', '==', String(albumId)));
      const trackSnap = await getDocs(q);

      // Fetch artist details
      const artistQuery = query(collection(db, 'artists'));
      const artistSnap = await getDocs(artistQuery);
      const fetchedArtists: Artist[] = artistSnap.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || 'Unknown Artist',
      }));

      const fetchedTracks: Track[] = trackSnap.docs.map((doc) =>
        normalizeTrack(doc.data(), fetchedArtists)
      );
      setTracks(fetchedTracks);
    };

    fetchAlbum();
    fetchTracks();
  }, [albumId]);

  const handlePlay = (track: Track) => {
    setQueue(tracks);
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handleAddAlbumToQueue = () => {
    addTracksToQueue(tracks);
    toast({ title: 'Added album to queue' });
  };

  const handleAddToLibrary = async () => {
    const user = getAuth().currentUser;
    if (!user || !album) return;
    await setDoc(doc(db, 'users', user.uid, 'savedAlbums', album.id), {
      albumId: album.id,
      addedAt: serverTimestamp(),
    });
    toast({ title: 'Saved to library' });
  };

  if (!album) return <div>Loading album...</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center space-x-4">
        <div className="relative size-36 overflow-hidden rounded-lg">
          <Image
            src={album.coverURL}
            alt={album.title}
            fill
            className="object-cover"
            sizes="144px" // Adjust size as needed
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold">{album.title}</h1>
          {album.description && <p className="text-muted-foreground">{album.description}</p>}
          <div className="mt-4 flex justify-center gap-2">
            <Button onClick={handleAddAlbumToQueue} size="sm">
              Add to Queue
            </Button>
            <Button onClick={handleAddToLibrary} size="sm" variant="secondary">
              Add to Library
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        {tracks.map((track) => (
          <TrackListItem
            key={track.id}
            track={track}
            onPlay={handlePlay}
            coverURL={album.coverURL}
          />
        ))}
      </div>
    </div>
  );
}
