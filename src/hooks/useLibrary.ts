// src/hooks/useLibrary.ts
import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/hooks/useUser';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { DEFAULT_COVER_URL } from '@/utils/helpers';
import type { Track } from '@/types/music';

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
  const { user } = useUser();

  const reloadLibrary = useCallback(async () => {
    if (!user?.uid) {
      setLibrary(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const likedSongsSnap = await getDocs(collection(db, 'users', user.uid, 'likedSongs'));
      const savedAlbumsSnap = await getDocs(
        collection(db, 'users', user.uid, 'savedAlbums')
      );
      const playlistsSnap = await getDocs(collection(db, 'users', user.uid, 'playlists'));

      const transformToTrack = (doc: any): Track => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || 'Untitled',
          artists: data.artists || [{ id: '', name: 'Unknown Artist' }],
          audioURL: data.audioURL || '',
          coverURL: data.coverURL || DEFAULT_COVER_URL,
          type: data.type || 'track',
          albumId: data.albumId || '',
          album:
            data.album ||
            (data.albumId
              ? { id: data.albumId, name: 'Unknown Album', coverURL: DEFAULT_COVER_URL }
              : undefined),
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
  }, [user]);

  useEffect(() => {
    reloadLibrary();
  }, [reloadLibrary, user]);

  return { library, loading, reloadLibrary };
}
