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
    <div className="container mx-auto max-w-xl space-y-6 py-8">
      <SectionTitle className="text-3xl font-bold">Admin Dashboard</SectionTitle>
      <div className="grid gap-4">
        <Button asChild variant="outline" className="h-32 w-full text-xl">
          <Link href="/admin/upload" className="flex h-full w-full flex-col items-center justify-center gap-2">
            <Upload size={32} />
            Upload Music
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-32 w-full text-xl">
          <Link href="/admin/streams" className="flex h-full w-full flex-col items-center justify-center gap-2">
            <BarChart2 size={32} />
            Stream Tracker
          </Link>
        </Button>
      </div>
    </div>
  );
}
