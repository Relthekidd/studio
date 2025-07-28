'use client';
import Link from 'next/link';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthProvider';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/dashboard/upload', label: 'Upload' },
  { href: '/dashboard/users', label: 'Users' },
  { href: '/dashboard/artists', label: 'Artists' },
  { href: '/dashboard/verify-artists', label: 'Verify Artists' },
  { href: '/dashboard/playlists', label: 'Playlists' },
  { href: '/dashboard/analytics', label: 'Analytics' },
];

export default function Sidebar() {
  const { isAdmin } = useSupabaseAuth();
  const pathname = usePathname();
  if (!isAdmin) return null;
  return (
    <aside className="w-48 border-r border-border p-4 space-y-2">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={
            'block rounded px-2 py-1 hover:bg-accent ' +
            (pathname === href ? 'bg-accent text-accent-foreground' : '')
          }
        >
          {label}
        </Link>
      ))}
    </aside>
  );
}
