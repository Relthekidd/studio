
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { mockAlbumsAndSingles, type AlbumFull, mockArtists, type ArtistFull } from '@/lib/mockData';
import SectionTitle from '@/components/SectionTitle';
import { Button } from '@/components/ui/button';
import { PlayCircle, ListMusic, CalendarDays, Info, PauseCircle } from 'lucide-react'; // Added PauseCircle
import { usePlayer } from '@/contexts/PlayerContext';
import { Badge } from '@/components/ui/badge';
import BackButton from '@/components/ui/BackButton';
import TrackActions from '@/components/music/TrackActions';
import { Card, CardContent } from '@/components/ui/card'; // Removed CardHeader, CardTitle as they aren't directly used for structure

<BackButton />
// Re-using TrackListItem from AlbumDetailPage for consistency
const TrackListItem = ({ track, onPlay, albumArtists }: { track: AlbumFull['tracklist'][0], onPlay: (track: AlbumFull['tracklist'][0]) => void, albumArtists: ArtistFull[] }) => {
  const { currentTrack, isPlaying, togglePlayPause } = usePlayer();
  const isCurrent = currentTrack?.id === track.id;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlayPause();
    } else {
      // Ensure track has album context for player
      onPlay({...track, artists: albumArtists.map(a => ({id: a.id, name: a.name})) });
    }
  };
  
  return (
    <div 
      className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors"
      onClick={handlePlayClick} // Main click on row plays the track
      role="button"
      tabIndex={0}
      aria-label={`Play ${track.title}`}
    >
      <div className="flex items-center gap-3">
        {track.trackNumber && <span className="text-sm text-muted-foreground w-5 text-center">{track.trackNumber}</span>}
        <div className="flex-grow">
          <p className={`font-medium ${isCurrent ? 'text-primary' : 'text-foreground'}`}>{track.title}</p>
          {/* Display primary artist of the track if different from album artist, or album artist */}
          <p className="text-xs text-muted-foreground">
            {track.artist || (albumArtists.length > 0 ? albumArtists.map(a => a.name).join(', ') : 'Various Artists')}
          </p>
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
      // A single can be an "album" type with few tracks, or explicitly "single" type
      if (foundSingle && (foundSingle.type === 'single' || (foundSingle.type === 'album' && foundSingle.tracklist?.length <= 3))) { 
        setSingle(foundSingle);
        const foundArtists = foundSingle.artistIds.map(id => mockArtists[id]).filter(Boolean) as ArtistFull[];
        setArtistsDetails(foundArtists);
      } else {
        console.warn(`Single with ID ${singleId} not found or is not a single.`);
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
        album: { id: single.id, name: single.title }, // Add album object
        albumId: single.id, // Add albumId
        // Ensure artists array for the player comes from the album/single context
        artists: artistsDetails.map(a => ({id: a.id, name: a.name})), 
     });
  };
  
  const handlePlayAll = () => {
    if (single.tracklist && single.tracklist.length > 0) {
      handlePlayTrack(single.tracklist[0]);
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

      {/* Display tracklist only if more than one track, or if it's an "album" type single */}
      {single.tracklist && single.tracklist.length > 0 && (single.tracklist.length > 1 || single.type === 'album') && (
        <>
          <SectionTitle id="tracklist-title">Tracklist</SectionTitle>
          <Card>
            <CardContent className="p-0">
              <div className="space-y-1">
                {single.tracklist.map((track) => (
                  <TrackListItem key={track.id} track={track} onPlay={handlePlayTrack} albumArtists={artistsDetails}/>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
       {/* If it's a single with only one track and type 'single', the main play button handles it. */}
    </div>
  );
}

