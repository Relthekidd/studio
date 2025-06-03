'use client';

import PlayPauseButton from './PlayPauseButton';
import SkipButtons from './SkipButtons';
import ExpandButton from './ExpandButton';
import { usePlayerStore } from '../store';

interface Props {
  variant?: 'mini' | 'full';
  className?: string;
}

export default function PlayerControls({ variant = 'mini', className }: Props) {
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  if (!currentTrack) return null;

  return (
    <div
      className={`flex items-center ${variant === 'mini' ? 'gap-1' : 'gap-3 md:gap-4'} ${className}`}
    >
      <SkipButtons size={variant} />
      <PlayPauseButton size={variant} />
      {variant === 'mini' && <ExpandButton />}
    </div>
  );
}
