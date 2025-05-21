
"use client";

import Image from 'next/image';
import { usePlayer } from '@/contexts/PlayerContext';
import PlayerControls from './PlayerControls';
import { Progress } from '@/components/ui/progress';
import { ChevronDown } from 'lucide-react'; // Changed from X for consistency with mini player expand/collapse
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export default function FullScreenPlayer() {
  const { currentTrack, isPlaying, closeFullScreenPlayer } = usePlayer();
  const [progress, setProgress] = useState(30); // Placeholder progress

  useEffect(() => {
    // TODO: Replace with actual audio progress from HTMLAudioElement
    if (isPlaying && currentTrack) {
      const timer = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 5)); // Simulate progress
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isPlaying, currentTrack]);

  if (!currentTrack) return null;

  return (
    <div 
      className="fixed inset-0 bg-background/80 backdrop-blur-2xl z-[100] flex flex-col items-center justify-center p-4 md:p-8 animate-slideInUp"
      // The animate-slideInUp should be defined in globals.css or tailwind.config.ts
    >
      {/* Dynamic Blurred Background */}
      <div 
        className="absolute inset-0 z-[-1] overflow-hidden"
        aria-hidden="true"
      >
        <Image
          src={currentTrack.imageUrl}
          alt=""
          fill
          className="object-cover filter blur-2xl brightness-50 scale-110"
          unoptimized
        />
         <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30"></div>
      </div>

      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-5 right-5 text-muted-foreground hover:text-accent z-[110] transition-colors" 
        onClick={closeFullScreenPlayer}
        aria-label="Close full screen player"
      >
        <ChevronDown size={32} />
      </Button>

      <div className="w-full max-w-md md:max-w-lg flex flex-col items-center gap-6 md:gap-8">
        <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-xl overflow-hidden shadow-2xl shadow-primary/40 group">
          <Image
            src={currentTrack.imageUrl}
            alt={currentTrack.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
            data-ai-hint={currentTrack.dataAiHint || "album cover large"}
          />
           <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300"></div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground drop-shadow-md">{currentTrack.title}</h2>
          <p className="text-lg md:text-xl text-muted-foreground mt-1 drop-shadow-sm">{currentTrack.artist}</p>
        </div>

        <div className="w-full px-4">
           {/* TODO: Implement actual audio time and duration */}
          <Progress value={progress} className="h-2 bg-secondary/50 [&>div]:bg-gradient-to-r [&>div]:from-accent [&>div]:to-primary" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
            <span>1:23</span> {/* Placeholder current time */}
            <span>3:45</span> {/* Placeholder total time */}
          </div>
        </div>
        
        <PlayerControls variant="full" className="mt-4" />
        {/* TODO: Add volume control, shuffle, repeat, queue buttons */}
      </div>
    </div>
  );
}
