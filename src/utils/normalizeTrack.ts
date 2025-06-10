import type { Track, Artist } from '@/types/music';
import { DocumentData } from 'firebase/firestore';
import { DEFAULT_COVER_URL } from './helpers';

export function normalizeTrack(
  doc: DocumentData,
  fetchedArtists: Artist[] = [] // Ensure fetchedArtists is typed as Artist[]
): Track {
  const data = doc.data ? doc.data() : doc; // Handle both Firestore DocumentSnapshot and plain objects

  const matchingArtists = fetchedArtists.filter((artist) =>
    (data.artistIds || []).includes(artist.id)
  );

  // Fallback to artists stored on the document when artistIds are missing
  let artists = matchingArtists;
  if (artists.length === 0) {
    if (Array.isArray(data.artists) && data.artists.length > 0) {
      artists = data.artists.map((a: any) =>
        typeof a === 'object'
          ? { id: a.id || '', name: a.name || '', coverURL: a.coverURL || DEFAULT_COVER_URL }
          : { id: '', name: a, coverURL: DEFAULT_COVER_URL }
      );
    } else if (data.artist) {
      artists = [
        typeof data.artist === 'object'
          ? {
              id: data.artist.id || '',
              name: data.artist.name || '',
              coverURL: data.artist.coverURL || DEFAULT_COVER_URL,
            }
          : { id: '', name: data.artist, coverURL: DEFAULT_COVER_URL },
      ];
    } else if (data.mainArtist) {
      const main =
        typeof data.mainArtist === 'object'
          ? {
              id: data.mainArtist.id || '',
              name: data.mainArtist.name || '',
              coverURL: data.mainArtist.coverURL || DEFAULT_COVER_URL,
            }
          : { id: '', name: data.mainArtist, coverURL: DEFAULT_COVER_URL };
      const featured = Array.isArray(data.featuredArtists)
        ? data.featuredArtists.map((fa: any) =>
            typeof fa === 'object'
              ? { id: fa.id || '', name: fa.name || '', coverURL: fa.coverURL || DEFAULT_COVER_URL }
              : { id: '', name: fa, coverURL: DEFAULT_COVER_URL }
          )
        : [];
      artists = [main, ...featured];
    }
  }

  return {
    id: data.id || doc.id || '',
    title: data.title || 'Untitled',
    artists:
      artists.length > 0
        ? artists.map((a) => ({
            coverURL: a.coverURL ?? DEFAULT_COVER_URL,
            id: a.id,
            name: a.name,
          }))
        : [{ id: '', name: 'Unknown Artist', coverURL: DEFAULT_COVER_URL }],

    audioURL: data.audioURL || '',
    coverURL: data.coverURL || DEFAULT_COVER_URL,

    type: data.type || 'single',
    albumId: data.albumId || '',
    album: data.album
      ? {
          id: data.album.id || '',
          name: data.album.name || 'Unknown Album',
          coverURL: data.album.coverURL || DEFAULT_COVER_URL,
        }
      : undefined,

    duration: data.duration || 0,
    trackNumber: data.trackNumber || 1,
    createdAt: data.createdAt?.toDate() || new Date(), // Ensure createdAt is included
    order: data.order || 0, // Add order with a fallback value
  };
}
