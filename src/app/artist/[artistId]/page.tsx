
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { mockArtists, type ArtistFull, getMultipleAlbumsByIds, getMultipleTracksByIds } from '@/lib/mockData';
import type { Track as PlayerTrack } from '@/contexts/PlayerContext';
import SectionTitle from '@/components/SectionTitle';
import AlbumCard from '@/components/AlbumCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DiscAlbum, Music, MicVocal } from 'lucide-react'; // MicVocal for featured on

export default function ArtistProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [artist, setArtist] = useState<ArtistFull | null>(null);
  const [albums, setAlbums] = useState<PlayerTrack[]>([]);
  const [singles, setSingles] = useState<PlayerTrack[]>([]);
  const [featuredTracks, setFeaturedTracks] = useState<PlayerTrack[]>([]);

  const artistId = params.artistId as string;

  useEffect(() => {
    if (artistId) {
      const foundArtist = mockArtists[artistId];
      if (foundArtist) {
        setArtist(foundArtist);
        setAlbums(getMultipleAlbumsByIds(foundArtist.albums).map(a => ({...a, artist: a.artistsDisplay} as PlayerTrack) ));
        setSingles(getMultipleAlbumsByIds(foundArtist.singles).map(s => ({...s, artist: s.artistsDisplay} as PlayerTrack) ));
        setFeaturedTracks(getMultipleTracksByIds(foundArtist.featuredOn));
      } else {
        console.warn(`Artist with ID ${artistId} not found.`);
        // router.push('/404');
      }
    }
  }, [artistId, router]);

  if (!artist) {
    return <div className="container mx-auto p-6 text-center">Loading artist profile...</div>;
  }

  const renderSection = (title: string, items: PlayerTrack[], icon: React.ReactNode, emptyMessage: string) => {
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
    <div className="container mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
      <Card className="overflow-hidden shadow-xl">
        <div className="relative h-40 md:h-56 bg-gradient-to-r from-primary/20 to-accent/20">
           {/* Placeholder for a potential artist banner */}
           <Image src={`https://placehold.co/1200x400/${artist.imageUrl.split('/')[4]}/${artist.imageUrl.split('/')[5].split('.')[0]}.png?text=`} alt={`${artist.name} banner`} layout="fill" objectFit="cover" data-ai-hint="music stage lights" unoptimized />
        </div>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16 sm:-mt-20 relative z-10">
            <Avatar className="h-28 w-28 md:h-36 md:w-36 border-4 border-background shadow-lg">
              <AvatarImage src={artist.imageUrl} alt={artist.name} data-ai-hint={artist.dataAiHint} />
              <AvatarFallback>{artist.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">{artist.name}</h1>
              {/* TODO: Add follower counts, verified badge etc. */}
            </div>
            {/* TODO: Add Follow button for non-self profiles */}
          </div>
          {artist.bio && <p className="mt-4 text-sm text-foreground/90 max-w-2xl">{artist.bio}</p>}
        </CardContent>
      </Card>

      <Tabs defaultValue="albums" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 mb-6 bg-card border border-border">
          <TabsTrigger value="albums"><DiscAlbum size={16} className="mr-2" />Albums</TabsTrigger>
          <TabsTrigger value="singles"><Music size={16} className="mr-2" />Singles</TabsTrigger>
          <TabsTrigger value="featured"><MicVocal size={16} className="mr-2" />Appears On</TabsTrigger>
        </TabsList>

        <TabsContent value="albums">
          <SectionTitle id="artist-albums-title" className="text-xl sr-only">Albums by {artist.name}</SectionTitle>
          {renderSection("Albums", albums, <DiscAlbum size={36} />, `${artist.name} hasn't released any albums yet.`)}
        </TabsContent>

        <TabsContent value="singles">
          <SectionTitle id="artist-singles-title" className="text-xl sr-only">Singles by {artist.name}</SectionTitle>
          {renderSection("Singles", singles, <Music size={36} />, `${artist.name} hasn't released any singles yet.`)}
        </TabsContent>
        
        <TabsContent value="featured">
          <SectionTitle id="artist-featured-title" className="text-xl sr-only">Featuring {artist.name}</SectionTitle>
          {renderSection("Appears On", featuredTracks, <MicVocal size={36} />, `${artist.name} hasn't been featured on any tracks yet.`)}
        </TabsContent>
      </Tabs>
    </div>
  );
}

    