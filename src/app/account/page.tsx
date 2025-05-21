
import SectionTitle from '@/components/SectionTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AccountPage() {
  // TODO: Fetch user data from Firebase
  const user = {
    name: "Demo User",
    email: "demo@example.com",
    avatarUrl: "https://placehold.co/100x100.png", // Placeholder
    joinDate: "January 1, 2024",
  };

  // TODO: Implement update profile functionality
  const handleUpdateProfile = (event: React.FormEvent) => {
    event.preventDefault();
    alert("Profile update functionality coming soon!");
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8">
      <SectionTitle>Manage Account</SectionTitle>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>View and edit your personal details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="profile avatar" />
                <AvatarFallback>{user.name.substring(0,1)}</AvatarFallback>
              </Avatar>
              <Button variant="outline" type="button">Change Avatar</Button>
            </div>

            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue={user.name} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue={user.email} className="mt-1" />
            </div>
             <div>
              <Label htmlFor="joinDate">Join Date</Label>
              <Input id="joinDate" defaultValue={user.joinDate} disabled className="mt-1 bg-muted/50" />
            </div>
            <Button type="submit" className="w-full md:w-auto">Update Profile</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Manage your password and account security.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline">Change Password</Button>
          {/* TODO: Add two-factor authentication options if needed */}
        </CardContent>
      </Card>
    </div>
  );
}
