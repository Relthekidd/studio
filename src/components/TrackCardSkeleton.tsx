'use client';
import { Skeleton } from '@/components/ui/skeleton';

export default function TrackCardSkeleton() {
  return (
    <div className="space-y-2 rounded-xl bg-card/50 p-3">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}
