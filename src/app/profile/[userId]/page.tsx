'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
  limit,
  updateDoc,
} from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthProvider';

import Top5Showcase from '@/components/Top5Showcase';
import { db } from '@/lib/firebase';
import type { Track } from '@/types/music';
import { followUser, unfollowUser } from '@/utils/follow';

import BackButton from '@/components/ui/BackButton';
import Link from 'next/link';
import SectionTitle from '@/components/SectionTitle';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

interface Artist {
  id: string;
  title: string;
  imageUrl: string;
  type: 'artist';
}

export default function ProfilePage() {
  const { userId } = useParams();
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [settings, setSettings] = useState({
    showTopSongs: true,
    showTopArtists: true,
    showSpotlightPlaylists: true,
  });
  const [recentTracks, setRecentTracks] = useState<Track[]>([]);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = async () => {
    if (!user || typeof userId !== 'string') return;
    if (isFollowing) {
      await unfollowUser(user.uid, userId);
      setFollowers((f) => f - 1);
    } else {
      await followUser(user.uid, userId);
      setFollowers((f) => f + 1);
    }
    setIsFollowing(!isFollowing);
  };

  const handleToggle = async (
    key: 'showTopSongs' | 'showTopArtists' | 'showSpotlightPlaylists',
    value: boolean,
  ) => {
    if (typeof userId !== 'string' || user?.uid !== userId) return;
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await updateDoc(doc(db, 'profiles', userId), {
      customizations: newSettings,
    });
  };

  useEffect(() => {
    const fetchProfileAndTop5 = async () => {
      if (typeof userId !== 'string') return;

      // Fetch user profile
      const profileSnap = await getDoc(doc(db, 'profiles', userId));
      if (profileSnap.exists()) {
        const data = profileSnap.data();
        setUserProfile(data);
        setSettings((prev) => ({
          ...prev,
          ...data.customizations,
        }));
      }

      const followersSnap = await getDocs(collection(db, 'profiles', userId, 'followers'));
      const followingSnap = await getDocs(collection(db, 'profiles', userId, 'following'));
      setFollowers(followersSnap.size);
      setFollowing(followingSnap.size);
      if (user?.uid) {
        const followDoc = await getDoc(doc(db, 'profiles', userId, 'followers', user.uid));
        setIsFollowing(followDoc.exists());
      }

      // Fetch top 5 tracks
      const top5TracksQuery = query(
        collection(db, 'users', userId, 'history'),
        orderBy('playCount', 'desc'),
        limit(5)
      );
      const snapshot = await getDocs(top5TracksQuery);
      const tracks = snapshot.docs.map((doc) => doc.data() as Track);
      setTopTracks(tracks);

      const recentQuery = query(
        collection(db, 'users', userId, 'history'),
        orderBy('lastPlayed', 'desc'),
        limit(5)
      );
      const recentSnap = await getDocs(recentQuery);
      setRecentTracks(recentSnap.docs.map((d) => d.data() as Track));

      // Generate top 5 artists from tracks
      const artistsMap = new Map<string, number>();
      tracks.forEach((t) => {
        if (Array.isArray(t.artist)) {
          t.artist.forEach((artistObj) => {
            const artistName = artistObj.name;
            artistsMap.set(artistName, (artistsMap.get(artistName) || 0) + 1);
          });
        } else if (typeof t.artist === 'string') {
          artistsMap.set(t.artist, (artistsMap.get(t.artist) || 0) + 1);
        }
      });

      const top5Artists = Array.from(artistsMap.entries())
        .sort((a, b) => b[1] - a[1]) // Sort by play count
        .slice(0, 5) // Take top 5
        .map(([artistName], index) => ({
          id: `artist-${index}`,
          title: artistName,
          imageUrl: `https://placehold.co/300x300/333/fff?text=${encodeURIComponent(artistName)}`,
          type: 'artist' as const,
        }));

      setTopArtists(top5Artists);
    };

    fetchProfileAndTop5();
  }, [userId]);

  return (
    <div className="container mx-auto space-y-6 px-4 py-6">
      <div className="flex items-center justify-between">
        <SectionTitle>{userProfile?.displayName || 'User'}’s Profile</SectionTitle>
        <div className="flex gap-2">
          {user?.uid === userId && (
            <Link href="/account" className="text-sm text-muted-foreground hover:underline">
              Edit Profile
            </Link>
          )}
          <BackButton />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm">{followers} Followers</span>
        <span className="text-sm">{following} Following</span>
        {user && user.uid !== userId && (
          <Button size="sm" onClick={handleFollow}>
            {isFollowing ? 'Unfollow' : 'Follow'}
          </Button>
        )}
      </div>

      {user?.uid === userId && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Switch
              id="showTopSongs"
              checked={settings.showTopSongs}
              onCheckedChange={(val) => handleToggle('showTopSongs', val)}
            />
            <label htmlFor="showTopSongs" className="text-sm">
              Show Top Songs
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="showTopArtists"
              checked={settings.showTopArtists}
              onCheckedChange={(val) => handleToggle('showTopArtists', val)}
            />
            <label htmlFor="showTopArtists" className="text-sm">
              Show Top Artists
            </label>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {settings.showTopSongs && <Top5Showcase title="Top Songs" items={topTracks} type="track" />}
        {settings.showTopArtists && (
          <Top5Showcase title="Top Artists" items={topArtists} type="artist" />
        )}
        {recentTracks.length > 0 && (
          <Top5Showcase title="Recently Played" items={recentTracks} type="track" />
        )}
      </div>
    </div>
  );
}
