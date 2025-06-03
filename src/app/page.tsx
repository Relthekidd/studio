'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Track } from '@/types/music';
import Section from '@/components/section';
import Loader from '@/components/loader';
import Link from 'next/link';
import { AlbumCard } from '@/components/AlbumCard';

export default function Home() {
  const [recentSongs, setRecentSongs] = useState<Track[]>([]);
  const [trendingSongs, setTrendingSongs] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSongs() {
      try {
        const songsRef = collection(db, 'songs');
        const q = query(songsRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);

        const tracks: Track[] = snapshot.docs.map((doc) => {
          const data = doc.data();

          return {
            id: doc.id,
            title: data.title,
            artists: data.artists || [{ id: '', name: data.artist || 'Unknown Artist' }],
            audioURL: data.audioURL,
            coverURL: data.coverURL,
            duration: data.duration || 0,
            type: 'track',
          };
        });

        setRecentSongs(tracks.slice(0, 10));
        setTrendingSongs(tracks.slice(0, 5));
      } catch (error) {
        console.error('[Home] Error fetching songs:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSongs();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="space-y-12 p-6">
      <h1 className="text-3xl font-bold text-white">Welcome back</h1>

      <Section title="Recently Added" items={recentSongs} />

      <Section title="Trending" items={trendingSongs} />
      {trendingSongs.map((track) => (
        <Link href={`/single/${track.id}`} key={track.id}>
          <AlbumCard item={track} />
        </Link>
      ))}
    </div>
  );
}
