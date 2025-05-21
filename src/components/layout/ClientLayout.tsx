
"use client";

import type { ReactNode } from 'react';
import Link from 'next/link';
import { PlayerProvider, usePlayer } from '@/contexts/PlayerContext';
import MiniPlayer from '@/components/player/MiniPlayer';
import FullScreenPlayer from '@/components/player/FullScreenPlayer';
import BottomNavigationBar from './BottomNavigationBar';
import { SonixLogo } from '@/components/icons/SonixLogo';
import ProfileMenu from './ProfileMenu';

function LayoutContent({ children }: { children: ReactNode }) {
  const { currentTrack, isExpanded } = usePlayer();

  let paddingBottomClass = 'pb-16 md:pb-0'; // Space for BottomNav on mobile
  if (currentTrack) {
    paddingBottomClass = 'pb-[calc(4rem+5rem)] md:pb-[5rem]'; // Space for BottomNav + MiniPlayer on mobile, MiniPlayer only on md+
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="py-3 px-4 md:px-6 flex justify-between items-center fixed top-0 left-0 right-0 z-30 bg-background/90 backdrop-blur-md border-b border-border/50">
        <Link href="/" aria-label="Go to homepage">
          <SonixLogo className="h-8 w-auto" />
        </Link>
        <ProfileMenu />
      </header>

      <main className={`flex-grow pt-20 ${paddingBottomClass} transition-all duration-300`}>
        {children}
      </main>

      {currentTrack && <MiniPlayer />}
      {currentTrack && isExpanded && <FullScreenPlayer />}
      <BottomNavigationBar />
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
