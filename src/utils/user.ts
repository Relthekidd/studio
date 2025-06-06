import { auth, db } from '@/lib/firebase';
import {
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

export async function updateUserProfile(userId: string, updates: Record<string, any>) {
  const ref = doc(db, 'profiles', userId);
  await updateDoc(ref, updates);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('profileChange'));
  }
}

export async function changeUserEmail(currentPassword: string, newEmail: string) {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error('Not authenticated');
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updateEmail(user, newEmail);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('settingsChange'));
  }
}

export async function changeUserPassword(currentPassword: string, newPassword: string) {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error('Not authenticated');
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('settingsChange'));
  }
}
