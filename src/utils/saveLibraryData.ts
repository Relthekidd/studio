import type { Track } from '@/types/music';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc, getDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

// Save a liked song under the user's likedSongs subcollection
export const saveLikedSong = async (
  userId: string,
  item: Track,
  newFavoritedState: boolean,
  trackId: string
) => {
  if (!userId || !trackId) return;

  const likedSongRef = doc(db, `users/${userId}/likedSongs`, trackId);

  try {
    await setDoc(likedSongRef, {
      trackId,
      likedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error saving liked song:', error);
  }
};

// Check if a song is already liked by the user
export const isSongLiked = async (userId: string, trackId: string): Promise<boolean> => {
  if (!userId || !trackId) return false;

  const likedSongRef = doc(db, `users/${userId}/likedSongs`, trackId);

  try {
    const docSnap = await getDoc(likedSongRef);
    return docSnap.exists();
  } catch (error) {
    console.error('Error checking liked song:', error);
    return false;
  }
};

// Define a TypeScript interface for a playlist
interface PlaylistData {
  name: string; // Playlist name
  description?: string; // Optional description
  ownerId: string; // User ID of the playlist owner
  imageUrl?: string; // Optional cover image URL
  songs?: string[]; // Array of song IDs
  createdAt?: string; // Timestamp for when the playlist was created
}

// Define a TypeScript interface for the savePlaylist function parameters
interface SavePlaylistParams {
  userId: string; // User ID of the playlist owner
  playlistData: PlaylistData; // Playlist data object
}

// Save a new playlist created by the user
export const savePlaylist = async ({ userId, playlistData }: SavePlaylistParams) => {
  if (!userId || !playlistData.name) {
    console.error('Missing userId or playlist name');
    return;
  }

  const playlistsColRef = collection(db, `users/${userId}/playlists`);
  const playlistId = playlistData.name.replace(/\s+/g, '-').toLowerCase(); // Generate a unique ID based on the name

  const playlistRef = doc(playlistsColRef, playlistId);

  try {
    await setDoc(playlistRef, {
      ...playlistData,
      ownerId: userId, // Ensure the ownerId is set to the current user
      createdAt: playlistData.createdAt || serverTimestamp(), // Use provided timestamp or Firestore's server timestamp
      id: playlistId, // Include the generated playlist ID
    });
    console.info('Playlist saved successfully');
  } catch (error) {
    console.error('Error saving playlist:', error);
  }
};

export const removeLikedSong = async (userId: string, trackId: string) => {
  const ref = doc(db, `users/${userId}/likedSongs`, trackId);
  try {
    await deleteDoc(ref);
  } catch (error) {
    console.error('Error removing liked song:', error);
  }
};
