'use client';

import { useEffect, useRef } from 'react';
import { usePlayerStore } from './store';
import MiniPlayer from './MiniPlayer';
import FullScreenPlayer from './FullScreenPlayer';

export default function PlayerManager() {
  const isExpanded = usePlayerStore((s) => s.isExpanded);
  const currentTrack = usePlayerStore((s) => s.currentTrack);

  const originalOverflow = useRef<string | null>(null);

  useEffect(() => {
    if (isExpanded) {
      if (originalOverflow.current === null) {
        originalOverflow.current = document.body.style.overflow;
      }
      document.body.style.overflow = 'hidden';
    } else if (originalOverflow.current !== null) {
      document.body.style.overflow = originalOverflow.current;
      originalOverflow.current = null;
    }

    return () => {
      if (originalOverflow.current !== null) {
        document.body.style.overflow = originalOverflow.current;
        originalOverflow.current = null;
      }
    };
  }, [isExpanded]);

  if (!currentTrack) return null;

  return isExpanded ? <FullScreenPlayer /> : <MiniPlayer />;
}
