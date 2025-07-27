'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, where, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Track } from '@/types/music';
import Section from '@/components/section';
import Hero from '@/components/Hero';
import TrackCardSkeleton from '@/components/TrackCardSkeleton';
import Link from 'next/link';
import { AlbumCard } from '@/components/AlbumCard';
import { fetchArtistsByIds } from '@/utils/helpers';

export default function Home() {
  const [recentSongs, setRecentSongs] = useState<Track[]>([]);
  const [trendingSongs, setTrendingSongs] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSongs() {
      try {
        const songsRef = collection(db, 'songs');
        const albumsRef = collection(db, 'albums');

        const [songsSnap, albumsSnap, trendingSnap] = await Promise.all([
          getDocs(query(songsRef, orderBy('createdAt', 'desc'))),
          getDocs(query(albumsRef, orderBy('createdAt', 'desc'))),
          getDocs(query(songsRef, orderBy('streams', 'desc'), limit(5))),
        ]);

        const singles: Track[] = await Promise.all(
          songsSnap.docs
            .filter((d) => (d.data().type || 'track') !== 'album')
            .map(async (doc) => {
              const data = doc.data();
              let artists = data.artists || [];

              if (
                (!artists || artists.length === 0) &&
                Array.isArray(data.artistIds) &&
                data.artistIds.length > 0
              ) {
                artists = await fetchArtistsByIds(data.artistIds);
              }

              if (artists.length === 0 && data.artist) {
                artists = [{ id: '', name: data.artist }];
              }

              return {
                id: doc.id,
                title: data.title,
                artists: artists.length > 0 ? artists : [{ id: '', name: 'Unknown Artist' }],
                audioURL: data.audioURL,
                coverURL: data.coverURL,
                duration: data.duration || 0,
                type: data.type || 'track',
                createdAt: data.createdAt?.toDate() || new Date(),
                order: data.order || 0, // Add order
              };
            })
        );

        const trendingSingles: Track[] = await Promise.all(
          trendingSnap.docs.map(async (doc) => {
            const data = doc.data();
            let artists = data.artists || [];

            if (
              (!artists || artists.length === 0) &&
              Array.isArray(data.artistIds) &&
              data.artistIds.length > 0
            ) {
              artists = await fetchArtistsByIds(data.artistIds);
            }

            if (artists.length === 0 && data.artist) {
              artists = [{ id: '', name: data.artist }];
            }

            return {
              id: doc.id,
              title: data.title,
              artists: artists.length > 0 ? artists : [{ id: '', name: 'Unknown Artist' }],
              audioURL: data.audioURL,
              coverURL: data.coverURL,
              duration: data.duration || 0,
              type: data.type || 'track',
              createdAt: data.createdAt?.toDate() || new Date(),
              order: data.order || 0,
            };
          })
        );

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
        setTrendingSongs(trendingSingles);
      } catch (error) {
        console.error('[Home] Error fetching songs:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSongs();
  }, []);

  if (loading)
    return (
      <div className="space-y-12">
        <Hero />
        <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <TrackCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );

  return (
    <div className="space-y-12">
      <Hero />
      <div id="recent" className="space-y-12 p-6">
        <h1 className="text-3xl font-bold">Welcome back</h1>

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
    </div>
  );
}
