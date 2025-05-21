
"use client";

import SectionTitle from '@/components/SectionTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react'; 
import { Camera } from 'lucide-react';

export default function AccountPage() {
  const { toast } = useToast();
  
  // TODO: Fetch user data from Firebase when component mounts
  const [user, setUser] = useState({
    name: "Demo User", 
    email: "demo@example.com", 
    avatarUrl: "https://placehold.co/150x150.png", 
    bio: "Lover of synthwave and exploring new tunes on Sonix!",
    joinDate: new Date().toLocaleDateString(),
    isProfilePublic: true,
    showFavoritesPublicly: true,
    showTopStatsPublicly: true,
  });

  const [displayName, setDisplayName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.bio);
  const [isProfilePublic, setIsProfilePublic] = useState(user.isProfilePublic);
  const [showFavoritesPublicly, setShowFavoritesPublicly] = useState(user.showFavoritesPublicly);
  const [showTopStatsPublicly, setShowTopStatsPublicly] = useState(user.showTopStatsPublicly);

  useEffect(() => {
    // Mock fetching user data
    // setUser(fetchedUserData);
    setDisplayName(user.name);
    setEmail(user.email);
    setBio(user.bio);
    setIsProfilePublic(user.isProfilePublic);
    setShowFavoritesPublicly(user.showFavoritesPublicly);
    setShowTopStatsPublicly(user.showTopStatsPublicly);
  }, [user]); // Re-run if user object changes (e.g. fetched from Firebase)

  const handleUpdateProfile = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: Implement Firebase profile update logic (Auth & Firestore)
    console.log("Updating profile with:", { displayName, email, bio, isProfilePublic, showFavoritesPublicly, showTopStatsPublicly });
    toast({
      title: "Profile Updated",
      description: "Your profile information has been (mock) updated.",
    });
    setUser(prev => ({...prev, name: displayName, email, bio, isProfilePublic, showFavoritesPublicly, showTopStatsPublicly}));
  };

  const handleChangePassword = () => {
    // TODO: Implement Firebase password change flow
    toast({
      title: "Change Password",
      description: "Password change functionality would be triggered here.",
    });
  };

  const handleAvatarChange = () => {
    // TODO: Implement avatar upload to Firebase Storage and update user profile URL
    toast({
      title: "Change Avatar",
      description: "Avatar upload functionality not yet implemented.",
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
      <SectionTitle>Manage Your Account</SectionTitle>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Information Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>View and update your personal details and public profile settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="relative group">
                  <Avatar className="h-28 w-28 border-2 border-primary shadow-md">
                    <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="profile avatar large" />
                    <AvatarFallback>{user.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleAvatarChange} 
                    className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-card/80 group-hover:bg-accent group-hover:text-accent-foreground transition-colors"
                    aria-label="Change avatar"
                  >
                    <Camera size={16} />
                  </Button>
                </div>
                <div className="flex-1">
                  <Label htmlFor="name">Display Name</Label>
                  <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="mt-1" />
                  <p className="text-xs text-muted-foreground mt-1">This name will be visible on your public profile.</p>
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
              </div>
               <div>
                <Label htmlFor="bio">Short Bio</Label>
                <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} className="mt-1" placeholder="Tell us a bit about yourself..." maxLength={160} />
                 <p className="text-xs text-muted-foreground mt-1">Max 160 characters. Visible on your public profile.</p>
              </div>
              <div>
                <Label htmlFor="joinDate">Member Since</Label>
                <Input id="joinDate" value={user.joinDate} disabled className="mt-1 bg-muted/30 cursor-not-allowed" />
              </div>
              
              <CardTitle className="text-xl pt-4 border-t mt-4">Privacy Settings</CardTitle>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Label htmlFor="isProfilePublic" className="flex flex-col">
                    <span>Public Profile</span>
                    <span className="text-xs font-normal text-muted-foreground">Allow others to find and view your profile.</span>
                  </Label>
                  <Switch id="isProfilePublic" checked={isProfilePublic} onCheckedChange={setIsProfilePublic} />
                </div>
                <div className={`flex items-center justify-between p-3 border rounded-lg ${!isProfilePublic ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <Label htmlFor="showFavoritesPublicly" className={`flex flex-col ${!isProfilePublic ? 'text-muted-foreground' : ''}`}>
                    <span>Show Favorites Publicly</span>
                    <span className="text-xs font-normal">Display liked songs & albums on your profile.</span>
                  </Label>
                  <Switch id="showFavoritesPublicly" checked={showFavoritesPublicly} onCheckedChange={setShowFavoritesPublicly} disabled={!isProfilePublic}/>
                </div>
                 <div className={`flex items-center justify-between p-3 border rounded-lg ${!isProfilePublic ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <Label htmlFor="showTopStatsPublicly" className={`flex flex-col ${!isProfilePublic ? 'text-muted-foreground' : ''}`}>
                    <span>Show Top Stats Publicly</span>
                    <span className="text-xs font-normal">Display auto-generated Top 5 artists/songs.</span>
                  </Label>
                  <Switch id="showTopStatsPublicly" checked={showTopStatsPublicly} onCheckedChange={setShowTopStatsPublicly} disabled={!isProfilePublic}/>
                </div>
              </div>

              <Button type="submit" className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground mt-6">Update Profile & Settings</Button>
            </form>
          </CardContent>
        </Card>

        {/* Security & Subscription Cards */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your password.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={handleChangePassword} className="w-full">Change Password</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>Your Sonix plan.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Current Plan: Free Tier (Mock)</p>
              <Button variant="link" className="p-0 h-auto mt-2 text-primary">Upgrade to Premium</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
