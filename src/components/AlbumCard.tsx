
"use client";

import Image from 'next/image';
import type { Track } from '@/contexts/PlayerContext'; 
import { PlayCircle, Heart, PlusCircle, PauseCircle } from 'lucide-react'; 
import { usePlayer } from '@/contexts/PlayerContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast"; 

interface AlbumCardProps {
  item: Track & { type?: 'track' | 'playlist' | 'album', description?: string, dataAiHint?: string };
  className?: string;
}

export default function AlbumCard({ item, className }: AlbumCardProps) {
  const { playTrack, currentTrack, isPlaying, togglePlayPause } = usePlayer();
  const { toast } = useToast();
  
  const isCurrentlyPlayingItem = currentTrack?.id === item.id && isPlaying;
  const isCurrentItemPaused = currentTrack?.id === item.id && !isPlaying;

  const handlePlayPauseClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (currentTrack?.id === item.id) {
      togglePlayPause();
    } else {
      playTrack(item); 
      toast({ title: "Playing", description: `${item.title} by ${item.artist || (item.type === 'playlist' ? 'Playlist' : 'Various Artists')}` });
    }
  };
  
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement Firebase like/unlike logic & update user's liked songs
    // Check if user is authenticated
    toast({ title: "Liked!", description: `${item.title} added to your liked songs. (Mock)` });
  };

  const handleAddToPlaylist = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement Firebase add to playlist logic (open modal to select/create playlist)
    // Check if user is authenticated
    toast({ title: "Added", description: `${item.title} added to a playlist. (Mock)` });
  };

  const subText = item.type === 'playlist' ? item.description : item.artist;

  return (
    <Card 
      className={`group relative bg-card/70 hover:bg-card/90 transition-all duration-300 ease-in-out shadow-lg hover:shadow-primary/40 overflow-hidden rounded-xl ${className || 'w-full'}`}
      role="button"
      tabIndex={0}
      aria-label={`Play ${item.title}${subText ? ` by ${subText}` : ''}`}
      onClick={handlePlayPauseClick} // Card click plays/pauses
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handlePlayPauseClick(e as any); }}
    >
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={item.imageUrl || 'https://placehold.co/300x300.png'} // Fallback image
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            unoptimized
            data-ai-hint={item.dataAiHint || (item.type === 'playlist' ? "playlist cover" : "album cover")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePlayPauseClick}
            aria-label={isCurrentlyPlayingItem ? `Pause ${item.title}` : `Play ${item.title}`}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 h-12 w-12 md:h-14 md:w-14 bg-accent/70 hover:bg-accent text-accent-foreground rounded-full shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 focus:opacity-100 focus:scale-100 ${isCurrentlyPlayingItem || isCurrentItemPaused ? 'opacity-100 scale-100' : ''}`}
          >
            {isCurrentlyPlayingItem ? <PauseCircle size={28} fill="currentColor"/> : <PlayCircle size={28} fill="currentColor"/>}
          </Button>

          {item.type !== 'playlist' && item.type !== 'album' && ( // Show only for tracks
            <div className="absolute top-2 right-2 z-10 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button variant="ghost" size="icon" className="h-7 w-7 text-foreground/80 hover:text-primary bg-card/50 hover:bg-card/80 backdrop-blur-sm" onClick={handleLike} aria-label="Like song">
                <Heart size={16} />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-foreground/80 hover:text-primary bg-card/50 hover:bg-card/80 backdrop-blur-sm" onClick={handleAddToPlaylist} aria-label="Add to playlist">
                <PlusCircle size={16} />
              </Button>
            </div>
          )}
        </div>
        <div className="p-3 md:p-4">
          <h3 className="text-sm md:text-base font-semibold text-foreground truncate group-hover:text-primary transition-colors" title={item.title}>
            {item.title}
          </h3>
          {subText && (
            <p className="text-xs md:text-sm text-muted-foreground truncate" title={subText}>
              {subText}
            </p>
          )}
           {item.type === 'album' && item.artist && (
            <p className="text-xs text-muted-foreground truncate" title={item.artist}>
              Album by {item.artist}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
