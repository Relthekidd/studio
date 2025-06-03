'use client';

import { ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlayerStore } from '../store';

export default function ExpandButton() {
  const toggleExpand = usePlayerStore((s) => s.toggleExpand);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="ml-1 size-8"
      onClick={toggleExpand}
      aria-label="Expand Player"
    >
      <ChevronUp size={18} className="text-accent" />
    </Button>
  );
}
