import { Track } from '@/contexts/PlayerContext'
import { db } from '@/lib/firebase'
import {
  collection,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore'

// Save a liked song under the user's likedSongs subcollection
export const saveLikedSong = async (userId: string, item: Track, newFavoritedState: boolean, trackId: string) => {
  if (!userId || !trackId) return

  const likedSongRef = doc(db, `users/${userId}/likedSongs`, trackId)

  try {
    await setDoc(likedSongRef, {
      trackId,
      likedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error('Error saving liked song:', error)
  }
}

// Check if a song is already liked by the user
export const isSongLiked = async (
  userId: string,
  trackId: string
): Promise<boolean> => {
  if (!userId || !trackId) return false

  const likedSongRef = doc(db, `users/${userId}/likedSongs`, trackId)

  try {
    const docSnap = await getDoc(likedSongRef)
    return docSnap.exists()
  } catch (error) {
    console.error('Error checking liked song:', error)
    return false
  }
}

// Save a new playlist created by the user
export const savePlaylist = async (
  userId: string,
  playlistData: {
    name: string
    description?: string
    imageUrl?: string
    createdAt?: string;
    songs?: string[]
  }
) => {
  if (!userId || !playlistData.name) return

  const playlistsColRef = collection(db, `users/${userId}/playlists`)
  const playlistId = playlistData.name.replace(/\s+/g, '-').toLowerCase()

  const playlistRef = doc(playlistsColRef, playlistId)

  try {
    await setDoc(playlistRef, {
      ...playlistData,
      createdAt: serverTimestamp(),
      id: playlistId,
    })
  } catch (error) {
    console.error('Error saving playlist:', error)
  }
}

export const removeLikedSong = async (userId: string, trackId: string) => {
  const ref = doc(db, `users/${userId}/likedSongs`, trackId)
  try {
    await deleteDoc(ref)
  } catch (error) {
    console.error('Error removing liked song:', error)
  }
}
