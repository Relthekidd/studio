"use client";

import type { ReactNode } from 'react';
import { PlayerProvider, usePlayer } from '@/contexts/PlayerContext';
import MiniPlayer from '@/components/player/MiniPlayer';
import FullScreenPlayer from '@/components/player/FullScreenPlayer';

function LayoutContent({ children }: { children: ReactNode }) {
  const { currentTrack, isExpanded } = usePlayer();

  return (
    <div className="flex flex-col min-h-screen">
      <main className={`flex-grow ${currentTrack ? 'pb-24' : 'pb-0'} transition-all duration-300`}>
        {children}
      </main>
      {currentTrack && <MiniPlayer />}
      {currentTrack && isExpanded && <FullScreenPlayer />}
    </div>
  );
}

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <PlayerProvider>
      <LayoutContent>{children}</LayoutContent>
    </PlayerProvider>
  );
}
