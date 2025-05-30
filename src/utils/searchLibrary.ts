// src/utils/searchLibrary.ts
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

interface SearchResults {
  songs: any[];
  albums: any[];
  artists: any[];
}

/**
 * Prepares a Firestore query to search for items based on a term.
 * @param collectionName The Firestore collection to query.
 * @param term The search term.
 */
async function fetchCollectionByKeywords(collectionName: string, term: string) {
  const lowerTerm = term.toLowerCase();
  const collectionRef = collection(db, collectionName);
  const collectionQuery = query(collectionRef, where('keywords', 'array-contains', lowerTerm));
  const snapshot = await getDocs(collectionQuery);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
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
    // Fetch songs, albums, and artists based on the search term
    const [songs, albums, artists] = await Promise.all([
      fetchCollectionByKeywords('songs', term),
      fetchCollectionByKeywords('albums', term),
      fetchCollectionByKeywords('artists', term),
    ]);

    return { songs, albums, artists };
  } catch (error) {
    console.error('Error searching library:', error);
    return { songs: [], albums: [], artists: [] };
  }
}
