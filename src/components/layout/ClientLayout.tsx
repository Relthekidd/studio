
"use client";

import type { ReactNode } from 'react';
import Link from 'next/link';
import React from 'react'; // Added import for React
import { PlayerProvider, usePlayer } from '@/contexts/PlayerContext';
import MiniPlayer from '@/components/player/MiniPlayer';
import FullScreenPlayer from '@/components/player/FullScreenPlayer';
import BottomNavigationBar from './BottomNavigationBar';
import { SonixLogo } from '@/components/icons/SonixLogo';
import ProfileMenu from './ProfileMenu';
import { useEffect, useState }
from 'react';
import { usePathname, useRouter } from 'next/navigation';

function LayoutContent({ children }: { children: ReactNode }) {
  const { currentTrack, isExpanded } = usePlayer();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false); // To prevent flicker
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Simulate checking auth status on mount (e.g., from Firebase onAuthStateChanged)
    const mockAuthStatus = localStorage.getItem('isMockAuthenticated') === 'true';
    setIsAuthenticated(mockAuthStatus);
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    if (authChecked) {
      if (!isAuthenticated && pathname !== '/login') {
        router.push('/login');
      }
      // Optional: Redirect from /login if already authenticated
      // else if (isAuthenticated && pathname === '/login') {
      //   router.push('/');
      // }
    }
  }, [isAuthenticated, authChecked, pathname, router]);

  const handleLogin = () => {
    localStorage.setItem('isMockAuthenticated', 'true');
    setIsAuthenticated(true);
    router.push('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('isMockAuthenticated');
    setIsAuthenticated(false);
    // No need to push to /login here, the effect above will handle it.
  };

  let paddingBottomClass = 'pb-16 md:pb-0'; // Space for BottomNav on mobile
  if (currentTrack) {
    paddingBottomClass = isExpanded 
      ? 'pb-0' // Full screen player takes over
      : 'pb-[calc(4rem+5rem)] md:pb-[5rem]'; // Space for BottomNav + MiniPlayer on mobile, MiniPlayer only on md+
  }
  
  if (!authChecked) {
    return ( // Or a loading spinner
      <div className="flex items-center justify-center min-h-screen bg-background">
        <SonixLogo className="h-12 w-auto animate-pulse" />
      </div>
    );
  }

  if (!isAuthenticated && pathname !== '/login') {
    // This case should be handled by the redirect, but as a fallback:
    return null; // Or a specific loading/redirecting message
  }


  return (
    <div className="flex flex-col min-h-screen">
      {isAuthenticated && (
        <header className="py-3 px-4 md:px-6 flex justify-between items-center fixed top-0 left-0 right-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/50">
          <Link href="/" aria-label="Go to homepage">
            <SonixLogo className="h-8 w-auto" />
          </Link>
          <ProfileMenu isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        </header>
      )}

      <main className={`flex-grow ${isAuthenticated ? 'pt-20' : ''} ${paddingBottomClass} transition-all duration-300 animate-fadeIn`}>
        {/* Pass handleLogin to LoginPage if it's rendered as a child, or handle in LoginPage directly */}
        {pathname === '/login' && !isAuthenticated ? React.cloneElement(children as React.ReactElement, { onLogin: handleLogin }) : children}
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
