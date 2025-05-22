'use client';

import { useRouter } from 'next/navigation';
import SectionTitle from '@/components/SectionTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center justify-between">
        <SectionTitle>Settings</SectionTitle>
        <Link href="/library" className="text-sm text-muted-foreground hover:underline flex items-center gap-1">
          <ArrowLeft size={16} /> Back
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Manage your account preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
              <span>Email Notifications</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Receive updates and newsletters.
              </span>
            </Label>
            <Switch id="email-notifications" defaultChecked aria-label="Toggle email notifications" />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <Label htmlFor="playback-quality" className="flex flex-col space-y-1">
              <span>High Quality Streaming</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Stream music in higher fidelity (uses more data).
              </span>
            </Label>
            <Switch id="playback-quality" aria-label="Toggle high quality streaming" />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
              <span>Dark Mode</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Sonix is always in dark mode. This switch is for illustration.
              </span>
            </Label>
            <Switch id="dark-mode" defaultChecked disabled aria-label="Toggle dark mode (disabled)" />
          </div>

          <Button className="w-full md:w-auto">Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
