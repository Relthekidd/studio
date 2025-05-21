
"use client";

import Link from 'next/link';
import { Home, Search, Library, Music2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/library', label: 'Library', icon: Library },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/', label: 'Home', icon: Home },
  { href: '/new-songs', label: 'New Songs', icon: Music2 },
];

export default function BottomNavigationBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card/95 backdrop-blur-md border-t border-border shadow-lg z-40 flex items-center justify-around md:hidden">
      {/* md:hidden makes this bar primarily for mobile/tablet views */}
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
            <item.icon size={22} className={pathname === item.href ? "text-primary" : ""} />
            <span className="text-xs mt-0.5">{item.label}</span>
          </Link>
        </Button>
      ))}
    </nav>
  );
}
