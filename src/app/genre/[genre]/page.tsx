// src/app/genre/[genre]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { usePlayerStore } from '@/features/player/store';
import { PlayCircle } from 'lucide-react';
import SectionTitle from '@/components/SectionTitle';
import { AlbumCard } from '@/components/AlbumCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Track } from '@/types/music';

export default function GenrePage() {
  const { genre } = useParams();
  const [tracks, setTracks] = useState<Track[]>([]);
  const setQueue = usePlayerStore((s) => s.setQueue);
  const setTrack = usePlayerStore((s) => s.setTrack);
  const { toast } = useToast();

  useEffect(() => {
    const fetchGenreTracks = async () => {
      const q = query(collection(db, 'songs'), where('genre', '==', genre));
      const snap = await getDocs(q);
      setTracks(snap.docs.map((doc) => doc.data() as Track));
    };
    fetchGenreTracks();
  }, [genre]);

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      setQueue(tracks);
      setTrack(tracks[0]);
      toast({ title: 'Now Playing', description: `Genre: ${genre}` });
    }
  };

  return (
    <div className="container space-y-6 py-8">
      <div className="flex items-center justify-between">
        <SectionTitle>Genre: {genre}</SectionTitle>
        <Button onClick={handlePlayAll}>
          <PlayCircle className="mr-2" /> Play All
        </Button>
      </div>

      {tracks.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {tracks.map((track) => (
            <AlbumCard key={track.id} item={{ ...track, type: 'track' }} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No songs found in this genre.</p>
      )}
    </div>
  );
}
