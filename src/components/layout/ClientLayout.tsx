
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
  const [authChecked, setAuthChecked] = useState(false); // To prevent flicker
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Simulate checking auth status on mount
    const mockAuthStatus = localStorage.getItem('isMockAuthenticated') === 'true';
    setIsAuthenticated(mockAuthStatus);
    setAuthChecked(true);
  }, []);

  // Effect to handle redirection after authentication state changes
  useEffect(() => {
    if (isAuthenticated && pathname === '/login') {
      // If authenticated and on the login page (e.g., after successful login/signup), redirect to home.
      router.push('/');
    }
  }, [isAuthenticated, pathname, router]);

  // Effect to handle redirecting unauthenticated users to login
  useEffect(() => {
    if (authChecked) {
      if (!isAuthenticated && pathname !== '/login') {
        // If auth has been checked, user is not authenticated, and not on the login page, redirect to login.
        router.push('/login');
      }
    }
  }, [isAuthenticated, authChecked, pathname, router]);

  const handleLogin = () => {
    localStorage.setItem('isMockAuthenticated', 'true');
    setIsAuthenticated(true);
    // Navigation is now handled by the useEffect hook above
  };

  const handleLogout = () => {
    localStorage.removeItem('isMockAuthenticated');
    setIsAuthenticated(false);
    // The useEffect for unauthenticated users will handle redirecting to /login
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
    // This case should be handled by the redirect effect,
    // but as a fallback or during the brief moment before effect runs:
    // You might show a loader here, or nothing, as the redirect should be quick.
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
          <ProfileMenu isAuthenticated={isAuthenticated} onLogout={handleLogout} />
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
