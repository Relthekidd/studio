'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Upload, BarChart2 } from 'lucide-react';

import { useAuth } from '@/contexts/AuthProvider';
import SectionTitle from '@/components/SectionTitle';
import { Button } from '@/components/ui/button';

export default function AdminDashboardPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.replace('/');
    }
  }, [user, isAdmin, loading, router]);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="container mx-auto space-y-6 px-4 py-6">
      <div className="flex items-center justify-between">
        <SectionTitle>Admin Dashboard</SectionTitle>
        {/* Optionally add a BackButton or user info here */}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Link href="/admin/upload" className="group">
          <Button
            variant="outline"
            className="w-full h-40 flex flex-col items-center justify-center gap-4 transition-all group-hover:border-primary group-hover:shadow-lg"
          >
            <Upload size={40} className="text-primary group-hover:scale-110 transition-transform" />
            <span className="text-lg font-semibold">Upload Music</span>
            <span className="text-muted-foreground text-sm">Add new albums, singles, or tracks</span>
          </Button>
        </Link>
        <Link href="/admin/streams" className="group">
          <Button
            variant="outline"
            className="w-full h-40 flex flex-col items-center justify-center gap-4 transition-all group-hover:border-primary group-hover:shadow-lg"
          >
            <BarChart2 size={40} className="text-primary group-hover:scale-110 transition-transform" />
            <span className="text-lg font-semibold">Stream Tracker</span>
            <span className="text-muted-foreground text-sm">View analytics and streaming data</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
