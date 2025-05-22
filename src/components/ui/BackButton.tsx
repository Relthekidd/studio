'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition mb-4"
    >
      <ArrowLeft size={16} />
      <span>Back</span>
    </button>
  );
}
