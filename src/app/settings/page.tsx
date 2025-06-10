'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import BackButton from '@/components/ui/BackButton';
import SectionTitle from '@/components/SectionTitle';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const { toast } = useToast();

  const [darkMode, setDarkMode] = useState(false);
  const [showExplicit, setShowExplicit] = useState(true);
  const [compactMode, setCompactMode] = useState(false);

  // Sync dark mode with <html> class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  if (loading || !user) return <div className="p-6">Loading...</div>;

  return (
    <div className="container mx-auto space-y-6 px-4 py-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <SectionTitle>App Settings</SectionTitle>
        <BackButton />
      </div>

      <Card>
        <CardContent className="space-y-6 p-6">
          <div className="space-y-4">
            <h2 className="font-semibold text-lg">Appearance</h2>
            <div className="flex items-center justify-between">
              <Label htmlFor="darkMode">Dark Mode</Label>
              <Switch
                id="darkMode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="compactMode">Compact Mode</Label>
              <Switch
                id="compactMode"
                checked={compactMode}
                onCheckedChange={setCompactMode}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-semibold text-lg">Content</h2>
            <div className="flex items-center justify-between">
              <Label htmlFor="showExplicit">Show Explicit Content</Label>
              <Switch
                id="showExplicit"
                checked={showExplicit}
                onCheckedChange={setShowExplicit}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
