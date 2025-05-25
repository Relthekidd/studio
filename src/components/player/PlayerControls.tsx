'use client';

import { Play, Pause, SkipForward, SkipBack, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlayer } from '@/contexts/PlayerContext';

interface PlayerControlsProps {
  variant?: 'mini' | 'full';
  className?: string;
}

export default function PlayerControls({ variant = 'mini', className }: PlayerControlsProps) {
  const {
    currentTrack,
    isPlaying,
    togglePlayPause,
    toggleExpand,
    playNextTrack, // TODO: implement
    playPreviousTrack, // TODO: implement
  } = usePlayer();

  if (!currentTrack) return null;

  const iconSize = variant === 'mini' ? 18 : 28; // Larger for full player
  const mainButtonSize = variant === 'mini' ? 'icon' : 'lg'; // Larger play/pause for full
  const mainButtonClass = variant === 'mini' ? 'h-9 w-9' : 'h-14 w-14 md:h-16 md:w-16';
  const skipButtonClass = variant === 'mini' ? 'h-8 w-8' : 'h-12 w-12';

  return (
    <div
      className={`flex items-center ${variant === 'mini' ? 'gap-1' : 'gap-3 md:gap-4'} ${className}`}
    >
      <Button
        variant="ghost"
        size={variant === 'mini' ? 'icon' : mainButtonSize}
        className={skipButtonClass}
        onClick={() => playPreviousTrack()} // Updated to arrow function
        aria-label="Previous Track"
        disabled // TODO: Enable when implemented
      >
        <SkipBack size={iconSize} className="text-foreground" />
      </Button>

      <Button
        variant="default" // Always default for prominence
        size={mainButtonSize}
        className={`${mainButtonClass} rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-primary/50 active:scale-90`}
        onClick={() => togglePlayPause()} // Updated to arrow function
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <Pause size={iconSize} fill="currentColor" />
        ) : (
          <Play size={iconSize} fill="currentColor" />
        )}
      </Button>

      <Button
        variant="ghost"
        size={variant === 'mini' ? 'icon' : mainButtonSize}
        className={skipButtonClass}
        onClick={() => playNextTrack()} // Updated to arrow function
        aria-label="Next Track"
        disabled // TODO: Enable when implemented
      >
        <SkipForward size={iconSize} className="text-foreground" />
      </Button>

      {variant === 'mini' && (
        <Button
          variant="ghost"
          size="icon"
          className="ml-1 size-8"
          onClick={() => toggleExpand()}
          aria-label="Expand Player"
        >
          <ChevronUp size={18} className="text-accent" />
        </Button>
      )}
      {/* Full variant specific controls like volume, shuffle, repeat are now in FullScreenPlayer.tsx */}
    </div>
  );
}
