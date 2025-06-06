'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, ListMusic, Info, PlayCircle } from 'lucide-react';
import { usePlayerStore } from '@/features/player/store';
import type { Track } from '@/types/music';
import SectionTitle from '@/components/SectionTitle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/ui/BackButton';
import TrackListItem from '@/components/music/TrackListItem';
import { Card, CardContent } from '@/components/ui/card';
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

type Artist = {
  id: string;
  name: string;
};

type Single = {
  id: string;
  title: string;
  coverURL: string;
  releaseDate?: string;
  tracklist: Track[];
  credits?: string;
  artistIds: string[];
  tags?: string[];
  genre?: string;
  type: 'single' | 'album';
};

export default function SingleDetailPage() {
  const params = useParams();
  const setCurrentTrack = usePlayerStore((s) => s.setCurrentTrack);
  const setIsPlaying = usePlayerStore((s) => s.setIsPlaying);
  const setQueue = usePlayerStore((s) => s.setQueue);
  const { toast } = useToast();
  const [single, setSingle] = useState<Single | null>(null);
  const [artistsDetails, setArtistsDetails] = useState<Artist[]>([]);

  const singleId = params.singleId as string;

  useEffect(() => {
    const fetchData = async () => {
      if (!singleId) return;

      try {
        const singleDocRef = doc(db, 'songs', singleId);
        const singleDocSnap = await getDoc(singleDocRef);

        if (singleDocSnap.exists()) {
          const singleData = singleDocSnap.data();

          // Fetch artist details
          const artistIds = singleData.artistIds || [];
          let fetchedArtists: Artist[] = [];

          if (artistIds.length > 0) {
            const artistQuery = query(collection(db, 'artists'), where('id', 'in', artistIds));
            const artistSnap = await getDocs(artistQuery);
            fetchedArtists = artistSnap.docs.map((doc) => ({
              id: doc.id,
              name: doc.data().name || 'Unknown Artist',
            }));
          }

          // Normalize tracklist. If no tracklist exists, treat the document
          // itself as a single track.
          const normalizedTracklist =
            Array.isArray(singleData.tracklist) && singleData.tracklist.length > 0
              ? singleData.tracklist
                  .filter((track) => track && typeof track === 'object')
                  .map((track) => normalizeTrack(track, fetchedArtists))
              : [
                  normalizeTrack(
                    { id: singleDocSnap.id, ...singleData },
                    fetchedArtists,
                  ),
                ];

          // Store fetched artist details in state
          setArtistsDetails(fetchedArtists);

          setSingle({
            id: singleDocSnap.id,
            title: singleData.title,
            coverURL: singleData.coverURL || DEFAULT_COVER_URL,
            releaseDate: singleData.releaseDate,
            tracklist: normalizedTracklist,
            credits: singleData.credits || '',
            artistIds: singleData.artistIds || [],
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

              {/* Artist Names */}
              <div className="mb-4 mt-2">
                {artistsDetails.map((artist) => (
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
            <div className="mt-2 flex justify-center gap-2">
              <Button
                size="sm"
                onClick={() => {
                  setQueue(single.tracklist);
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
            </div>
          </div>
        </div>
      </Card>

      {single.tracklist && single.tracklist.length > 0 && (
        <>
          <SectionTitle id="tracklist-title">Tracklist</SectionTitle>
          <Card>
            <CardContent className="p-0">
              <div className="space-y-1">
                {single.tracklist.map((track) => (
                  <TrackListItem key={track.id} track={track} onPlay={handlePlayTrack} coverURL={single.coverURL} />
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

