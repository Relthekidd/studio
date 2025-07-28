import Layout from '@/components/Layout';
import DashboardCard from '@/components/DashboardCard';
import {
  UploadCloud,
  Users as UsersIcon,
  User as ArtistIcon,
  ListMusic,
  BarChart2,
  Settings as SettingsIcon,
} from 'lucide-react';

const cards = [
  {
    href: '/dashboard/upload',
    title: 'Upload Music',
    description: 'Add new tracks to the library',
    icon: UploadCloud,
  },
  {
    href: '/dashboard/artists',
    title: 'Manage Artists',
    description: 'View and edit artist profiles',
    icon: ArtistIcon,
  },
  {
    href: '/dashboard/verify-artists',
    title: 'Verify Artists',
    description: 'Approve new artist accounts',
    icon: ArtistIcon,
  },
  {
    href: '/dashboard/users',
    title: 'Manage Users',
    description: 'Manage application users',
    icon: UsersIcon,
  },
  {
    href: '/dashboard/playlists',
    title: 'Manage Playlists',
    description: 'Organize user playlists',
    icon: ListMusic,
  },
  {
    href: '/dashboard/analytics',
    title: 'Analytics',
    description: 'View usage analytics',
    icon: BarChart2,
  },
  {
    href: '/dashboard/settings',
    title: 'Settings',
    description: 'Configure dashboard options',
    icon: SettingsIcon,
  },
];

export default function DashboardPage() {
  return (
    <Layout>
      <div className="mx-auto max-w-7xl space-y-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        {cards.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <DashboardCard key={card.href} {...card} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Dashboard modules could not be loaded.</p>
        )}
      </div>
    </Layout>
  );
}
