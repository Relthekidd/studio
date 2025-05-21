
"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Track } from '@/contexts/PlayerContext'; 
import { PlayCircle, Heart, PlusCircle, PauseCircle, DiscAlbum, Music } from 'lucide-react'; 
import { usePlayer } from '@/contexts/PlayerContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast"; 
import { Badge } from '@/components/ui/badge';
import { useState } from 'react'; // For mock isFavorited state

interface AlbumCardProps {
  item: Track & { type?: 'track' | 'playlist' | 'album' | 'single', description?: string, dataAiHint?: string };
  className?: string;
}

export default function AlbumCard({ item, className }: AlbumCardProps) {
  const { playTrack, currentTrack, isPlaying, togglePlayPause } = usePlayer();
  const { toast } = useToast();
  const [isFavorited, setIsFavorited] = useState(false); // Mock favorite state
  
  const isCurrentlyPlayingItem = currentTrack?.id === item.id && isPlaying;
  const isCurrentItemPaused = currentTrack?.id === item.id && !isPlaying;

  const handlePlayPauseClick = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    if (currentTrack?.id === item.id) {
      togglePlayPause();
    } else {
      playTrack(item); 
      toast({ title: "Playing", description: `${item.title} ${item.artist ? `by ${item.artist}` : ''}` });
    }
  };
  
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited); // Toggle mock state
    toast({ 
      title: isFavorited ? "Unfavorited!" : "Favorited!", 
      description: `${item.title} ${isFavorited ? 'removed from' : 'added to'} your liked songs. (Mock)` 
    });
    // TODO: Implement Firebase backend call here to update user's liked songs
  };

  const handleAddToPlaylist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast({ title: "Added to Playlist", description: `${item.title} added to a playlist. (Mock)` });
    // TODO: Implement Firebase backend call here (e.g., open a playlist selection modal, then update DB)
  };

  const subText = item.type === 'playlist' ? item.description : item.artist;
  
  let href = '#';
  if (item.type === 'album') {
    href = `/album/${item.id}`;
  } else if (item.type === 'single') {
    href = `/single/${item.id}`; // Use single detail page
  } else if (item.type === 'track' && item.albumId) {
    href = `/album/${item.albumId}`; 
  } else if (item.type === 'artist') {
    href = `/artist/${item.id}`;
  } else if (item.type === 'playlist') {
    href = `/playlist/${item.id}`; // Link for playlist detail page
  }

  const cardContent = (
    <Card 
      className={`group relative bg-card/70 hover:bg-card/90 transition-all duration-300 ease-in-out shadow-lg hover:shadow-primary/40 overflow-hidden rounded-xl ${className || 'w-full'} h-full flex flex-col`}
      role="button" 
      // Removed onClick from Card itself, Link will handle navigation.
      // onKeyDown also removed, Link handles accessibility.
    >
      <CardContent className="p-0 flex-grow">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={item.imageUrl || 'https://placehold.co/300x300.png'}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            unoptimized
            data-ai-hint={item.dataAiHint || (item.type === 'playlist' ? "playlist cover" : (item.type === 'album' || item.type === 'single' ? "album cover" : "track artwork"))}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePlayPauseClick}
            aria-label={isCurrentlyPlayingItem ? `Pause ${item.title}` : `Play ${item.title}`}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 h-12 w-12 md:h-14 md:w-14 bg-accent/70 hover:bg-accent text-accent-foreground rounded-full shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 focus:opacity-100 focus:scale-100 ${isCurrentlyPlayingItem || isCurrentItemPaused ? 'opacity-100 scale-100' : ''}`}
          >
            {isCurrentlyPlayingItem ? <PauseCircle size={28} fill="currentColor"/> : <PlayCircle size={28} fill="currentColor"/>}
          </Button>

          {/* Quick Action Buttons - visible on hover, positioned top-right */}
          {(item.type === 'track' || item.type === 'single' || item.type === 'album') && (
            <div className="absolute top-2 right-2 z-10 flex flex-col space-y-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground/80 hover:text-primary bg-card/60 hover:bg-card/90 backdrop-blur-sm rounded-full" onClick={handleLike} aria-label="Like song">
                <Heart size={16} className={isFavorited ? 'fill-primary text-primary' : ''} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground/80 hover:text-primary bg-card/60 hover:bg-card/90 backdrop-blur-sm rounded-full" onClick={handleAddToPlaylist} aria-label="Add to playlist">
                <PlusCircle size={16} />
              </Button>
            </div>
          )}
          <div className="absolute bottom-2 left-2 z-10">
             {item.type === 'album' && <Badge variant="secondary" className="text-xs backdrop-blur-sm bg-black/30"><DiscAlbum size={12} className="mr-1"/> Album</Badge>}
             {item.type === 'single' && <Badge variant="secondary" className="text-xs backdrop-blur-sm bg-black/30"><Music size={12} className="mr-1"/> Single</Badge>}
          </div>
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

  if (href !== '#') {
    return (
      <Link href={href} legacyBehavior>
        {/* The <a> tag handles navigation for the entire card */}
        <a aria-label={`View details for ${item.title}`} className="block h-full group/link">
          {cardContent}
        </a>
      </Link>
    );
  }
  // Fallback for items that don't have a dedicated link target (e.g., a raw track not yet associated with an album)
  // Or if we want the card to not be a link by default if href is '#'
  return cardContent; 
}

