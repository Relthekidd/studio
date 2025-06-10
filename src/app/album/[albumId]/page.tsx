'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, ListMusic, Info, PlayCircle } from 'lucide-react';
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { usePlayerStore } from '@/features/player/store';
import type { Track, Artist } from '@/types/music';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/ui/BackButton';
import { Card } from '@/components/ui/card';
import { normalizeTrack } from '@/utils/normalizeTrack';
import { DEFAULT_COVER_URL } from '@/utils/helpers';
import TrackListItem from '@/components/music/TrackListItem';

interface Album {
  id: string;
  title: string;
  coverURL: string;
  description?: string;
  releaseDate?: string;
  credits?: string;
  artistIds: string[];
  mainArtistIds: string[];
  tags?: string[];
  genre?: string;
  type: 'album';
}

export default function AlbumPage() {
  const { albumId } = useParams();
  const searchParams = useSearchParams();
  const highlightedTrackId = searchParams.get('track');
  const [album, setAlbum] = useState<Album | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [mainArtists, setMainArtists] = useState<Artist[]>([]);
  const setCurrentTrack = usePlayerStore((s) => s.setCurrentTrack);
  const setIsPlaying = usePlayerStore((s) => s.setIsPlaying);
  const setQueue = usePlayerStore((s) => s.setQueue);

  useEffect(() => {
    const fetchData = async () => {
      if (!albumId) return;

      try {
        const albumDocRef = doc(db, 'albums', String(albumId));
        const albumDocSnap = await getDoc(albumDocRef);

        if (albumDocSnap.exists()) {
          const albumData = albumDocSnap.data();

          const mainArtistIds = albumData.mainArtistIds || []; // Main artists

          let fetchedMainArtists: Artist[] = [];

          // Fetch main artists
          if (mainArtistIds.length > 0) {
            const mainArtistQuery = query(collection(db, 'artists'), where('id', 'in', mainArtistIds));
            const mainArtistSnap = await getDocs(mainArtistQuery);
            fetchedMainArtists = mainArtistSnap.docs.map((doc) => ({
              id: doc.id,
              name: doc.data().name || 'Unknown Artist',
              coverURL: doc.data().coverURL || DEFAULT_COVER_URL, // Ensure coverURL is included
            }));
          }

          // Fetch tracks
          const trackSnap = await getDocs(collection(db, 'albums', String(albumId), 'songs'));

          const fetchedTracks: Track[] = trackSnap.docs
            .map((doc) => normalizeTrack(doc, fetchedMainArtists))
            .sort((a, b) => (a.order || 0) - (b.order || 0)); // Sort by order

          setMainArtists(fetchedMainArtists);
          setTracks(fetchedTracks);

          setAlbum({
            id: albumDocSnap.id,
            title: albumData.title,
            coverURL: albumData.coverURL || DEFAULT_COVER_URL,
            description: albumData.description || '',
            releaseDate: albumData.releaseDate,
            credits: albumData.credits || '',
            artistIds: albumData.artistIds || [],
            mainArtistIds: albumData.mainArtistIds || [],
            tags: albumData.tags || [],
            genre: albumData.genre || 'Unknown Genre',
            type: 'album',
          });
        } else {
          console.error('Album not found in Firestore');
        }
      } catch (error) {
        console.error('Error fetching album details:', error);
      }
    };

    fetchData();
  }, [albumId]);

  const handlePlayTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handlePlayAlbum = () => {
    if (tracks.length === 0) return;
    setQueue(tracks);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!highlightedTrackId) return;
    const el = document.getElementById(`track-${highlightedTrackId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightedTrackId, tracks]);

  if (!album) return <div className="container mx-auto p-6 text-center">Loading album...</div>;

  return (
    <div className="container mx-auto space-y-6 p-4 md:space-y-8 md:p-6">
      <BackButton />
      <Card className="overflow-hidden shadow-xl">
        <div className="md:flex">
          <div className="relative md:w-1/3">
            <div className="aspect-square w-full">
              <Image
                src={album.coverURL}
                alt={`Cover art for ${album.title}`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-between p-6 md:p-8">
            <div>
              <Badge variant="outline" className="mb-2 text-xs">
                Album
              </Badge>

              <h1 className="text-3xl font-bold text-foreground md:text-4xl">{album.title}</h1>

              {/* Main Artists */}
              <div className="mb-4 mt-2">
                {mainArtists.length > 0 ? (
                  mainArtists.map((artist) => (
                    <Button
                      key={artist.id}
                      asChild
                      variant="link"
                      className="mr-2 text-lg text-muted-foreground transition-colors hover:text-primary"
                    >
                      <Link
                        href={`/artist/${artist.id}`}
                        aria-label={`View artist profile for ${artist.name}`}
                      >
                        {artist.name}
                      </Link>
                    </Button>
                  ))
                ) : (
                  <p className="text-muted-foreground">Unknown Artist</p>
                )}
              </div>

              <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
                {album.releaseDate && (
                  <span className="flex items-center">
                    <CalendarDays size={14} className="mr-1.5" /> Released:{' '}
                    {new Date(album.releaseDate).toLocaleDateString()}
                  </span>
                )}

                {tracks && (
                  <span className="flex items-center">
                    <ListMusic size={14} className="mr-1.5" /> {tracks.length} track(s)
                  </span>
                )}
              </div>

              {album.credits && (
                <p className="mb-4 text-xs text-muted-foreground/80">
                  <Info size={12} className="mr-1 inline" /> {album.credits}
                </p>
              )}

              {album.description && (
                <p className="mb-4 text-xs text-muted-foreground/80">{album.description}</p>
              )}

              <div className="mb-4 text-xs text-muted-foreground/80">
                <span>Genre: {album.genre}</span>
                {album.tags && album.tags.length > 0 && (
                  <span className="ml-4">Tags: {album.tags.join(', ')}</span>
                )}
              </div>
            </div>

            <Button
              onClick={handlePlayAlbum}
              size="lg"
              className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90 md:w-auto"
              aria-label={`Play ${album.title} from start`}
            >
              <PlayCircle size={20} className="mr-2" /> Play Album
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="space-y-1">
          {tracks.map((track) => (
            <TrackListItem
              key={track.id}
              id={`track-${track.id}`}
              highlight={track.id === highlightedTrackId}
              track={track}
              onPlay={handlePlayTrack}
              coverURL={album.coverURL}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
