'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function AccountSetupPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user) return;

    if (!displayName || !username) {
      toast({ title: 'Please fill in all fields.' });
      return;
    }

    setLoading(true);

    try {
      const profileRef = doc(db, 'profiles', user.uid);
      await updateDoc(profileRef, {
        displayName,
        username,
        setupComplete: true,
      });

      toast({ title: 'Account setup complete!' });
      router.push('/');
    } catch (error) {
      console.error(error);
      toast({
        title: 'Failed to update account.',
        description: String(error),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-card border rounded-lg shadow">
      <h1 className="text-xl font-semibold mb-4">Finish Setting Up Your Account</h1>

      <div className="space-y-4">
        <Input
          placeholder="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Saving...' : 'Finish Setup'}
        </Button>
      </div>
    </div>
  );
}
