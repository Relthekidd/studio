'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthProvider';
import { cn } from '@/lib/utils';

import { SonixLogo } from '@/components/icons/SonixLogo';
import BottomNavigationBar from '@/components/layout/BottomNavigationBar';
import PlayerManager from '@/features/player/PlayerManager';
import { AudioProvider } from '@/features/player/AudioProvider';
import ProfileMenu from '@/components/layout/ProfileMenu';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user && pathname !== '/login') {
      router.replace('/login');
    }
  }, [loading, user, pathname, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <SonixLogo className="h-12 w-auto animate-pulse" />
      </div>
    );
  }

  const isAdmin = user?.role === 'admin';
  const showLayout = user && pathname !== '/login';

  return (
    <div className="relative flex min-h-screen flex-col pb-28">
      {showLayout && (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/75 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex items-center justify-between p-4">
            <SonixLogo className="h-8 w-auto" />
            <div className="flex items-center gap-4">
              {isAdmin && (
                <span className="rounded bg-yellow-200 px-2 py-1 text-xs font-semibold text-yellow-900">
                  Admin
                </span>
              )}
              <ProfileMenu
                isAuthenticated={!!user}
                userId={user?.uid}
                role={user?.role as any}
                onLogout={logout}
              />
            </div>
          </div>
        </header>
      )}

      <main className={cn(showLayout ? 'pt-20' : '', 'flex-grow overflow-y-auto')}>
        {pathname === '/login' && !user
          ? React.cloneElement(children as React.ReactElement)
          : children}
      </main>

      <PlayerManager />
      {showLayout && <BottomNavigationBar />}
      <AudioProvider />
    </div>
  );
}
