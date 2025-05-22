// src/hooks/useUserPreferences.ts
import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useUser } from './useUser';

export function useUserPreferences() {
  const { user } = useUser();
  const [showTop5, setShowTop5] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchPrefs = async () => {
      const ref = doc(db, 'users', user.uid, 'preferences', 'visibility');
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setShowTop5(snap.data().showTop5 ?? true);
      } else {
        setShowTop5(true);
      }
    };
    fetchPrefs();
  }, [user]);

  const updateShowTop5 = async (value: boolean) => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid, 'preferences', 'visibility');
    await setDoc(ref, { showTop5: value }, { merge: true });
    setShowTop5(value);
  };

  return { showTop5, updateShowTop5 };
}
