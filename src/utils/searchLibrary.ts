// src/utils/searchLibrary.ts
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

interface SearchResults {
  songs: any[];
  albums: any[];
  artists: any[];
}

export async function searchLibrary(term: string): Promise<SearchResults> {
  if (!term.trim()) {
    return { songs: [], albums: [], artists: [] };
  }

  const lowerTerm = term.toLowerCase();

  try {
    // Query songs collection
    const songsQuery = query(
      collection(db, 'songs'),
      where('keywords', 'array-contains', lowerTerm)
    );
    const songsSnapshot = await getDocs(songsQuery);
    const songs = songsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Query albums collection
    const albumsQuery = query(
      collection(db, 'albums'),
      where('keywords', 'array-contains', lowerTerm)
    );
    const albumsSnapshot = await getDocs(albumsQuery);
    const albums = albumsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Query artists collection
    const artistsQuery = query(
      collection(db, 'artists'),
      where('keywords', 'array-contains', lowerTerm)
    );
    const artistsSnapshot = await getDocs(artistsQuery);
    const artists = artistsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { songs, albums, artists };
  } catch (error) {
    console.error('Error searching library:', error);
    return { songs: [], albums: [], artists: [] };
  }
}
