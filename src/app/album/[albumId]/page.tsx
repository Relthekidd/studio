'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { usePlayerStore } from '@/features/player/store';
import { Button } from '@/components/ui/button';
import type { Track } from '@/types/music';
import { normalizeTrack } from '@/utils/normalizeTrack';
import { formatArtists } from '@/utils/formatArtists';
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
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const togglePlayPause = usePlayerStore((s) => s.togglePlayPause);

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
        </div>
      </div>

      <div className="space-y-4">
        {tracks.map((track) => (
          <div key={track.id} className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">{track.title}</h3>
              <p className="text-xs text-muted-foreground">{formatArtists(track.artists)}</p>
            </div>
            <Button onClick={() => togglePlayPause(track)}>
              {currentTrack?.id === track.id && isPlaying ? 'Pause' : 'Play'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
