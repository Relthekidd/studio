'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';

import { db } from '@/lib/firebase';
import SectionTitle from '@/components/SectionTitle';
import AlbumCard from '@/components/AlbumCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DiscAlbum, Music, MicVocal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import type { Track } from '@/contexts/PlayerContext';
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
      setAlbums(albumSnap.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title || 'Untitled',
        imageUrl: doc.data().imageUrl || '',
        artist: doc.data().artist || decodedId,
        genre: doc.data().genre || '',
        type: 'album' as const,
      })));

      const singleSnap = await getDocs(
        query(collection(db, 'tracks'), where('artist', '==', decodedId))
      );
      setSingles(singleSnap.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title || 'Untitled',
        imageUrl: doc.data().imageUrl || '',
        artist: doc.data().artist || decodedId,
        audioSrc: doc.data().audioSrc || '',
        genre: doc.data().genre || '',
        type: 'track' as const,
      })));

      const featuredSnap = await getDocs(
        query(collection(db, 'tracks'), where('artists', 'array-contains', decodedId))
      );
      const filtered = featuredSnap.docs
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || 'Untitled',
            imageUrl: data.imageUrl || '',
            artist: data.artist || '',
            audioSrc: data.audioSrc || '',
            genre: data.genre || '',
            type: 'track' as const,
          };
        })
        .filter(track => track.artist !== decodedId);
      setFeaturedTracks(filtered);
    };

    if (artistId) fetchData();
  }, [artistId]);

  const renderSection = (
    items: Track[],
    emptyMessage: string,
    icon: React.ReactNode
  ) => {
    if (items.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <div className="inline-block bg-muted p-3 rounded-full mb-2">{icon}</div>
          <p>{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {items.map(item => (
          <AlbumCard key={item.id} item={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-10 space-y-6 md:space-y-8">
      <BackButton />

      <Card className="overflow-hidden shadow-xl">
        <div className="relative h-40 md:h-56 bg-gradient-to-r from-primary/20 to-accent/20" />

        <CardContent className="p-4 md:p-6 -mt-20 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
            <Avatar className="h-28 w-28 md:h-36 md:w-36 border-4 border-background shadow-lg">
              <AvatarImage
                src={artistProfile?.imageUrl || ''}
                alt={artistProfile?.name}
              />
              <AvatarFallback>
                {artistProfile?.name?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="text-center sm:text-left">
              <h1 className="text-3xl md:text-4xl font-bold">
                {artistProfile?.name || decodedId}
              </h1>
              {artistProfile?.bio && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {artistProfile.bio}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="albums">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 mb-6 bg-card border border-border">
          <TabsTrigger value="albums">
            <DiscAlbum className="mr-2 h-4 w-4" />
            Albums
          </TabsTrigger>
          <TabsTrigger value="singles">
            <Music className="mr-2 h-4 w-4" />
            Singles
          </TabsTrigger>
          <TabsTrigger value="featured">
            <MicVocal className="mr-2 h-4 w-4" />
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
