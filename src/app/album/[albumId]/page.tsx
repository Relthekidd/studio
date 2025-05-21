
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { mockAlbumsAndSingles, type AlbumFull, mockArtists, type ArtistFull } from '@/lib/mockData';
import SectionTitle from '@/components/SectionTitle';
import { Button } from '@/components/ui/button';
import { PlayCircle, ListMusic, Users, CalendarDays, Info } from 'lucide-react';
import { usePlayer } from '@/contexts/PlayerContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// A new component for displaying a single track in a list
const TrackListItem = ({ track, onPlay }: { track: AlbumFull['tracklist'][0], onPlay: (track: AlbumFull['tracklist'][0]) => void }) => {
  const { currentTrack, isPlaying, togglePlayPause } = usePlayer();
  const isCurrent = currentTrack?.id === track.id;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlayPause();
    } else {
      onPlay(track);
    }
  };
  
  return (
    <div 
      className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors"
      onClick={handlePlayClick}
      role="button"
      tabIndex={0}
      aria-label={`Play ${track.title}`}
    >
      <div className="flex items-center gap-3">
        {track.trackNumber && <span className="text-sm text-muted-foreground w-5 text-center">{track.trackNumber}</span>}
        <div className="flex-grow">
          <p className={`font-medium ${isCurrent ? 'text-primary' : 'text-foreground'}`}>{track.title}</p>
          {track.artist && <p className="text-xs text-muted-foreground">{track.artist}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {track.duration && <span className="text-xs text-muted-foreground">{Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}</span>}
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handlePlayClick}>
          {isCurrent && isPlaying ? <PauseCircle size={20} className="text-primary" /> : <PlayCircle size={20} />}
        </Button>
      </div>
    </div>
  );
};


export default function AlbumDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { playTrack } = usePlayer();
  const [album, setAlbum] = useState<AlbumFull | null>(null);
  const [artistsDetails, setArtistsDetails] = useState<ArtistFull[]>([]);

  const albumId = params.albumId as string;

  useEffect(() => {
    if (albumId) {
      const foundAlbum = mockAlbumsAndSingles[albumId];
      if (foundAlbum) {
        setAlbum(foundAlbum);
        const foundArtists = foundAlbum.artistIds.map(id => mockArtists[id]).filter(Boolean) as ArtistFull[];
        setArtistsDetails(foundArtists);
      } else {
        // Handle album not found, e.g., redirect to a 404 page or show a message
        console.warn(`Album with ID ${albumId} not found.`);
        // router.push('/404'); // Example redirect
      }
    }
  }, [albumId, router]);

  if (!album) {
    return <div className="container mx-auto p-6 text-center">Loading album details...</div>;
  }

  const handlePlayTrack = (track: AlbumFull['tracklist'][0]) => {
    // The track from tracklist might be missing some album-level details if not properly structured
    // We ensure it has what PlayerContext needs, or use AlbumCard to play if more suitable
     playTrack({
        ...track, // Spread existing track properties
        album: album.title, // Add album title
        // artists: track.artists || album.artists, // Ensure artists array is present
        // audioSrc will be on the track object from tracklist
     });
  };
  
  const handlePlayAll = () => {
    if (album.tracklist && album.tracklist.length > 0) {
      // Play the first track, potentially pass the rest of the tracklist as a queue
      handlePlayTrack(album.tracklist[0]);
      // TODO: Implement queueing for play all
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
      <Card className="overflow-hidden shadow-xl">
        <div className="md:flex">
          <div className="md:flex-shrink-0 md:w-1/3 relative">
            <div className="aspect-square w-full">
              <Image
                src={album.imageUrl}
                alt={album.title}
                fill
                className="object-cover"
                unoptimized
                data-ai-hint={album.dataAiHint || (album.type === 'album' ? 'album artwork' : 'single artwork')}
              />
            </div>
          </div>
          <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
            <div>
              <Badge variant="outline" className="mb-2 text-xs">{album.type === 'album' ? 'Album' : 'Single'}</Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">{album.title}</h1>
              <div className="mt-2 mb-4">
                {artistsDetails.map(artist => (
                  <Link key={artist.id} href={`/artist/${artist.id}`} legacyBehavior>
                    <a className="text-lg text-muted-foreground hover:text-primary transition-colors mr-2">{artist.name}</a>
                  </Link>
                ))}
              </div>
              <div className="flex items-center text-sm text-muted-foreground gap-4 mb-4">
                {album.releaseDate && (
                  <span className="flex items-center"><CalendarDays size={14} className="mr-1.5" /> Released: {new Date(album.releaseDate).toLocaleDateString()}</span>
                )}
                {album.tracklist && (
                  <span className="flex items-center"><ListMusic size={14} className="mr-1.5" /> {album.tracklist.length} tracks</span>
                )}
              </div>
               {album.credits && (
                <p className="text-xs text-muted-foreground/80 mb-4"><Info size={12} className="inline mr-1" /> {album.credits}</p>
              )}
            </div>
            <Button onClick={handlePlayAll} size="lg" className="w-full md:w-auto mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">
              <PlayCircle size={20} className="mr-2" /> Play All
            </Button>
          </div>
        </div>
      </Card>

      <SectionTitle id="tracklist-title">Tracklist</SectionTitle>
      <Card>
        <CardContent className="p-0">
          {album.tracklist && album.tracklist.length > 0 ? (
            <div className="space-y-1">
              {album.tracklist.map((track) => (
                <TrackListItem key={track.id} track={track} onPlay={handlePlayTrack} />
              ))}
            </div>
          ) : (
            <p className="p-6 text-muted-foreground">No tracks found for this {album.type}.</p>
          )}
        </CardContent>
      </Card>

      {/* TODO: Add sections for "More by [Artist]" or "Related Albums" */}
    </div>
  );
}

    