'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthProvider';
import { usePlayer } from '@/contexts/PlayerContext';

import { SonixLogo } from '@/components/icons/SonixLogo';
import BottomNavigationBar from '@/components/layout/BottomNavigationBar';
import FullScreenPlayer from '@/components/player/FullScreenPlayer';
import MiniPlayer from '@/components/player/MiniPlayer';
import ProfileMenu from '@/components/layout/ProfileMenu';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const { user, loading, logout } = useAuth();
  const { currentTrack, isExpanded } = usePlayer();

  useEffect(() => {
    if (!loading && !user && pathname !== '/login') {
      router.replace('/login');
    }
  }, [loading, user, pathname, router]);

  const hideNavRoutes = ['/login', '/account', '/settings'];
  const showNav = user && !hideNavRoutes.some((path) => pathname.startsWith(path));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <SonixLogo className="h-12 w-auto animate-pulse" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-28">
      {user && (
        <header className="fixed top-0 inset-x-0 z-50 border-b border-border bg-background/75 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <SonixLogo className="h-8 w-auto" />
            <ProfileMenu isAuthenticated={!!user} userId={user.uid} onLogout={logout} />
          </div>
        </header>
      )}

      <main className={`${user ? 'pt-20' : ''}`}>
        {pathname === '/login' && !user
          ? React.cloneElement(children as React.ReactElement)
          : children}
      </main>

      {showNav && (
        <>
          {currentTrack && !isExpanded && <MiniPlayer />}
          {currentTrack && isExpanded && <FullScreenPlayer />}
          <BottomNavigationBar />
        </>
      )}
    </div>
  );
}
