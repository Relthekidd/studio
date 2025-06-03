// src/utils/searchLibrary.ts
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

interface SearchResults {
  songs: any[];
  albums: any[];
  artists: any[];
}

/**
 * Searches the library for songs, albums, and artists based on a search term.
 * Supports fuzzy matching by querying the `keywords` field in Firestore.
 * @param term The search term.
 * @returns A promise resolving to search results.
 */
export async function searchLibrary(term: string): Promise<SearchResults> {
  if (!term.trim()) {
    return { songs: [], albums: [], artists: [] };
  }

  try {
    // Query songs by title
    const qSongs = query(
      collection(db, 'songs'),
      where('title', '>=', term),
      where('title', '<=', term + '\uf8ff')
    );
    const songsSnapshot = await getDocs(qSongs);
    const songs = songsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // Query albums by title
    const qAlbums = query(
      collection(db, 'albums'),
      where('title', '>=', term),
      where('title', '<=', term + '\uf8ff')
    );
    const albumsSnapshot = await getDocs(qAlbums);
    const albums = albumsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // Query artists by name
    const qArtists = query(
      collection(db, 'artists'),
      where('name', '>=', term),
      where('name', '<=', term + '\uf8ff')
    );
    const artistsSnapshot = await getDocs(qArtists);
    const artists = artistsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return { songs, albums, artists };
  } catch (error) {
    console.error('Error searching library:', error);
    return { songs: [], albums: [], artists: [] };
  }
}
