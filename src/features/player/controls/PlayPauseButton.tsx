'use client';

import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlayerStore } from '../store';

interface Props {
  size?: 'mini' | 'full';
}

export default function PlayPauseButton({ size = 'mini' }: Props) {
  const { isPlaying, togglePlayPause } = usePlayerStore();

  const iconSize = size === 'mini' ? 18 : 28;
  const mainButtonClass = size === 'mini' ? 'h-9 w-9' : 'h-14 w-14 md:h-16 md:w-16';

  return (
    <Button
      variant="default"
      className={`${mainButtonClass} rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-primary/50 active:scale-90`}
      onClick={togglePlayPause}
      aria-label={isPlaying ? 'Pause' : 'Play'}
    >
      {isPlaying ? (
        <Pause size={iconSize} fill="currentColor" />
      ) : (
        <Play size={iconSize} fill="currentColor" />
      )}
    </Button>
  );
}
