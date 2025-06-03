'use client';

import { SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlayerStore } from '../store';

interface Props {
  size?: 'mini' | 'full';
}

export default function SkipButtons({ size = 'mini' }: Props) {
  const skipToNext = usePlayerStore((s) => s.skipToNext);
  const skipToPrev = usePlayerStore((s) => s.skipToPrev);
  const iconSize = size === 'mini' ? 18 : 28;
  const buttonSize = size === 'mini' ? 'icon' : 'lg';
  const className = size === 'mini' ? 'h-8 w-8' : 'h-12 w-12';

  return (
    <>
      <Button
        variant="ghost"
        size={buttonSize}
        className={className}
        onClick={skipToPrev}
        aria-label="Previous Track"
      >
        <SkipBack size={iconSize} className="text-foreground" />
      </Button>

      <Button
        variant="ghost"
        size={buttonSize}
        className={className}
        onClick={skipToNext}
        aria-label="Next Track"
      >
        <SkipForward size={iconSize} className="text-foreground" />
      </Button>
    </>
  );
}
