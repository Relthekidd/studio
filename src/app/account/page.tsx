'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { updateUserProfile } from '@/utils/user';
import BackButton from '@/components/ui/BackButton';

import { Camera } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import SectionTitle from '@/components/SectionTitle';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function AccountPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user, loading } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [isProfilePublic, setIsProfilePublic] = useState(true);
  const [showFavoritesPublicly, setShowFavoritesPublicly] = useState(true);
  const [showTopStatsPublicly, setShowTopStatsPublicly] = useState(true);

  const loadUserProfile = useCallback(async () => {
    if (!user) return;
    const profileRef = doc(db, 'profiles', user.uid);
    const snapshot = await getDoc(profileRef);

    if (snapshot.exists()) {
      const profile = snapshot.data();
      setDisplayName(profile.displayName || '');
      setEmail(profile.email || '');
      setBio(profile.bio || '');
      setIsProfilePublic(profile.isProfilePublic ?? true);
      setShowFavoritesPublicly(profile.showFavoritesPublicly ?? true);
      setShowTopStatsPublicly(profile.showTopStatsPublicly ?? true);
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (user) loadUserProfile();

    const handleChange = () => loadUserProfile();
    window.addEventListener('profileChange', handleChange);
    return () => window.removeEventListener('profileChange', handleChange);
  }, [user, loading, router, loadUserProfile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updateUserProfile(user.uid, {
        displayName,
        email,
        bio,
        isProfilePublic,
        showFavoritesPublicly,
        showTopStatsPublicly,
      });

      toast({
        title: 'Profile Updated',
        description: 'Your settings have been saved successfully.',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update profile.',
        variant: 'destructive',
      });
    }
  };

  const handleAvatarChange = () => {
    toast({ title: 'Coming soon', description: 'Avatar change not implemented yet.' });
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (loading || !user) return <div className="p-6">Loading...</div>;

  return (
    <div className="container mx-auto space-y-6 px-4 py-6">
      <div className="flex items-center justify-between">
        <SectionTitle>Account</SectionTitle>
        <BackButton />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Edit your profile and visibility settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="group relative">
                  <Avatar className="size-24">
                    <AvatarImage src={user.photoURL || undefined} />
                    <AvatarFallback>{displayName?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleAvatarChange}
                    className="absolute bottom-0 right-0 size-8 rounded-full bg-white"
                  >
                    <Camera size={16} />
                  </Button>
                </div>
                <div className="flex-1">
                  <Label>Display Name</Label>
                  <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                </div>
              </div>

              <div>
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div>
                <Label>Bio</Label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about you..."
                />
              </div>

              <div className="space-y-3 pt-4">
                <div className="flex items-center justify-between rounded border p-3">
                  <Label htmlFor="isProfilePublic" className="flex flex-col">
                    Public Profile
                    <span className="text-xs text-muted-foreground">
                      Let others view your profile.
                    </span>
                  </Label>
                  <Switch
                    id="isProfilePublic"
                    checked={isProfilePublic}
                    onCheckedChange={setIsProfilePublic}
                  />
                </div>
                <div className="flex items-center justify-between rounded border p-3">
                  <Label htmlFor="showFavoritesPublicly" className="flex flex-col">
                    Show Favorites
                    <span className="text-xs text-muted-foreground">
                      Display liked music on your profile.
                    </span>
                  </Label>
                  <Switch
                    id="showFavoritesPublicly"
                    checked={showFavoritesPublicly}
                    onCheckedChange={setShowFavoritesPublicly}
                  />
                </div>
                <div className="flex items-center justify-between rounded border p-3">
                  <Label htmlFor="showTopStatsPublicly" className="flex flex-col">
                    Show Top Stats
                    <span className="text-xs text-muted-foreground">
                      Display top artists and tracks.
                    </span>
                  </Label>
                  <Switch
                    id="showTopStatsPublicly"
                    checked={showTopStatsPublicly}
                    onCheckedChange={setShowTopStatsPublicly}
                  />
                </div>
              </div>

              <Button type="submit" className="mt-6 w-full md:w-auto">
                Update Profile
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your password</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Change Password
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>Current Plan: Free Tier</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="link" className="p-0 text-sm">
                Upgrade to Premium
              </Button>
              <Button onClick={handleLogout} className="mt-4 w-full">
                Log Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
