// src/components/Top5Showcase.tsx
'use client';

import { Track } from '@/contexts/PlayerContext';
import { AlbumCard } from '@/components/AlbumCard';

interface Top5ShowcaseProps {
  title: string;
  items: Track[];
  type: 'artist' | 'track';
}

export default function Top5Showcase({ title, items = [], type }: Top5ShowcaseProps) {
  // Handle empty or undefined items
  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {items.slice(0, 5).map((item) => (
          <AlbumCard key={item.id} item={{ ...item, type }} />
        ))}
      </div>
    </div>
  );
}
