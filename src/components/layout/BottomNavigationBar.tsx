'use client';

import Link from 'next/link';
import { Home, Search, Compass, Library, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthProvider';

const BottomNavigationBar = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin';

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/discover', label: 'Discover', icon: Compass },
    { href: '/library', label: 'Library', icon: Library },
  ];

  const adminNavItems = [{ href: '/admin/upload', label: 'Upload', icon: Upload }];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t border-border bg-card/80 shadow-xl backdrop-blur-md md:hidden">
      {navItems.map((item) => (
        <Button
          asChild
          key={item.label}
          variant="ghost"
          className={`flex h-full flex-1 flex-col items-center justify-center rounded-lg p-2 transition-all ${
            pathname === item.href
              ? 'bg-primary/20 text-primary shadow-inner'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          aria-current={pathname === item.href ? 'page' : undefined}
        >
          <Link href={item.href}>
            <item.icon size={22} />
            <span className="mt-0.5 text-xs">{item.label}</span>
          </Link>
        </Button>
      ))}

      {isAdmin &&
        adminNavItems.map((item) => (
          <Button
            asChild
            key={item.label}
            variant="ghost"
          className={`flex h-full flex-1 flex-col items-center justify-center rounded-lg p-2 transition-all ${
              pathname === item.href
                ? 'bg-primary/20 text-primary shadow-inner'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            aria-current={pathname === item.href ? 'page' : undefined}
          >
            <Link href={item.href}>
              <item.icon size={22} />
              <span className="mt-0.5 text-xs">{item.label}</span>
            </Link>
          </Button>
        ))}
    </nav>
  );
};

export default BottomNavigationBar;
