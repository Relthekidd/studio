
"use client";

import type { ReactNode } from 'react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { PlayerProvider, usePlayer } from '@/contexts/PlayerContext';
import MiniPlayer from '@/components/player/MiniPlayer';
import FullScreenPlayer from '@/components/player/FullScreenPlayer';
import BottomNavigationBar from './BottomNavigationBar';
import { SonixLogo } from '@/components/icons/SonixLogo';
import ProfileMenu from './ProfileMenu';
import { usePathname, useRouter } from 'next/navigation';

function LayoutContent({ children }: { children: ReactNode }) {
  const { currentTrack, isExpanded } = usePlayer();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const mockAuthStatus = localStorage.getItem('isMockAuthenticated') === 'true';
    setIsAuthenticated(mockAuthStatus);
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    if (authChecked) {
      if (isAuthenticated && pathname === '/login') {
        router.push('/');
      } else if (!isAuthenticated && pathname !== '/login') {
        router.push('/login');
      }
    }
  }, [isAuthenticated, authChecked, pathname, router]);

  const handleLogin = () => {
    localStorage.setItem('isMockAuthenticated', 'true');
    setIsAuthenticated(true);
    // Redirection is handled by the useEffect above
  };

  const handleLogout = () => {
    localStorage.removeItem('isMockAuthenticated');
    setIsAuthenticated(false);
    // Redirection to /login is handled by the useEffect above
  };
  
  let paddingBottomClass = 'pb-16 md:pb-0'; // Default: space for BottomNav on mobile, none on desktop
  if (currentTrack && !isExpanded) { // MiniPlayer is visible
    paddingBottomClass = 'pb-[calc(theme(spacing.16)+theme(spacing.20))] md:pb-[theme(spacing.20)]'; // Space for BottomNav + MiniPlayer on mobile, MiniPlayer only on md+
  } else if (currentTrack && isExpanded) { // FullScreenPlayer is visible
    paddingBottomClass = 'pb-0'; // Full screen player takes over all space
  }


  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <SonixLogo className="h-12 w-auto animate-pulse" />
      </div>
    );
  }

  // If not authenticated and not on the login page, show loader while redirecting
  if (!isAuthenticated && pathname !== '/login') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <SonixLogo className="h-12 w-auto animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {isAuthenticated && (
        <header className="py-3 px-4 md:px-6 flex justify-between items-center fixed top-0 left-0 right-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/50">
          <Link href="/" aria-label="Go to homepage">
            <SonixLogo className="h-8 w-auto" />
          </Link>
          {/* Pass mock userId, replace with actual when auth is implemented */}
          <ProfileMenu isAuthenticated={isAuthenticated} onLogout={handleLogout} userId="mockUserId123" />
        </header>
      )}

      <main className={`flex-grow ${isAuthenticated ? 'pt-20' : ''} ${paddingBottomClass} transition-all duration-300 animate-fadeIn`}>
        {pathname === '/login' && !isAuthenticated 
          ? React.cloneElement(children as React.ReactElement, { onLogin: handleLogin }) 
          : children}
      </main>

      {isAuthenticated && (
        <>
          {currentTrack && !isExpanded && <MiniPlayer />}
          {currentTrack && isExpanded && <FullScreenPlayer />}
          <BottomNavigationBar />
        </>
      )}
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
