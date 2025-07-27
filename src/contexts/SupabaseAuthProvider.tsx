'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabaseBrowser } from '@/lib/supabase';

interface ExtendedUser extends User {
  role?: 'admin' | 'listener' | 'moderator';
  uid: string;
  photoURL?: string;
}

interface AuthContextType {
  user: ExtendedUser | null;
  loading: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const SupabaseAuthProvider = ({ children }: { children: ReactNode }) => {
  const supabase = supabaseBrowser();
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      handleSession(session);
    });
    supabase.auth.getSession().then(({ data }) => handleSession(data.session));
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSession = async (session: Session | null) => {
    if (session?.user) {
      const { user } = session;
      setUser({
        ...user,
        uid: user.id,
        photoURL: (user.user_metadata as any)?.avatar_url,
      } as ExtendedUser);
      const role = (user.user_metadata as any)?.role;
      setIsAdmin(role === 'admin');
    } else {
      setUser(null);
      setIsAdmin(false);
    }
    setLoading(false);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useSupabaseAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useSupabaseAuth must be used within SupabaseAuthProvider');
  return context;
};
