import { Track } from '@/contexts/PlayerContext';
import { DocumentData } from 'firebase/firestore';

export function normalizeTrack(
  doc: DocumentData,
  fetchedArtists: { id: string; name: string }[] = []
): Track {
  const data = doc.data ? doc.data() : doc; // Handle both Firestore DocumentSnapshot and plain objects

  const matchingArtists = fetchedArtists.filter((artist) =>
    (data.artistIds || []).includes(artist.id)
  );

  return {
    id: doc.id || '',
    title: data.title || 'Untitled',
    artist: matchingArtists.length > 0 ? matchingArtists : [{ id: '', name: 'Unknown Artist' }],

    audioURL: data.audioURL || '',
    coverURL: data.coverURL || '/placeholder.png',

    type: data.type || 'single',
    albumId: data.albumId || '',
    album: data.album
      ? {
          id: data.album.id || '',
          name: data.album.name || 'Unknown Album',
          coverURL: data.album.coverURL || '/placeholder.png',
        }
      : undefined,

    duration: data.duration || 0,
    trackNumber: data.trackNumber || 1,
  };
}
