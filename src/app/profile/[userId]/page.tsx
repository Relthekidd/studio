'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
  collection,
  getDocs,
  doc,
  onSnapshot,
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
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

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
    value: boolean
  ) => {
    if (typeof userId !== 'string' || user?.uid !== userId) return;
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await updateDoc(doc(db, 'profiles', userId), {
      customizations: newSettings,
    });
  };

  const fetchTopInfo = useCallback(async () => {
    if (typeof userId !== 'string') return;

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
    tracks.forEach((t: any) => {
      const trackArtists = t.artists ?? t.artist;
      if (Array.isArray(trackArtists)) {
        trackArtists.forEach((artistObj: any) => {
          const artistName = typeof artistObj === 'string' ? artistObj : artistObj.name;
          artistsMap.set(artistName, (artistsMap.get(artistName) || 0) + 1);
        });
      } else if (typeof trackArtists === 'string') {
        artistsMap.set(trackArtists, (artistsMap.get(trackArtists) || 0) + 1);
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
  }, [userId]);

  useEffect(() => {
    if (typeof userId !== 'string') return;

    const profileRef = doc(db, 'profiles', userId);
    const unsubProfile = onSnapshot(profileRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setUserProfile(data);
        setSettings((prev) => ({ ...prev, ...data.customizations }));
      }
    });

    const unsubFollowers = onSnapshot(collection(db, 'profiles', userId, 'followers'), (snap) => {
      setFollowers(snap.size);
      if (user?.uid) setIsFollowing(snap.docs.some((d) => d.id === user.uid));
    });

    const unsubFollowing = onSnapshot(collection(db, 'profiles', userId, 'following'), (snap) => {
      setFollowing(snap.size);
    });

    return () => {
      unsubProfile();
      unsubFollowers();
      unsubFollowing();
    };
  }, [userId, user]);

  useEffect(() => {
    fetchTopInfo();
    window.addEventListener('profileChange', fetchTopInfo);
    return () => window.removeEventListener('profileChange', fetchTopInfo);
  }, [fetchTopInfo]);

  return (
    <div className="container mx-auto space-y-6 px-4 py-6 md:space-y-8 md:py-10">
      <BackButton />

      <Card className="overflow-hidden shadow-xl">
        <div className="relative h-40 bg-gradient-to-r from-primary/20 to-accent/20 md:h-56" />
        <CardContent className="relative z-10 -mt-20 p-4 md:p-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
            <Avatar className="size-28 border-4 border-background shadow-lg md:size-36">
              <AvatarImage src={userProfile?.avatarURL || ''} alt={userProfile?.displayName} />
              <AvatarFallback>
                {userProfile?.displayName?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold md:text-4xl">
                {userProfile?.displayName || userId}
              </h1>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <span className="text-sm text-muted-foreground">{followers} Followers</span>
                <span className="text-sm text-muted-foreground">{following} Following</span>
                {user?.uid === userId && (
                  <Link href="/account" className="text-sm text-muted-foreground hover:underline">
                    Edit Profile
                  </Link>
                )}
                {user && user.uid !== userId && (
                  <Button size="sm" onClick={handleFollow}>
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </Button>
                )}
              </div>
              {userProfile?.bio && (
                <p className="mt-2 text-sm text-muted-foreground">{userProfile.bio}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

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
