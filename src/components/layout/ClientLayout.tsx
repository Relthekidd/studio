
"use client";

import type { ReactNode } from 'react';
import { PlayerProvider, usePlayer } from '@/contexts/PlayerContext';
import MiniPlayer from '@/components/player/MiniPlayer';
import FullScreenPlayer from '@/components/player/FullScreenPlayer';
import BottomNavigationBar from './BottomNavigationBar';
import { SonixLogo } from '@/components/icons/SonixLogo';

function LayoutContent({ children }: { children: ReactNode }) {
  const { currentTrack, isExpanded } = usePlayer();

  // Calculate paddingBottom for main content
  // BottomNav height: h-16 (4rem)
  // MiniPlayer height: h-20 (5rem)
  let paddingBottomClass = 'pb-16 md:pb-0'; // Space for BottomNav on mobile, 0 on md+
  if (currentTrack) {
    // If track playing, MiniPlayer is visible (h-20, 5rem). BottomNav (h-16, 4rem) is also there on mobile.
    paddingBottomClass = 'pb-[calc(4rem+5rem)] md:pb-[5rem]'; // md:pb for MiniPlayer only
  }


  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed Header with Centered Logo */}
      <header className="py-3 flex justify-center items-center fixed top-0 left-0 right-0 z-30 bg-background/90 backdrop-blur-md border-b border-border/50">
        <SonixLogo className="h-8 w-auto" />
      </header>

      {/* Adjust pt for fixed header height (approx 2rem logo + 1.5rem padding = 3.5rem. pt-20 gives 1.5rem space) */}
      <main className={`flex-grow pt-20 ${paddingBottomClass} transition-all duration-300`}>
        {children}
      </main>

      {currentTrack && <MiniPlayer />} {/* MiniPlayer is z-50 */}
      {currentTrack && isExpanded && <FullScreenPlayer />} {/* FullScreenPlayer is z-100 */}
      <BottomNavigationBar /> {/* BottomNav is z-40, hidden on md+ by default */}
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
