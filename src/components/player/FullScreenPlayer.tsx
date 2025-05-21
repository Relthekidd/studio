"use client";

import Image from 'next/image';
import { usePlayer } from '@/contexts/PlayerContext';
import PlayerControls from './PlayerControls';
import { Progress } from '@/components/ui/progress';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export default function FullScreenPlayer() {
  const { currentTrack, isPlaying, closeFullScreenPlayer } = usePlayer();
  const [progress, setProgress] = useState(30); // Placeholder progress

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
    <div className="fixed inset-0 bg-background/95 backdrop-blur-xl z-[100] flex flex-col items-center justify-center p-4 md:p-8 animate-fadeIn">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-4 right-4 text-muted-foreground hover:text-accent z-[110]" 
        onClick={closeFullScreenPlayer}
        aria-label="Close full screen player"
      >
        <X size={28} />
      </Button>

      <div className="w-full max-w-md md:max-w-lg flex flex-col items-center gap-6 md:gap-8">
        <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-xl overflow-hidden shadow-2xl shadow-primary/30">
          <Image
            src={currentTrack.imageUrl}
            alt={currentTrack.title}
            fill
            className="object-cover"
            unoptimized
            data-ai-hint={currentTrack.dataAiHint || "album cover large"}
          />
        </div>

        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">{currentTrack.title}</h2>
          <p className="text-lg md:text-xl text-muted-foreground mt-1">{currentTrack.artist}</p>
        </div>

        <div className="w-full px-4">
          <Progress value={progress} className="h-2 bg-secondary [&>div]:bg-primary" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
            <span>0:00</span> {/* Placeholder time */}
            <span>3:45</span> {/* Placeholder time */}
          </div>
        </div>
        
        <PlayerControls variant="full" className="mt-4" />
      </div>
    </div>
  );
}
