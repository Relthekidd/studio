
"use client";

import Image from 'next/image';
import { usePlayer } from '@/contexts/PlayerContext';
import PlayerControls from './PlayerControls'; // Will be updated
import { Progress } from '@/components/ui/progress';
import { ChevronDown, ListMusic, Volume2, VolumeX, Shuffle, Repeat, Repeat1 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider'; // For volume control
import { formatTime } from '@/lib/utils'; // Helper for time display

export default function FullScreenPlayer() {
  const { 
    currentTrack, 
    isPlaying, 
    closeFullScreenPlayer, 
    progress, 
    currentTime, 
    duration,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    shuffleMode,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
    seek
  } = usePlayer();

  if (!currentTrack) return null;

  const handleSeek = (value: number[]) => {
    if (duration > 0) {
      seek((value[0] / 100) * duration);
    }
  };
  
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100);
  };

  const getRepeatIcon = () => {
    if (repeatMode === 'one') return <Repeat1 size={20} className="text-primary" />;
    if (repeatMode === 'all') return <Repeat size={20} className="text-primary" />;
    return <Repeat size={20} />;
  };

  return (
    <div 
      className="fixed inset-0 bg-gradient-to-br from-background via-card to-background/90 backdrop-blur-2xl z-[100] flex flex-col items-center justify-between p-4 md:p-6 animate-slideInUp"
    >
      {/* Top Bar: Close button and Queue button */}
      <div className="w-full flex justify-between items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground hover:text-accent z-[110] transition-colors" 
          onClick={closeFullScreenPlayer}
          aria-label="Close full screen player"
        >
          <ChevronDown size={28} />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground hover:text-accent z-[110] transition-colors" 
          // onClick={openQueueModal} // TODO: Implement queue modal
          aria-label="View Queue"
        >
          <ListMusic size={22} />
        </Button>
      </div>

      {/* Album Art & Info */}
      <div className="flex flex-col items-center gap-4 md:gap-6 mt-auto mb-auto">
        <div className="relative w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-xl overflow-hidden shadow-2xl shadow-primary/30 group">
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
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground drop-shadow-md">{currentTrack.title}</h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mt-1 drop-shadow-sm">{currentTrack.artist}</p>
          {currentTrack.album && <p className="text-sm text-muted-foreground/70 mt-0.5">{currentTrack.album}</p>}
        </div>
      </div>
      
      {/* Seek Bar & Time */}
      <div className="w-full max-w-xl px-2 md:px-4 space-y-2 mb-4">
        <Slider
            defaultValue={[0]}
            value={[progress]}
            max={100}
            step={0.1}
            onValueChange={handleSeek}
            className="h-2 [&>span:first-child]:h-2 [&>span:first-child>span]:bg-gradient-to-r [&>span:first-child>span]:from-accent [&>span:first-child>span]:to-primary [&>span:last-child]:h-4 [&>span:last-child]:w-4"
            aria-label="Seek bar"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
        
      {/* Main Player Controls */}
      <PlayerControls variant="full" className="mb-4" />

      {/* Secondary Controls: Shuffle, Repeat, Volume */}
      <div className="w-full max-w-xl flex justify-between items-center px-2 md:px-4 mb-4">
        <Button variant="ghost" size="icon" onClick={toggleShuffle} aria-label="Shuffle" className="text-muted-foreground hover:text-primary">
          <Shuffle size={20} className={shuffleMode ? "text-primary" : ""} />
        </Button>
        
        <div className="flex items-center gap-2 w-1/3 max-w-[150px]">
           <Button variant="ghost" size="icon" onClick={toggleMute} className="text-muted-foreground hover:text-primary">
            {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </Button>
          <Slider
            defaultValue={[volume * 100]}
            value={[isMuted ? 0 : volume * 100]}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
            className="h-1.5 [&>span:first-child]:h-1.5 [&>span:first-child>span]:bg-primary [&>span:last-child]:h-3 [&>span:last-child]:w-3 [&>span:last-child]:border-primary/70"
            aria-label="Volume control"
          />
        </div>

        <Button variant="ghost" size="icon" onClick={toggleRepeat} aria-label="Repeat" className="text-muted-foreground hover:text-primary">
          {getRepeatIcon()}
        </Button>
      </div>
    </div>
  );
}

