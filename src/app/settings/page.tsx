'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { doc, getDoc } from 'firebase/firestore';
import { changeUserEmail, changeUserPassword } from '@/utils/user';
import { db } from '@/lib/firebase';
import BackButton from '@/components/ui/BackButton';
import SectionTitle from '@/components/SectionTitle';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    const snap = await getDoc(doc(db, 'profiles', user.uid));
    if (snap.exists()) {
      setEmail(snap.data().email || user.email || '');
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchProfile();
    const handle = () => fetchProfile();
    window.addEventListener('settingsChange', handle);
    return () => window.removeEventListener('settingsChange', handle);
  }, [user, fetchProfile]);

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await changeUserEmail(currentPassword, email);
      toast({ title: 'Email updated' });
    } catch (err: any) {
      toast({
        title: 'Failed to update email',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await changeUserPassword(currentPassword, newPassword);
      toast({ title: 'Password updated' });
      setNewPassword('');
    } catch (err: any) {
      toast({
        title: 'Failed to change password',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  if (loading || !user) return <div className="p-6">Loading...</div>;

  return (
    <div className="container mx-auto space-y-6 px-4 py-6">
      <div className="flex items-center justify-between">
        <SectionTitle>Settings</SectionTitle>
        <BackButton />
      </div>

      <form onSubmit={handleEmailChange} className="space-y-4">
        <h2 className="font-semibold">Change Email</h2>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="New email"
        />
        <Input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current password"
        />
        <Button type="submit">Update Email</Button>
      </form>

      <form onSubmit={handlePasswordChange} className="space-y-4">
        <h2 className="font-semibold">Change Password</h2>
        <Input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password"
        />
        <Input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current password"
        />
        <Button type="submit">Update Password</Button>
      </form>
    </div>
  );
}
