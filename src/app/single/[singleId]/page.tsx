'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, ListMusic, Info, PlayCircle } from 'lucide-react';
import { usePlayerStore } from '@/features/player/store';
import type { Track, Artist } from '@/types/music';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/ui/BackButton';
import AddToPlaylistModal from '@/components/playlists/AddToPlaylistModal';
import { Card } from '@/components/ui/card';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '@/lib/firebase';
import { normalizeTrack } from '@/utils/normalizeTrack';
import { DEFAULT_COVER_URL } from '@/utils/helpers';
import { useToast } from '@/hooks/use-toast';

type Single = {
  id: string;
  title: string;
  coverURL: string;
  releaseDate?: string;
  tracklist: Track[];
  credits?: string;
  artistIds: string[];
  mainArtistIds: string[];
  tags?: string[];
  genre?: string;
  type: 'single' | 'album';
};

export default function SingleDetailPage() {
  const params = useParams();
  const setCurrentTrack = usePlayerStore((s) => s.setCurrentTrack);
  const setIsPlaying = usePlayerStore((s) => s.setIsPlaying);
  const setQueue = usePlayerStore((s) => s.setQueue);
  const addTracksToQueue = usePlayerStore((s) => s.addTracksToQueue);
  const { toast } = useToast();
  const [single, setSingle] = useState<Single | null>(null);
  const [mainArtists, setMainArtists] = useState<Artist[]>([]);
  const [featuredArtists, setFeaturedArtists] = useState<Artist[]>([]);

  const singleId = params.singleId as string;

  useEffect(() => {
    const fetchData = async () => {
      if (!singleId) return;

      try {
        const singleDocRef = doc(db, 'songs', singleId);
        const singleDocSnap = await getDoc(singleDocRef);

        if (singleDocSnap.exists()) {
          const singleData = singleDocSnap.data();

          const mainArtistIds = singleData.mainArtistIds || [];
          const allArtistIds = singleData.artistIds || [];
          const featuredArtistIds = allArtistIds.filter(
            (id: string) => !mainArtistIds.includes(id)
          );

          let fetchedMainArtists: Artist[] = [];
          let fetchedFeaturedArtists: Artist[] = [];

          // Fetch main artists
          if (mainArtistIds.length > 0) {
            const mainArtistQuery = query(
              collection(db, 'artists'),
              where('id', 'in', mainArtistIds)
            );
            const mainArtistSnap = await getDocs(mainArtistQuery);
            fetchedMainArtists = mainArtistSnap.docs.map((doc) => ({
              id: doc.id,
              name: doc.data().name || 'Unknown Artist',
              coverURL: doc.data().coverURL || DEFAULT_COVER_URL, // Ensure coverURL is included
            }));
          }

          // Fetch featured artists
          if (featuredArtistIds.length > 0) {
            const featuredArtistQuery = query(
              collection(db, 'artists'),
              where('id', 'in', featuredArtistIds)
            );
            const featuredArtistSnap = await getDocs(featuredArtistQuery);
            fetchedFeaturedArtists = featuredArtistSnap.docs.map((doc) => ({
              id: doc.id,
              name: doc.data().name || 'Unknown Artist',
              coverURL: doc.data().coverURL || DEFAULT_COVER_URL, // Ensure coverURL is included
            }));
          }

          // Normalize tracklist. If no tracklist exists, treat the document
          // itself as a single track.
          const normalizedTracklist =
            Array.isArray(singleData.tracklist) && singleData.tracklist.length > 0
              ? singleData.tracklist
                  .filter((track) => track && typeof track === 'object')
                  .map((track) =>
                    normalizeTrack(track, [...fetchedMainArtists, ...fetchedFeaturedArtists])
                  )
              : [
                  normalizeTrack({ id: singleDocSnap.id, ...singleData }, [
                    ...fetchedMainArtists,
                    ...fetchedFeaturedArtists,
                  ]),
                ];

          setMainArtists(fetchedMainArtists);
          setFeaturedArtists(fetchedFeaturedArtists);

          setSingle({
            id: singleDocSnap.id,
            title: singleData.title,
            coverURL: singleData.coverURL || DEFAULT_COVER_URL,
            releaseDate: singleData.releaseDate,
            tracklist: normalizedTracklist,
            credits: singleData.credits || '',
            artistIds: singleData.artistIds || [],
            mainArtistIds: singleData.mainArtistIds || [],
            tags: singleData.tags || [],
            genre: singleData.genre || 'Unknown Genre',
            type: singleData.type || 'single',
          });
        } else {
          console.error('Single not found in Firestore');
        }
      } catch (error) {
        console.error('Error fetching single details:', error);
      }
    };

    fetchData();
  }, [singleId]);

  const handlePlayTrack = (track: Track | undefined) => {
    if (!track) {
      console.error('handlePlayTrack called with undefined track');
      return;
    }

    if (single?.tracklist) setQueue(single.tracklist);
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  if (!single) {
    return <div className="container mx-auto p-6 text-center">Loading single details...</div>;
  }

  return (
    <div className="container mx-auto space-y-6 p-4 md:space-y-8 md:p-6">
      <BackButton />
      <Card className="overflow-hidden shadow-xl">
        <div className="md:flex">
          {/* Cover Image */}
          <div className="relative md:w-1/3">
            <div className="aspect-square w-full">
              <Image
                src={single.coverURL}
                alt={`Cover art for ${single.title}`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>

          {/* Single Details */}
          <div className="flex flex-1 flex-col justify-between p-6 md:p-8">
            <div>
              {/* Badge for Single Type */}
              <Badge variant="outline" className="mb-2 text-xs">
                {single.type === 'album' ? 'Album' : 'Single'}
              </Badge>

              {/* Single Title */}
              <h1 className="text-3xl font-bold text-foreground md:text-4xl">{single.title}</h1>

              {/* Main Artists */}
              <div className="mb-4 mt-2">
                {mainArtists.map((artist) => (
                  <Link
                    key={artist.id}
                    href={`/artist/${artist.id}`}
                    className="mr-2 text-lg text-muted-foreground transition-colors hover:text-primary"
                    aria-label={`View artist profile for ${artist.name}`}
                  >
                    {artist.name}
                  </Link>
                ))}
              </div>

              {/* Featured Artists */}
              {featuredArtists.length > 0 && (
                <div className="mb-4">
                  <h2 className="text-sm font-semibold text-muted-foreground">
                    Featuring Artists:
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {featuredArtists.map((artist) => (
                      <Link
                        key={artist.id}
                        href={`/artist/${artist.id}`}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                        aria-label={`View artist profile for ${artist.name}`}
                      >
                        {artist.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Information */}
              <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
                {/* Release Date */}
                {single.releaseDate && (
                  <span className="flex items-center">
                    <CalendarDays size={14} className="mr-1.5" /> Released:{' '}
                    {new Date(single.releaseDate).toLocaleDateString()}
                  </span>
                )}

                {/* Track Count */}
                {single.tracklist && (
                  <span className="flex items-center">
                    <ListMusic size={14} className="mr-1.5" /> {single.tracklist.length} track(s)
                  </span>
                )}
              </div>

              {/* Credits */}
              {single.credits && (
                <p className="mb-4 text-xs text-muted-foreground/80">
                  <Info size={12} className="mr-1 inline" /> {single.credits}
                </p>
              )}

              {/* Tags and Genre */}
              <div className="mb-4 text-xs text-muted-foreground/80">
                <span>Genre: {single.genre}</span>
                {single.tags && single.tags.length > 0 && (
                  <span className="ml-4">Tags: {single.tags.join(', ')}</span>
                )}
              </div>
            </div>

            {/* Play Button */}
            <Button
              onClick={() => {
                if (single.tracklist && single.tracklist.length > 0) {
                  const firstTrack = single.tracklist[0];
                  if (firstTrack.audioURL) {
                    handlePlayTrack(firstTrack);
                  } else {
                    console.error('Track has no audioURL');
                  }
                } else {
                  console.error('No tracks available to play');
                }
              }}
              size="lg"
              className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90 md:w-auto"
              aria-label={`Play the first track from ${single.title}`}
            >
              <PlayCircle size={20} className="mr-2" /> Play Track
            </Button>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              <Button
                size="sm"
                onClick={() => {
                  addTracksToQueue(single.tracklist);
                  toast({ title: 'Added to queue' });
                }}
              >
                Add to Queue
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={async () => {
                  const user = getAuth().currentUser;
                  if (!user) return;
                  await setDoc(doc(db, 'profiles', user.uid, 'likedSongs', single.id), {
                    id: single.id,
                    addedAt: serverTimestamp(),
                  });
                  toast({ title: 'Saved to library' });
                }}
              >
                Add to Library
              </Button>
              {single.tracklist && single.tracklist[0] && (
                <AddToPlaylistModal
                  track={single.tracklist[0]}
                  trigger={
                    <Button size="sm" variant="outline">
                      Add to Playlist
                    </Button>
                  }
                />
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
