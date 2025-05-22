"use client";

import Link from 'next/link';
import { Home, Search, Compass, Library, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
// import { useAuth } from '@/hooks/useAuth';

const BottomNavigationBar = () => {
  const pathname = usePathname();
  const { user } = useUser();
  // const { isAdmin } = useAuth();
  const isAdmin = false; // TODO: Replace with actual admin check when useAuth is available

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/discover', label: 'Discover', icon: Compass },
    { href: '/library', label: 'Library', icon: Library },
  ];

  // Admin-specific navigation items
  const adminNavItems = [
    { href: '/admin/upload', label: 'Upload', icon: Upload },
    // Add more admin links here if needed
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card/95 backdrop-blur-md border-t border-border shadow-lg z-40 flex items-center justify-around md:hidden">
      {navItems.map((item) => (
        <Button
          asChild
          key={item.label}
          variant="ghost"
          className={`flex flex-col items-center justify-center h-full p-2 rounded-none flex-1 ${
            pathname === item.href
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          aria-current={pathname === item.href ? 'page' : undefined}
        >
          <Link href={item.href}>
            <item.icon size={22} />
            <span className="text-xs mt-0.5">{item.label}</span>
          </Link>
        </Button>
      ))}

      {/* Render admin nav items only if user is admin */}
      {isAdmin &&
        adminNavItems.map((item) => (
          <Button
            asChild
            key={item.label}
            variant="ghost"
            className={`flex flex-col items-center justify-center h-full p-2 rounded-none flex-1 ${
              pathname === item.href
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            aria-current={pathname === item.href ? 'page' : undefined}
          >
            <Link href={item.href}>
              <item.icon size={22} />
              <span className="text-xs mt-0.5">{item.label}</span>
            </Link>
          </Button>
        ))}
    </nav>
  );
  // Debug: log user info
  console.log('[BottomNavigationBar] user:', user);
};

export default BottomNavigationBar;
