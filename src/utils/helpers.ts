// src/utils/helpers.ts
import type { Track } from '@/types/music';

// Default image used when a track or album is missing artwork
export const DEFAULT_COVER_URL =
  'https://placehold.co/500x500?text=No+Image';

export function formatArtists(input: any): string {
  if (Array.isArray(input)) {
    return input
      .map((a) => (typeof a === 'string' ? a : a?.name || ''))
      .filter(Boolean)
      .join(', ');
  }
  if (typeof input === 'object' && input?.name) return input.name;
  if (typeof input === 'string') return input;
  return 'Unknown Artist';
}

export function safeImageSrc(src: string | undefined | null): string {
  return src && src.trim() !== '' ? src : DEFAULT_COVER_URL;
}

export function normalizeTrack(raw: any): Track {
  const artists = Array.isArray(raw.artists)
    ? raw.artists.map((a: any) =>
        typeof a === 'object' ? { id: a.id ?? '', name: a.name ?? '' } : { id: '', name: a ?? '' }
      )
    : raw.artist
      ? [{ id: raw.artist.id ?? '', name: raw.artist.name ?? raw.artist }]
      : [];

  return {
    id: raw.id,
    title: raw.title || 'Untitled',
    artists,
    audioURL: raw.audioURL || raw.audioUrl || '',
    coverURL: raw.coverURL || raw.coverUrl || '',
    duration: raw.duration || 0,
    type: raw.type || 'track',
    albumId: raw.albumId,
    album: raw.album || undefined,
    trackNumber: raw.trackNumber ?? undefined,
  };
}

export function isValidTrack(track: any): boolean {
  return !!track && typeof track.audioUrl === 'string' && track.audioUrl.trim() !== '';
}

export function formatDate(dateStr: string | Date): string {
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function generateCoverFromTitle(title: string): string {
  const first = title.trim()[0]?.toUpperCase() || 'P';
  return `https://placehold.co/500x500?text=${encodeURIComponent(first)}`;
}

export function getTrackRoute(item: { type: string; id: string }): string {
  const type = item.type?.toLowerCase();
  if (type === 'playlist') return `/playlist/${item.id}`;
  return type === 'album' ? `/album/${item.id}` : `/single/${item.id}`;
}
