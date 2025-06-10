// src/utils/searchLibrary.ts
import { db } from '@/lib/firebase';
import {
  collection,
  collectionGroup,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import type { Song, Album, Artist } from '@/types/music';

interface UserResult {
  id: string;
  displayName: string;
  avatarURL?: string;
}

interface SearchResults {
  songs: Song[];
  albums: Album[];
  artists: Artist[];
  users: UserResult[];
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
    return { songs: [], albums: [], artists: [], users: [] };
  }

  try {
    const [songsSnap, albumsSnap, artistsSnap, usersSnap] = await Promise.all([
      getDocs(collectionGroup(db, 'songs')),
      getDocs(collection(db, 'albums')),
      getDocs(collection(db, 'artists')),
      getDocs(query(collection(db, 'profiles'), where('isProfilePublic', '==', true))),
    ]);

    const songs = songsSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as Song[];
    const albums = albumsSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as Album[];
    const artists = artistsSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as Artist[];
    const users = usersSnap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((u: any) => u.isProfilePublic !== false) as UserResult[];

    const artistMap = new Map(artists.map((a) => [a.id, a.name]));
    const albumMap = new Map(
      albums.map((a) => [a.id, { title: (a as any).title, coverURL: (a as any).coverURL }]),
    );

    const attachArtists = (ids: string[] | undefined) =>
      (ids || []).map((id) => ({ id, name: artistMap.get(id) || 'Unknown Artist' }));

    songs.forEach((s: any) => {
      if (!s.artists || s.artists.length === 0) {
        s.artists = attachArtists(s.artistIds);
      }
      if (!s.album && s.albumId && albumMap.has(s.albumId)) {
        const a = albumMap.get(s.albumId) as any;
        s.album = { id: s.albumId, name: a.title || '', coverURL: a.coverURL || '' };
      }
    });

    albums.forEach((a: any) => {
      if (!a.artists || a.artists.length === 0) {
        a.artists = attachArtists(a.artistIds);
      }
    });

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
    const filteredUsers = users.filter((u) => (u.displayName || '').toLowerCase().includes(search));
    return {
      songs: filteredSongs,
      albums: filteredAlbums,
      artists: filteredArtists,
      users: filteredUsers,
    };
  } catch (error) {
    console.error('Error searching library:', error);
    return { songs: [], albums: [], artists: [], users: [] };
  }
}
