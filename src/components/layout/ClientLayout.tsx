
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
  const [authChecked, setAuthChecked] = useState(false); // To ensure initial auth check is done
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check auth status from localStorage on initial mount
    const mockAuthStatus = localStorage.getItem('isMockAuthenticated') === 'true';
    setIsAuthenticated(mockAuthStatus);
    setAuthChecked(true); // Mark that the initial check is complete
  }, []);

  useEffect(() => {
    if (authChecked) { // Only perform redirects after the initial auth status has been checked
      if (isAuthenticated && pathname === '/login') {
        router.replace('/'); // User is authenticated and on login page, redirect to home
      } else if (!isAuthenticated && pathname !== '/login') {
        router.replace('/login'); // User is not authenticated and not on login page, redirect to login
      }
    }
  }, [isAuthenticated, authChecked, pathname, router]);

  const handleLogin = () => {
    localStorage.setItem('isMockAuthenticated', 'true');
    setIsAuthenticated(true);
    // Redirection to home is now handled by the useEffect above when isAuthenticated and pathname conditions match.
  };

  const handleLogout = () => {
    localStorage.removeItem('isMockAuthenticated');
    setIsAuthenticated(false);
    // Redirection to /login is handled by the useEffect above.
  };
  
  let paddingBottomClass = 'pb-16 md:pb-0'; // Default: space for BottomNav on mobile, none on desktop
  if (currentTrack && !isExpanded) { // MiniPlayer is visible
    // Space for BottomNav + MiniPlayer on mobile, MiniPlayer only on md+
    paddingBottomClass = 'pb-[calc(theme(spacing.16)+theme(spacing.20))] md:pb-[theme(spacing.20)]'; 
  } else if (currentTrack && isExpanded) { // FullScreenPlayer is visible
    paddingBottomClass = 'pb-0'; // Full screen player takes over all space
  }


  if (!authChecked) {
    // Show a global loader or skeleton while checking auth, prevents content flash
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <SonixLogo className="h-12 w-auto animate-pulse" />
      </div>
    );
  }

  // If not authenticated and not on the login page, ClientLayout's useEffect will redirect.
  // This ensures that during the brief moment of redirection, we don't render child content.
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
        {/* Pass handleLogin to LoginPage if it's rendered as a child */}
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
