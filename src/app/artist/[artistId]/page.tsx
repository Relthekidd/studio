'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

import { db } from '@/lib/firebase';
import SectionTitle from '@/components/SectionTitle';
import { AlbumCard } from '@/components/AlbumCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DiscAlbum, Music, MicVocal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import type { Track } from '@/types/music';
import BackButton from '@/components/ui/BackButton';
import { formatArtists } from '@/utils/formatArtists';
import { useAuth } from '@/contexts/AuthProvider';
import { followArtist, unfollowArtist } from '@/utils/followArtist';
import { Button } from '@/components/ui/button';

export default function ArtistPage() {
  const { artistId } = useParams();
  const [albums, setAlbums] = useState<Track[]>([]);
  const [singles, setSingles] = useState<Track[]>([]);
  const [featuredTracks, setFeaturedTracks] = useState<Track[]>([]);
  const [topSongs, setTopSongs] = useState<Track[]>([]);
  const [artistProfile, setArtistProfile] = useState<any | null>(null);
  const [followers, setFollowers] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const { user } = useAuth();

  const decodedId = decodeURIComponent(artistId as string);

  useEffect(() => {
    if (!artistId) return;

    const artistQuery = query(collection(db, 'artists'), where('id', '==', decodedId));
    const unsubArtist = onSnapshot(artistQuery, (snap) => {
      if (!snap.empty) setArtistProfile(snap.docs[0].data());
    });

    const albumQuery = query(
      collection(db, 'albums'),
      where('artistIds', 'array-contains', decodedId)
    );
    const unsubAlbums = onSnapshot(albumQuery, (snap) => {
      setAlbums(
        snap.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title || 'Untitled',
          artists: doc.data().artists || [{ id: '', name: 'Unknown Artist' }],
          genre: doc.data().genre || '',
          type: 'album' as const,
          audioURL: '',
          coverURL: doc.data().coverURL || '',
        }))
      );
    });

    const singleQuery = query(
      collection(db, 'songs'),
      where('artistIds', 'array-contains', decodedId),
      where('type', '==', 'single')
    );
    const unsubSingles = onSnapshot(singleQuery, (snap) => {
      setSingles(
        snap.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title || 'Untitled',
          artists: doc.data().artists || [{ id: '', name: doc.data().artist || decodedId }],
          genre: doc.data().genre || '',
          type: 'track' as const,
          audioURL: doc.data().audioURL || doc.data().audioSrc || '',
          coverURL: doc.data().coverURL || doc.data().imageUrl || '',
        }))
      );
    });

    const featuredQuery = query(collection(db, 'songs'), where('artistIds', 'array-contains', decodedId));
    const unsubFeatured = onSnapshot(featuredQuery, (snap) => {
      const filtered = snap.docs
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || 'Untitled',
            artists: data.artists || [{ id: '', name: 'Unknown Artist' }],
            genre: data.genre || '',
            type: 'track' as const,
            audioURL: data.audioURL || data.audioSrc || '',
            coverURL: data.coverURL || data.imageUrl || '',
          };
        })
        .filter((track) => !(track.artists[0]?.id === decodedId || track.artists[0]?.name === decodedId));
      setFeaturedTracks(filtered);
    });

    const topQuery = query(collection(db, 'songs'), where('artistIds', 'array-contains', decodedId));
    const unsubTop = onSnapshot(topQuery, (snap) => {
      const songs = snap.docs
        .map((d) => d.data() as Track)
        .sort((a, b) => (b as any).streams - (a as any).streams)
        .slice(0, 10);
      setTopSongs(songs);
    });

    const followersQuery = collection(db, 'artists', decodedId, 'followers');
    const unsubFollowers = onSnapshot(followersQuery, (snap) => {
      setFollowers(snap.size);
      if (user?.uid) setIsFollowing(snap.docs.some((d) => d.id === user.uid));
    });

    return () => {
      unsubArtist();
      unsubAlbums();
      unsubSingles();
      unsubFeatured();
      unsubTop();
      unsubFollowers();
    };
  }, [artistId, decodedId, user]);

  const handleFollow = async () => {
    if (!user) return;
    if (isFollowing) {
      await unfollowArtist(user.uid, decodedId);
    } else {
      await followArtist(user.uid, decodedId);
    }
    setIsFollowing(!isFollowing);
  };

  const renderSection = (items: Track[], emptyMessage: string, icon: React.ReactNode) => {
    if (items.length === 0) {
      return (
        <div className="py-8 text-center text-muted-foreground">
          <div className="mb-2 inline-block rounded-full bg-muted p-3">{icon}</div>
          <p>{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6 lg:grid-cols-5">
        {items.map((item) => (
          <AlbumCard key={item.id} item={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto space-y-6 px-4 py-6 md:space-y-8 md:py-10">
      <BackButton />

      <Card className="overflow-hidden shadow-xl">
        <div className="relative h-40 bg-gradient-to-r from-primary/20 to-accent/20 md:h-56" />

        <CardContent className="relative z-10 -mt-20 p-4 md:p-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
            <Avatar className="size-28 border-4 border-background shadow-lg md:size-36">
              <AvatarImage src={artistProfile?.imageUrl || ''} alt={artistProfile?.name} />
              <AvatarFallback>{artistProfile?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold md:text-4xl">{artistProfile?.name || decodedId}</h1>
              <div className="mt-2 flex items-center justify-center gap-2 sm:justify-start">
                <span className="text-sm text-muted-foreground">{followers} followers</span>
                {user && (
                  <Button size="sm" onClick={() => handleFollow()}>
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </Button>
                )}
              </div>
              {artistProfile?.bio && (
                <p className="mt-2 text-sm text-muted-foreground">{artistProfile.bio}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {topSongs.length > 0 && (
        <div>
          <SectionTitle>Top Songs</SectionTitle>
          <div className="space-y-2">
            {topSongs.map((song) => (
              <div key={song.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{song.title}</p>
                  <p className="text-xs text-muted-foreground">{formatArtists(song.artists)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Tabs defaultValue="albums">
        <TabsList className="mb-6 grid w-full grid-cols-2 border border-border bg-card md:grid-cols-3">
          <TabsTrigger value="albums">
            <DiscAlbum className="mr-2 size-4" />
            Albums
          </TabsTrigger>
          <TabsTrigger value="singles">
            <Music className="mr-2 size-4" />
            Singles
          </TabsTrigger>
          <TabsTrigger value="featured">
            <MicVocal className="mr-2 size-4" />
            Appears On
          </TabsTrigger>
        </TabsList>

        <TabsContent value="albums">
          <SectionTitle>Albums</SectionTitle>
          {renderSection(albums, 'No albums yet.', <DiscAlbum size={36} />)}
        </TabsContent>

        <TabsContent value="singles">
          <SectionTitle>Singles</SectionTitle>
          {renderSection(singles, 'No singles released.', <Music size={36} />)}
        </TabsContent>

        <TabsContent value="featured">
          <SectionTitle>Appears On</SectionTitle>
          {renderSection(featuredTracks, 'No features found.', <MicVocal size={36} />)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
