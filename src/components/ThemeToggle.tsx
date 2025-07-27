'use client';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export default function ThemeToggle() {
  const [enabled, setEnabled] = useState(false);

  // Load stored preference
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') {
      setEnabled(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Update html class & storage when changed
  useEffect(() => {
    if (enabled) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [enabled]);

  return (
    <div className="flex items-center gap-2">
      <Sun className="size-4" />
      <Switch
        id="theme-toggle"
        checked={enabled}
        onCheckedChange={setEnabled}
        aria-label="Toggle dark mode"
      />
      <Moon className="size-4" />
    </div>
  );
}
