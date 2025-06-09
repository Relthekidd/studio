'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
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
        const albumsRef = collection(db, 'albums');

        const [songsSnap, albumsSnap] = await Promise.all([
          getDocs(query(songsRef, orderBy('createdAt', 'desc'))),
          getDocs(query(albumsRef, orderBy('createdAt', 'desc'))),
        ]);

        const singles: Track[] = songsSnap.docs
          .map((doc) => {
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
              order: data.order || 0, // Add order
            };
          })
          .filter((t) => t.type !== 'album');

        const albums: Track[] = await Promise.all(
          albumsSnap.docs.map(async (doc) => {
            const data = doc.data();
            const artistIds = data.artistIds || [];
            const mainArtistIds = data.mainArtistIds || [];
            let artists = data.artists || [];

            // Fetch artist data if `artists` field is missing or empty
            if (artists.length === 0 && artistIds.length > 0) {
              const artistQuery = query(collection(db, 'artists'), where('id', 'in', artistIds));
              const artistSnap = await getDocs(artistQuery);
              artists = artistSnap.docs.map((artistDoc) => ({
                id: artistDoc.id,
                name: artistDoc.data().name || 'Unknown Artist',
              }));
            }

            // Filter only main artists
            const mainArtists = artists.filter((artist: { id: string; name: string }) =>
              mainArtistIds.includes(artist.id)
            );

            return {
              id: doc.id,
              title: data.title,
              artists: mainArtists.length > 0 ? mainArtists : [{ id: '', name: 'Unknown Artist' }],
              audioURL: '',
              coverURL: data.coverURL,
              duration: 0,
              type: 'album',
              createdAt: data.createdAt?.toDate() || new Date(),
              order: data.order || 0, // Add order
            };
          })
        );

        const combined = [...singles, ...albums];

        setRecentSongs(combined.slice(0, 10));
        setTrendingSongs(combined.slice(0, 5));
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
        <Link
          href={track.type === 'album' ? `/album/${track.id}` : `/single/${track.id}`}
          key={track.id}
        >
          <AlbumCard item={track} />
        </Link>
      ))}
    </div>
  );
}
