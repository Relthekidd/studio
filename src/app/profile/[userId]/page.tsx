'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { collection, getDocs, getDoc, doc, query, orderBy, limit } from 'firebase/firestore';

import Top5Showcase from '@/components/Top5Showcase';
import { db } from '@/lib/firebase';
import type { Track } from '@/contexts/PlayerContext';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import SectionTitle from '@/components/SectionTitle';

interface Artist {
  id: string;
  title: string;
  imageUrl: string;
  type: 'artist';
}

export default function ProfilePage() {
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [topArtists, setTopArtists] = useState<Track[]>([]);
  const [showTop5, setShowTop5] = useState(true);

  useEffect(() => {
    const fetchProfileAndTop5 = async () => {
      if (typeof userId !== 'string') return;

      const profileSnap = await getDoc(doc(db, 'users', userId));
      if (profileSnap.exists()) {
        setUserProfile(profileSnap.data());
      }

      const top5TracksQuery = query(
        collection(db, 'users', userId, 'history'),
        orderBy('playCount', 'desc'),
        limit(5)
      );
      const snapshot = await getDocs(top5TracksQuery);
      const tracks = snapshot.docs.map((doc) => doc.data() as Track);
      setTopTracks(tracks);

      const artistsMap = new Map();
      tracks.forEach((t) => {
        if (t.artist) {
          artistsMap.set(t.artist, (artistsMap.get(t.artist) || 0) + 1);
        }
      });

      const top5Artists = Array.from(artistsMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([artistName], index) => ({
          id: `artist-${index}`,
          title: artistName,
          artist: artistName, // Use the artist's name
          audioURL: '', // Add a placeholder or default audio URL
          coverURL: 'https://placehold.co/300x300/333/fff?text=' + encodeURIComponent(artistName), // Use as coverUrl
          type: 'artist' as const,
        }));

      setTopArtists(top5Artists as Track[]);
    };

    if (showTop5) fetchProfileAndTop5();
  }, [userId, showTop5]);

  return (
    <div className="container mx-auto space-y-6 px-4 py-6">
      <div className="flex items-center justify-between">
        <SectionTitle>{userProfile?.displayName || 'User'}’s Profile</SectionTitle>
        <Link
          href="/library"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:underline"
        >
          <ArrowLeft size={16} /> Back
        </Link>
      </div>

      {showTop5 && (
        <div className="space-y-8">
          <Top5Showcase title="Top 5 Songs" items={topTracks} type="track" />
          <Top5Showcase title="Top 5 Artists" items={topArtists} type="artist" />
        </div>
      )}
    </div>
  );
}
