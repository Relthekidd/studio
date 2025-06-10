'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthProvider';
import { AlbumCard } from '@/components/AlbumCard';
import SectionTitle from '@/components/SectionTitle';
import type { Track } from '@/types/music';

export default function StreamStatsPage() {
  const router = useRouter();
  const { user, isAdmin, loading } = useAuth();
  const [topTracks, setTopTracks] = useState<(Track & { streams: number })[]>([]);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.replace('/');
    }
  }, [user, loading, isAdmin, router]);

  useEffect(() => {
    async function fetchTopTracks() {
      const songsRef = collection(db, 'songs');
      const snap = await getDocs(query(songsRef, orderBy('streams', 'desc'), limit(20)));
      const tracks = snap.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          artists: data.artists || [{ id: '', name: data.artist || 'Unknown Artist' }],
          audioURL: data.audioURL,
          coverURL: data.coverURL,
          duration: data.duration || 0,
          type: data.type || 'track',
          createdAt: data.createdAt?.toDate() || new Date(),
          order: data.order || 0,
          streams: data.streams || 0,
        } as Track & { streams: number };
      });
      setTopTracks(tracks);
    }
    fetchTopTracks();
  }, []);

  return (
    <div className="container mx-auto space-y-6 p-4 md:p-6">
      <SectionTitle className="text-3xl font-bold">Top Streamed Tracks</SectionTitle>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6">
        {topTracks.map((track) => (
          <div key={track.id} className="space-y-2">
            <AlbumCard item={track} />
            <p className="text-center text-sm text-muted-foreground">{track.streams} streams</p>
          </div>
        ))}
      </div>
    </div>
  );
}
