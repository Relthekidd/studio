"use client";

import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Maximize2, Minimize2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlayer } from '@/contexts/PlayerContext';

interface PlayerControlsProps {
  variant?: 'mini' | 'full';
  className?: string;
}

export default function PlayerControls({ variant = 'mini', className }: PlayerControlsProps) {
  const { currentTrack, isPlaying, togglePlayPause, toggleExpand, isExpanded, closeFullScreenPlayer } = usePlayer();

  if (!currentTrack) return null;

  const iconSize = variant === 'mini' ? 18 : 24;
  const buttonSize = variant === 'mini' ? 'icon' : 'default';
  const buttonClass = variant === 'mini' ? 'h-8 w-8' : 'h-12 w-12 md:h-14 md:w-14';

  return (
    <div className={`flex items-center gap-2 md:gap-4 ${className}`}>
      {variant === 'full' && (
        <Button variant="ghost" size={buttonSize} className={buttonClass} aria-label="Previous Track">
          <SkipBack size={iconSize} className="text-foreground" />
        </Button>
      )}
      <Button 
        variant="ghost" 
        size={buttonSize} 
        className={`${buttonClass} bg-primary hover:bg-primary/90 text-primary-foreground rounded-full`} 
        onClick={togglePlayPause}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause size={iconSize} fill="currentColor" /> : <Play size={iconSize} fill="currentColor" />}
      </Button>
      <Button variant="ghost" size={buttonSize} className={buttonClass} aria-label="Next Track">
        <SkipForward size={iconSize} className="text-foreground" />
      </Button>
      
      {variant === 'mini' && (
         <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleExpand} aria-label="Expand Player">
           <ChevronUp size={18} className="text-accent" />
         </Button>
      )}

      {variant === 'full' && (
        <>
          <Button variant="ghost" size={buttonSize} className={`${buttonClass} ml-auto`} aria-label="Volume">
            <Volume2 size={iconSize} className="text-foreground" />
          </Button>
           <Button variant="ghost" size="icon" className="h-10 w-10" onClick={closeFullScreenPlayer} aria-label="Minimize Player">
            <ChevronDown size={24} className="text-accent" />
          </Button>
        </>
      )}
    </div>
  );
}
