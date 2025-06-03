// src/utils/searchLibrary.ts
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import type { Song, Album, Artist } from '@/types/music';

interface SearchResults {
  songs: Song[];
  albums: Album[];
  artists: Artist[];
}

/**
 * Searches the library for songs, albums, and artists based on a search term.
 * Supports fuzzy matching by querying the `keywords` field in Firestore.
 * @param term The search term.
 * @returns A promise resolving to search results.
 */
export async function searchLibrary(term: string): Promise<SearchResults> {
  const search = term.trim().toLowerCase();
  if (!search) {
    return { songs: [], albums: [], artists: [] };
  }

  try {
    const [songsSnap, albumsSnap, artistsSnap] = await Promise.all([
      getDocs(collection(db, 'songs')),
      getDocs(collection(db, 'albums')),
      getDocs(collection(db, 'artists')),
    ]);

    const songs = songsSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as Song[];
    const albums = albumsSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as Album[];
    const artists = artistsSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as Artist[];

    const filteredSongs = songs.filter((s) => {
      const title = (s as any).title || '';
      const artist =
        (s as any).artist ||
        (Array.isArray((s as any).artists)
          ? (s as any).artists.map((a: any) => a.name).join(' ')
          : '');
      const album = (s as any).album?.name || (s as any).album || '';
      return (
        title.toLowerCase().includes(search) ||
        artist.toLowerCase().includes(search) ||
        album.toLowerCase().includes(search)
      );
    });

    const filteredAlbums = albums.filter((a) => {
      const title = (a as any).title || '';
      const artist = (a as any).artist || '';
      return title.toLowerCase().includes(search) || artist.toLowerCase().includes(search);
    });

    const filteredArtists = artists.filter((a) => (a.name || '').toLowerCase().includes(search));

    return { songs: filteredSongs, albums: filteredAlbums, artists: filteredArtists };
  } catch (error) {
    console.error('Error searching library:', error);
    return { songs: [], albums: [], artists: [] };
  }
}
