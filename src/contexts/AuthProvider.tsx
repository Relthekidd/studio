'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, getAuth, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { firebaseApp, db } from '@/lib/firebase';

interface ExtendedUser extends User {
  role?: 'admin' | 'user' | 'moderator'; // Add the role property
}

interface AuthContextType {
  user: ExtendedUser | null;
  loading: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>; // Add the logout function
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const auth = getAuth(firebaseApp);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({ ...firebaseUser, role: userData.role }); // Merge role into user object
            setIsAdmin(userData.role === 'admin'); // Check if the user is an admin
          } else {
            setUser({ ...firebaseUser, role: 'user' }); // Default role to 'user'
            setIsAdmin(false);
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          setUser({ ...firebaseUser, role: 'user' }); // Default role to 'user' on error
          setIsAdmin(false);
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
