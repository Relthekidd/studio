import { db } from '@/lib/firebase';
import { doc, updateDoc, increment, setDoc, serverTimestamp } from 'firebase/firestore';
import type { Track } from '@/types/music';

export async function recordStream(userId: string | null, track: Pick<Track, 'id' | 'albumId'>) {
  try {
    const trackRef = track.albumId
      ? doc(db, 'albums', track.albumId, 'songs', track.id)
      : doc(db, 'songs', track.id);

    await updateDoc(trackRef, { streams: increment(1) });

    if (userId) {
      const userStreamRef = doc(db, 'users', userId, 'streams', track.id);
      await setDoc(
        userStreamRef,
        { count: increment(1), lastStreamedAt: serverTimestamp(), trackId: track.id },
        { merge: true }
      );
    }
  } catch (error) {
    console.error('Error recording stream:', error);
  }
}
