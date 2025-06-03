'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, googleProvider, db } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthProvider';
import { ADMIN_EMAIL_DOMAIN, ADMIN_EMAILS } from '@/lib/config';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const determineRole = (email?: string | null): 'admin' | 'listener' => {
    if (!email) return 'listener';
    const domain = email.split('@')[1] ?? '';
    if (ADMIN_EMAILS.includes(email) || domain === ADMIN_EMAIL_DOMAIN) {
      return 'admin';
    }
    return 'listener';
  };

  const ensureProfile = async (uid: string, email?: string | null) => {
    let docRef = doc(db, 'users', uid);
    let snap = await getDoc(docRef);
    if (!snap.exists()) {
      docRef = doc(db, 'profiles', uid);
      snap = await getDoc(docRef);
    }
    if (!snap.exists()) {
      const role = determineRole(email);
      await setDoc(doc(db, 'users', uid), { email, role });
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/');
    }
  }, [user, authLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        await ensureProfile(credential.user.uid, credential.user.email);
        toast({ title: 'Logged in!' });
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = userCredential.user;

        // Optional: set display name
        await updateProfile(newUser, {
          displayName: 'Barry Allen',
        });

        await ensureProfile(newUser.uid, newUser.email);
        toast({ title: 'Account created!' });
      }
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Auth error',
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      await ensureProfile(credential.user.uid, credential.user.email);
      toast({ title: 'Logged in with Google!' });
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Google login failed',
        description: err.message,
      });
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-center text-2xl font-bold">
          {mode === 'login' ? 'Login' : 'Create Account'}
        </h1>

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit" disabled={loading} className="w-full">
          {mode === 'login' ? 'Login' : 'Sign Up'}
        </Button>

        <Button type="button" variant="outline" onClick={signInWithGoogle} className="w-full">
          Continue with Google
        </Button>

        <p className="text-center text-sm">
          {mode === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <button type="button" onClick={() => setMode('signup')} className="underline">
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" onClick={() => setMode('login')} className="underline">
                Log in
              </button>
            </>
          )}
        </p>
      </form>
    </main>
  );
}
