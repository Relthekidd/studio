'use client';

import { useEffect } from 'react';
import { usePlayerStore } from './store';
import MiniPlayer from './MiniPlayer';
import FullScreenPlayer from './FullScreenPlayer';

export default function PlayerManager() {
  const isExpanded = usePlayerStore((s) => s.isExpanded);
  const currentTrack = usePlayerStore((s) => s.currentTrack);

  useEffect(() => {
    if (isExpanded) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isExpanded]);

  if (!currentTrack) return null;

  return isExpanded ? <FullScreenPlayer /> : <MiniPlayer />;
}
