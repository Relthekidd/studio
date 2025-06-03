'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { collection, query, where, getDocs } from 'firebase/firestore';

import { db } from '@/lib/firebase';
import SectionTitle from '@/components/SectionTitle';
import { AlbumCard } from '@/components/AlbumCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DiscAlbum, Music, MicVocal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import type { Track } from '@/types/music';
import BackButton from '@/components/ui/BackButton';

export default function ArtistPage() {
  const { artistId } = useParams();
  const [albums, setAlbums] = useState<Track[]>([]);
  const [singles, setSingles] = useState<Track[]>([]);
  const [featuredTracks, setFeaturedTracks] = useState<Track[]>([]);
  const [artistProfile, setArtistProfile] = useState<any | null>(null);

  const decodedId = decodeURIComponent(artistId as string);

  useEffect(() => {
    const fetchData = async () => {
      const artistSnap = await getDocs(
        query(collection(db, 'artists'), where('id', '==', decodedId))
      );
      if (!artistSnap.empty) {
        setArtistProfile(artistSnap.docs[0].data());
      }

      const albumSnap = await getDocs(
        query(collection(db, 'albums'), where('artist', '==', decodedId))
      );
      setAlbums(
        albumSnap.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title || 'Untitled',
          artists: doc.data().artists || [{ id: '', name: doc.data().artist || decodedId }],
          genre: doc.data().genre || '',
          type: 'album' as const,
          audioURL: '',
          coverURL: doc.data().coverURL || '',
        }))
      );

      const singleSnap = await getDocs(
        query(collection(db, 'tracks'), where('artist', '==', decodedId))
      );
      setSingles(
        singleSnap.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title || 'Untitled',
          artists: doc.data().artists || [{ id: '', name: doc.data().artist || decodedId }],
          genre: doc.data().genre || '',
          type: 'track' as const,
          audioURL: doc.data().audioURL || doc.data().audioSrc || '',
          coverURL: doc.data().coverURL || doc.data().imageUrl || '',
        }))
      );

      const featuredSnap = await getDocs(
        query(collection(db, 'tracks'), where('artists', 'array-contains', decodedId))
      );
      const filtered = featuredSnap.docs
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || 'Untitled',
            artists: data.artists || [{ id: '', name: data.artist || '' }],
            genre: data.genre || '',
            type: 'track' as const,
            audioURL: data.audioURL || data.audioSrc || '',
            coverURL: data.coverURL || data.imageUrl || '',
          };
        })
        .filter((track) => !(track.artists[0]?.id === decodedId || track.artists[0]?.name === decodedId));
      setFeaturedTracks(filtered);
    };

    if (artistId) fetchData();
  }, [artistId, decodedId]);

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
              {artistProfile?.bio && (
                <p className="mt-2 text-sm text-muted-foreground">{artistProfile.bio}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

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
