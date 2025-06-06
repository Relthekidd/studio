import { db } from '@/lib/firebase';
import { doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

export async function followUser(currentUserId: string, targetUserId: string) {
  if (!currentUserId || !targetUserId || currentUserId === targetUserId) return;
  const followerRef = doc(db, 'profiles', targetUserId, 'followers', currentUserId);
  const followingRef = doc(db, 'profiles', currentUserId, 'following', targetUserId);
  await setDoc(followerRef, { createdAt: serverTimestamp() });
  await setDoc(followingRef, { createdAt: serverTimestamp() });
}

export async function unfollowUser(currentUserId: string, targetUserId: string) {
  if (!currentUserId || !targetUserId || currentUserId === targetUserId) return;
  const followerRef = doc(db, 'profiles', targetUserId, 'followers', currentUserId);
  const followingRef = doc(db, 'profiles', currentUserId, 'following', targetUserId);
  await deleteDoc(followerRef).catch(() => {});
  await deleteDoc(followingRef).catch(() => {});
}
