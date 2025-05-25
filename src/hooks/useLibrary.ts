// src/hooks/useLibrary.ts
import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Track } from '@/utils/helpers';

export interface Album {
  id: string;
  [key: string]: any;
}

export interface Playlist {
  id: string;
  [key: string]: any;
}

export interface LibraryData {
  likedSongs: Track[];
  savedAlbums: Album[];
  recentlyAdded: Track[];
  createdPlaylists: Playlist[];
  genres: string[];
}

export function useLibrary() {
  const [library, setLibrary] = useState<LibraryData | null>(null);
  const [loading, setLoading] = useState(true);

  const reloadLibrary = useCallback(async () => {
    setLoading(true);
    try {
      const likedSongsSnap = await getDocs(collection(db, 'users', 'currentUserId', 'likedSongs'));
      const savedAlbumsSnap = await getDocs(collection(db, 'users', 'currentUserId', 'savedAlbums'));
      const playlistsSnap = await getDocs(collection(db, 'users', 'currentUserId', 'playlists'));

      const transformToTrack = (doc: any): Track => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || 'Untitled',
          artist: data.artist || [{ id: '', name: 'Unknown Artist' }],
          audioURL: data.audioURL || '',
          coverURL: data.coverURL || '/placeholder.png',
          type: data.type || 'track',
          albumId: data.albumId || '',
          album: data.album || { id: '', name: 'Unknown Album', coverURL: '/placeholder.png' },
          duration: data.duration || 0,
          trackNumber: data.trackNumber || 1,
          description: data.description || '',
          dataAiHint: data.dataAiHint || '',
        };
      };

      setLibrary({
        likedSongs: likedSongsSnap.docs.map(transformToTrack),
        savedAlbums: savedAlbumsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        recentlyAdded: likedSongsSnap.docs
          .map((doc) => {
            const data = doc.data();
            return {
              ...transformToTrack(doc),
              dateAdded: data.dateAdded || '',
            };
          })
          .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()),
        createdPlaylists: playlistsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        genres: [], // Add logic for genres if needed
      });
    } catch (error) {
      console.error('Error fetching library:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reloadLibrary();
  }, [reloadLibrary]);

  return { library, loading, reloadLibrary };
}
