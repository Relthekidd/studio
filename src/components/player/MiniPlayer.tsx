"use client";

import Image from 'next/image';
import { usePlayer } from '@/contexts/PlayerContext';
import PlayerControls from './PlayerControls';
import { Progress } from '@/components/ui/progress'; // Assuming Progress component exists

export default function MiniPlayer() {
  const { currentTrack, isPlaying, toggleExpand } = usePlayer();
  // Placeholder for progress
  const [progress, setProgress] = useState(30); 

  useEffect(() => {
    if (isPlaying && currentTrack) {
      const timer = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 5));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isPlaying, currentTrack]);


  if (!currentTrack) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 h-20 bg-card/90 backdrop-blur-md border-t border-border shadow-2xl z-50 flex items-center px-4 md:px-6 transition-transform duration-300 ease-in-out"
      role="complementary"
      aria-label="Music Player"
    >
      <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0 cursor-pointer" onClick={toggleExpand}>
        <div className="relative h-12 w-12 md:h-14 md:w-14 rounded-md overflow-hidden shadow-md">
          <Image
            src={currentTrack.imageUrl}
            alt={currentTrack.title}
            fill
            className="object-cover"
            unoptimized
            data-ai-hint={currentTrack.dataAiHint || "album cover"}
          />
        </div>
        <div className="flex flex-col min-w-0">
          <p className="text-sm md:text-base font-semibold text-foreground truncate">{currentTrack.title}</p>
          <p className="text-xs md:text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
        </div>
      </div>
      
      <div className="hidden md:flex flex-col items-center w-1/3 mx-4">
        <PlayerControls variant="mini" />
        <Progress value={progress} className="h-1 w-full mt-1 bg-secondary [&>div]:bg-primary" />
      </div>

      <div className="md:hidden ml-auto">
         <PlayerControls variant="mini" />
      </div>
    </div>
  );
}

// Need to import useState and useEffect
import { useState, useEffect } from 'react';
