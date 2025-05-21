
"use client"; // Keep as client component for form interactions and potential client-side data fetching/updates

import SectionTitle from '@/components/SectionTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react'; // For managing form state if needed

export default function AccountPage() {
  const { toast } = useToast();
  
  // TODO: Fetch user data from Firebase when component mounts
  // This is mock data. Replace with actual user data.
  const [user, setUser] = useState({
    name: "Demo User", // Fetched from Firebase Auth or Firestore
    email: "demo@example.com", // Fetched from Firebase Auth
    avatarUrl: "https://placehold.co/100x100.png", 
    joinDate: new Date().toLocaleDateString(), // Should be fetched from user record
    // Add other fields like subscription status, etc.
  });

  // State for editable fields
  const [displayName, setDisplayName] = useState(user.name);
  const [email, setEmail] = useState(user.email); // Usually email is not directly editable this way

  useEffect(() => {
    // TODO: Implement function to fetch user data from Firebase
    // e.g., onAuthStateChanged listener or direct fetch from Firestore
    // For now, we use the initial mock data.
    // setUser(fetchedUserData);
    // setDisplayName(fetchedUserData.name);
    // setEmail(fetchedUserData.email);
  }, []);

  const handleUpdateProfile = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: Implement Firebase profile update logic (e.g., updateProfile, updateEmail)
    // Also update Firestore user document if necessary
    console.log("Updating profile with:", { displayName, email });
    toast({
      title: "Profile Updated",
      description: "Your profile information has been (mock) updated.",
    });
    // Optimistically update local state or re-fetch
    setUser(prev => ({...prev, name: displayName, email: email}));
  };

  const handleChangePassword = () => {
    // TODO: Implement Firebase password change flow (e.g., sendPasswordResetEmail or custom flow)
    toast({
      title: "Change Password",
      description: "Password change functionality (e.g., reset email) would be triggered here.",
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
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>View and update your personal details. Email changes may require re-verification.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-24 w-24 border-2 border-primary">
                  <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="profile avatar large" />
                  <AvatarFallback>{user.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <Button variant="outline" type="button" onClick={handleAvatarChange}>Change Avatar</Button>
              </div>

              <div>
                <Label htmlFor="name">Display Name</Label>
                <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="joinDate">Member Since</Label>
                <Input id="joinDate" value={user.joinDate} disabled className="mt-1 bg-muted/30 cursor-not-allowed" />
              </div>
              <Button type="submit" className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">Update Profile</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your password and account security settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" onClick={handleChangePassword} className="w-full">Change Password</Button>
              {/* TODO: Add two-factor authentication setup/management if implemented */}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>Manage your Sonix subscription plan.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* TODO: Display subscription status and link to manage (e.g., Stripe portal) */}
              <p className="text-muted-foreground">Current Plan: Free Tier (Mock)</p>
              <Button variant="link" className="p-0 h-auto mt-2 text-primary">Upgrade to Premium</Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* TODO: Section for Data Management (Export data, Delete account) */}
      {/* TODO: Section for Linked Accounts (OAuth providers) */}

    </div>
  );
}
