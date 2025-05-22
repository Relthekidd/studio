'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  signOut,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';

type Role = 'admin' | 'user';

export interface ExtendedUser extends FirebaseUser {
  displayName: string | null;
  username?: string;
  role?: Role;
}

interface AuthContextType {
  user: ExtendedUser | null;
  loading: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      let profileData: any = {};
      if (userSnap.exists()) {
        profileData = userSnap.data();
        console.log('[AuthProvider] Firestore profileData:', profileData);
      } else {
        console.warn('[AuthProvider] No profile document found for UID:', firebaseUser.uid);
      }

      const extendedUser: ExtendedUser = {
        ...firebaseUser,
        displayName: profileData.displayName ?? firebaseUser.displayName ?? '',
        username: profileData.username ?? '',
        role: profileData.role as Role ?? 'user',
      };

      setUser(extendedUser);
      setIsAdmin(extendedUser.role === 'admin');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
