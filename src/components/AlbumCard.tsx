
"use client";

import Image from 'next/image';
import type { Track } from '@/contexts/PlayerContext'; 
import { PlayCircle, Heart, PlusCircle } from 'lucide-react'; // Added Heart, PlusCircle
import { usePlayer } from '@/contexts/PlayerContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; // For action buttons
import { useToast } from "@/hooks/use-toast"; // For feedback

interface AlbumCardProps {
  item: Track & { type?: 'track' | 'playlist' | 'album', description?: string, dataAiHint?: string };
  className?: string;
}

export default function AlbumCard({ item, className }: AlbumCardProps) {
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const { toast } = useToast();
  const isActive = currentTrack?.id === item.id && isPlaying;

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    playTrack(item); 
    toast({ title: "Playing", description: `${item.title} by ${item.artist || 'Various Artists'}` });
  };
  
  // TODO: Implement actual like and add to playlist functionality with Firebase
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Check if user is authenticated before allowing like
    toast({ title: "Liked!", description: `${item.title} added to your liked songs.` });
  };

  const handleAddToPlaylist = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Check if user is authenticated
    // Open a modal to select playlist or create new
    toast({ title: "Added", description: `${item.title} added to a playlist (mock).` });
  };


  const subText = item.type === 'playlist' ? item.description : item.artist;

  return (
    <Card 
      className={`group relative bg-card/70 hover:bg-card/90 transition-all duration-300 ease-in-out shadow-lg hover:shadow-primary/40 overflow-hidden rounded-xl ${className || 'w-40 md:w-48'}`}
      role="button"
      tabIndex={0}
      aria-label={`Play ${item.title}${subText ? ` by ${subText}` : ''}`}
      // onClick handler moved to main play button for clarity, card click can still trigger play if desired
      // onClick={handlePlay} 
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handlePlay(e as any); }}
    >
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            unoptimized
            data-ai-hint={item.dataAiHint || (item.type === 'playlist' ? "playlist cover" : "album cover")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Main Play Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePlay}
            aria-label={`Play ${item.title}`}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 h-12 w-12 md:h-14 md:w-14 bg-accent/70 hover:bg-accent text-accent-foreground rounded-full shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 focus:opacity-100 focus:scale-100 ${isActive ? 'opacity-100 scale-100' : ''}`}
          >
            <PlayCircle size={isActive ? 28 : 26} fill="currentColor"/>
          </Button>

          {/* Action Buttons (Like, Add to Playlist) - appear on hover */}
          {item.type !== 'playlist' && ( // Example: Don't show like/add for playlists directly on card
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
        </div>
      </CardContent>
    </Card>
  );
}
