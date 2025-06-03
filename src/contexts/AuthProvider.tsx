'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, getAuth, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firebaseApp, db } from '@/lib/firebase';
import { ADMIN_EMAIL_DOMAIN, ADMIN_EMAILS } from '@/lib/config';

interface ExtendedUser extends User {
  role?: 'admin' | 'listener' | 'moderator';
}

interface AuthContextType {
  user: ExtendedUser | null;
  loading: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>; // Add the logout function
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const determineRole = (email?: string | null): 'admin' | 'listener' => {
  if (!email) return 'listener';
  const domain = email.split('@')[1] ?? '';
  if (ADMIN_EMAILS.includes(email) || domain === ADMIN_EMAIL_DOMAIN) {
    return 'admin';
  }
  return 'listener';
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const auth = getAuth(firebaseApp);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          let profileDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (!profileDoc.exists()) {
            profileDoc = await getDoc(doc(db, 'profiles', firebaseUser.uid));
          }

          if (profileDoc.exists()) {
            const data = profileDoc.data();
            setUser({ ...firebaseUser, role: data.role });
            setIsAdmin(data.role === 'admin');
          } else {
            const role = determineRole(firebaseUser.email);
            await setDoc(doc(db, 'users', firebaseUser.uid), {
              email: firebaseUser.email,
              role,
            });
            setUser({ ...firebaseUser, role });
            setIsAdmin(role === 'admin');
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          const role = determineRole(firebaseUser.email);
          setUser({ ...firebaseUser, role });
          setIsAdmin(role === 'admin');
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  // Implement the logout function
  const logout = async () => {
    try {
      await signOut(auth); // Sign out the user using Firebase Auth
      setUser(null); // Clear the user state
      setIsAdmin(false); // Reset admin status
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
