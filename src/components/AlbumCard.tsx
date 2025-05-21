
"use client";

import Image from 'next/image';
import type { Track } from '@/contexts/PlayerContext'; 
import { PlayCircle } from 'lucide-react';
import { usePlayer } from '@/contexts/PlayerContext';
import { Card, CardContent } from '@/components/ui/card';

interface AlbumCardProps {
  // Item can be a track, album, or playlist with common properties
  item: Track & { type?: 'track' | 'playlist' | 'album', description?: string, dataAiHint?: string };
  className?: string;
}

export default function AlbumCard({ item, className }: AlbumCardProps) {
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const isActive = currentTrack?.id === item.id && isPlaying;

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    // For playlists or albums, this might open a detail view or play the first track
    // For now, it plays the item if it's a track-like structure
    playTrack(item); 
  };

  // Determine display text (artist for tracks/albums, description for playlists)
  const subText = item.type === 'playlist' ? item.description : item.artist;

  return (
    <Card 
      className={`group relative bg-card/80 hover:bg-card transition-all duration-300 ease-in-out shadow-lg hover:shadow-primary/30 overflow-hidden ${className || 'w-40 md:w-48'}`}
      onClick={handlePlay}
      role="button"
      tabIndex={0}
      aria-label={`Play ${item.title}${subText ? ` by ${subText}` : ''}`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handlePlay(e as any); }}
    >
      <CardContent className="p-0">
        <div className="relative aspect-square">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized // Using placehold.co, no need for Next.js optimization here
            data-ai-hint={item.dataAiHint || (item.type === 'playlist' ? "playlist cover" : "album cover")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <button
            onClick={handlePlay}
            aria-label={`Play ${item.title}`}
            className={`absolute bottom-2 right-2 md:bottom-3 md:right-3 z-10 p-2 bg-accent/80 hover:bg-accent text-accent-foreground rounded-full shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 focus:opacity-100 focus:scale-100 ${isActive ? 'opacity-100 scale-100' : ''}`}
          >
            <PlayCircle size={24} fill="currentColor"/>
          </button>
        </div>
        <div className="p-3 md:p-4">
          <h3 className="text-sm md:text-base font-semibold text-foreground truncate" title={item.title}>
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
