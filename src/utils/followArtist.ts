import { db } from '@/lib/firebase';
import { doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

export async function followArtist(userId: string, artistId: string) {
  if (!userId || !artistId) return;
  const followerRef = doc(db, 'artists', artistId, 'followers', userId);
  const followingRef = doc(db, 'profiles', userId, 'followingArtists', artistId);
  await setDoc(followerRef, { createdAt: serverTimestamp() });
  await setDoc(followingRef, { createdAt: serverTimestamp() });
}

export async function unfollowArtist(userId: string, artistId: string) {
  if (!userId || !artistId) return;
  const followerRef = doc(db, 'artists', artistId, 'followers', userId);
  const followingRef = doc(db, 'profiles', userId, 'followingArtists', artistId);
  await deleteDoc(followerRef).catch(() => {});
  await deleteDoc(followingRef).catch(() => {});
}
