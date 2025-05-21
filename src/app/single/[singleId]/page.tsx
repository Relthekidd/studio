
"use client";

// This page can be very similar to AlbumDetailPage for now,
// as a "single" in our mock data is essentially an album with 1 or few tracks.
// If you want a different layout or specific "single" metadata, this page can be customized.

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { mockAlbumsAndSingles, type AlbumFull, mockArtists, type ArtistFull } from '@/lib/mockData';
import SectionTitle from '@/components/SectionTitle';
import { Button } from '@/components/ui/button';
import { PlayCircle, ListMusic, CalendarDays, Info } from 'lucide-react';
import { usePlayer } from '@/contexts/PlayerContext';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Re-using TrackListItem from AlbumDetailPage for consistency
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

export default function SingleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { playTrack } = usePlayer();
  const [single, setSingle] = useState<AlbumFull | null>(null);
  const [artistsDetails, setArtistsDetails] = useState<ArtistFull[]>([]);

  const singleId = params.singleId as string;

  useEffect(() => {
    if (singleId) {
      const foundSingle = mockAlbumsAndSingles[singleId];
      if (foundSingle && (foundSingle.type === 'single' || foundSingle.tracklist?.length <= 2) ) { // check if it is a single or a short album
        setSingle(foundSingle);
        const foundArtists = foundSingle.artistIds.map(id => mockArtists[id]).filter(Boolean) as ArtistFull[];
        setArtistsDetails(foundArtists);
      } else {
        console.warn(`Single or short album with ID ${singleId} not found.`);
        // router.push('/404'); 
      }
    }
  }, [singleId, router]);

  if (!single) {
    return <div className="container mx-auto p-6 text-center">Loading single details...</div>;
  }

  const handlePlayTrack = (track: AlbumFull['tracklist'][0]) => {
     playTrack({
        ...track,
        album: single.title,
     });
  };
  
  const handlePlayAll = () => {
    if (single.tracklist && single.tracklist.length > 0) {
      handlePlayTrack(single.tracklist[0]);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
      <Card className="overflow-hidden shadow-xl">
        <div className="md:flex">
          <div className="md:flex-shrink-0 md:w-1/3 relative">
            <div className="aspect-square w-full">
              <Image
                src={single.imageUrl}
                alt={single.title}
                fill
                className="object-cover"
                unoptimized
                data-ai-hint={single.dataAiHint || 'single artwork'}
              />
            </div>
          </div>
          <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
            <div>
              <Badge variant="outline" className="mb-2 text-xs">Single</Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">{single.title}</h1>
              <div className="mt-2 mb-4">
                {artistsDetails.map(artist => (
                  <Link key={artist.id} href={`/artist/${artist.id}`} legacyBehavior>
                    <a className="text-lg text-muted-foreground hover:text-primary transition-colors mr-2">{artist.name}</a>
                  </Link>
                ))}
              </div>
              <div className="flex items-center text-sm text-muted-foreground gap-4 mb-4">
                {single.releaseDate && (
                  <span className="flex items-center"><CalendarDays size={14} className="mr-1.5" /> Released: {new Date(single.releaseDate).toLocaleDateString()}</span>
                )}
                {single.tracklist && (
                  <span className="flex items-center"><ListMusic size={14} className="mr-1.5" /> {single.tracklist.length} track(s)</span>
                )}
              </div>
               {single.credits && (
                <p className="text-xs text-muted-foreground/80 mb-4"><Info size={12} className="inline mr-1" /> {single.credits}</p>
              )}
            </div>
            <Button onClick={handlePlayAll} size="lg" className="w-full md:w-auto mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">
              <PlayCircle size={20} className="mr-2" /> Play {single.tracklist.length > 1 ? "All" : "Track"}
            </Button>
          </div>
        </div>
      </Card>

      {single.tracklist && single.tracklist.length > 1 && (
        <>
          <SectionTitle id="tracklist-title">Tracklist</SectionTitle>
          <Card>
            <CardContent className="p-0">
              <div className="space-y-1">
                {single.tracklist.map((track) => (
                  <TrackListItem key={track.id} track={track} onPlay={handlePlayTrack} />
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

    