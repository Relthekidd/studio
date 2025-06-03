'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

import { AlbumCard } from '@/components/AlbumCard';
import SectionTitle from '@/components/SectionTitle';
import type { Track } from '@/types/music';

export default function DiscoverPage() {
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    async function fetchTracks() {
      const tracksRef = collection(db, 'tracks');
      const q = query(tracksRef, orderBy('createdAt', 'desc'), limit(20));
      const snapshot = await getDocs(q);

      const fetchedTracks: Track[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          artist: data.artist,
          audioURL: data.audioURL,
          coverURL: data.coverURL, // Required by <AlbumCard />
          duration: data.duration,
          type: 'track',
        };
      });

      setTracks(fetchedTracks);
    }

    fetchTracks();
  }, []);

  const newestReleases = tracks.slice(0, 5);
  const trending = tracks.slice(5, 10); // Placeholder – real logic later
  const suggestions = tracks.slice(10, 15); // Placeholder – personalized logic later

  return (
    <div className="container mx-auto space-y-10 p-4 md:space-y-14 md:p-6">
      <SectionTitle className="text-3xl font-bold text-foreground">Discover New Music</SectionTitle>

      <section>
        <SectionTitle className="text-2xl">Newest Releases</SectionTitle>
        <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent -mx-4 flex space-x-4 overflow-x-auto px-4 pb-4">
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
