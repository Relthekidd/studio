'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

import { AlbumCard } from '@/components/AlbumCard';
import SectionTitle from '@/components/SectionTitle';
import type { Track } from '@/types/music';
import { fetchArtistsByIds } from '@/utils/helpers';

export default function DiscoverPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [trending, setTrending] = useState<Track[]>([]);

  useEffect(() => {
    async function fetchTracks() {
      const songsRef = collection(db, 'songs');
      const albumsRef = collection(db, 'albums');

      const [songsSnap, albumsSnap, trendingSnap] = await Promise.all([
        getDocs(query(songsRef, orderBy('createdAt', 'desc'), limit(20))),
        getDocs(query(albumsRef, orderBy('createdAt', 'desc'), limit(20))),
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
              duration: data.duration,
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
            duration: data.duration,
            type: data.type || 'track',
            createdAt: data.createdAt?.toDate() || new Date(),
            order: data.order || 0,
          };
        })
      );

      const albums: Track[] = await Promise.all(
        albumsSnap.docs.map(async (doc) => {
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
            audioURL: '',
            coverURL: data.coverURL,
            duration: 0,
            type: 'album',
            createdAt: data.createdAt?.toDate() || new Date(),
            order: data.order || 0, // Add order
          };
        })
      );

      setTracks([...singles, ...albums]);
      setTrending(trendingSingles);
    }

    fetchTracks();
  }, []);

  const newestReleases = tracks.slice(0, 5);
  const suggestions = tracks.slice(10, 15); // Placeholder – personalized logic later

  return (
    <div className="container mx-auto space-y-10 p-4 md:space-y-14 md:p-6">
      <SectionTitle className="text-3xl font-bold text-foreground">Discover New Music</SectionTitle>

      <section>
        <SectionTitle className="text-2xl">Newest Releases</SectionTitle>
        <div className="scrollbar-thin -mx-4 flex space-x-4 overflow-x-auto px-4 pb-4">
          {newestReleases.map((track) => (
            <AlbumCard key={track.id} item={track} className="w-36 shrink-0 sm:w-40 md:w-48" />
          ))}
        </div>
      </section>

      <section>
        <SectionTitle className="text-2xl">Trending</SectionTitle>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6">
          {trending.map((track) => (
            <AlbumCard key={track.id} item={track} />
          ))}
        </div>
      </section>

      <section>
        <SectionTitle className="text-2xl">Suggested For You</SectionTitle>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6">
          {suggestions.map((track) => (
            <AlbumCard key={track.id} item={track} />
          ))}
        </div>
      </section>
    </div>
  );
}
