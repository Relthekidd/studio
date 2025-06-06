'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        if (typeof window !== 'undefined' && window.history.length > 1) {
          router.back();
        } else {
          router.push('/discover');
        }
      }}
      className="mb-4 flex items-center gap-2 text-sm text-muted-foreground transition hover:text-primary"
    >
      <ArrowLeft size={16} />
      <span>Back</span>
    </button>
  );
}
