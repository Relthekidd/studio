
"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Track } from '@/contexts/PlayerContext'; 
import { PlayCircle, Heart, PlusCircle, PauseCircle, DiscAlbum, Music, ListMusic } from 'lucide-react'; 
import { usePlayer } from '@/contexts/PlayerContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast"; 
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";


interface AlbumCardProps {
  item: Track & { type?: 'track' | 'playlist' | 'album' | 'single' | 'artist' | 'user', description?: string, dataAiHint?: string };
  className?: string;
}

// Mock playlists for the dialog
const mockUserPlaylists = [
  { id: 'pl1', name: 'Synthwave Classics' },
  { id: 'pl2', name: 'Chill Beats for Study' },
  { id: 'pl3', name: 'Workout Anthems' },
];

export default function AlbumCard({ item, className }: AlbumCardProps) {
  const { playTrack, currentTrack, isPlaying, togglePlayPause } = usePlayer();
  const { toast } = useToast();
  const [isFavorited, setIsFavorited] = useState(false); 
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  
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
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newFavoriteState = !isFavorited;
    setIsFavorited(newFavoriteState); 
    toast({ 
      title: newFavoriteState ? "Favorited!" : "Unfavorited", 
      description: `${item.title} ${newFavoriteState ? 'added to' : 'removed from'} your liked items. (Mock)` 
    });
    // TODO: Implement Firebase backend call here to update user's liked songs/albums in Firestore.
    // After successful backend update, you might want to refetch library data or update a global state/context
    // so the Library page reflects this change immediately.
  };

  const handleOpenAddToPlaylistModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddToPlaylistModalOpen(true);
  };

  const handleAddTrackToExistingPlaylist = () => {
    if (!selectedPlaylistId) {
      toast({ title: "Error", description: "Please select a playlist.", variant: "destructive" });
      return;
    }
    toast({ title: "Added to Playlist (Mock)", description: `${item.title} added to playlist ID ${selectedPlaylistId}.` });
    // TODO: Implement Firebase backend call: add item.id to the selectedPlaylistId in Firestore.
    setIsAddToPlaylistModalOpen(false);
    setSelectedPlaylistId(null);
  };

  const handleCreateAndAddTrackToNewPlaylist = () => {
    if (!newPlaylistName.trim()) {
      toast({ title: "Error", description: "Please enter a name for the new playlist.", variant: "destructive" });
      return;
    }
    toast({ title: "Playlist Created & Track Added (Mock)", description: `${item.title} added to new playlist: ${newPlaylistName}.` });
    // TODO: Implement Firebase backend calls:
    // 1. Create a new playlist document in Firestore with the newPlaylistName.
    // 2. Add item.id to this new playlist.
    setIsAddToPlaylistModalOpen(false);
    setNewPlaylistName('');
  };


  const subText = item.type === 'playlist' ? item.description : item.artist;
  
  let href = '#'; // Default, should ideally not be used often
  if (item.type === 'album') href = `/album/${item.id}`;
  else if (item.type === 'single') href = `/single/${item.id}`;
  else if (item.type === 'track' && item.albumId) href = `/album/${item.albumId}`; 
  else if (item.type === 'artist') href = `/artist/${item.id}`;
  else if (item.type === 'playlist') href = `/playlist/${item.id}`; // TODO: Create /playlist/[id] page

  const cardContent = (
    <Card 
      className={`group relative bg-card/70 hover:bg-card/90 transition-all duration-300 ease-in-out shadow-lg hover:shadow-primary/40 overflow-hidden rounded-xl ${className || 'w-full'} h-full flex flex-col`}
      role="button"
    >
      <CardContent className="p-0 flex-grow">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={item.imageUrl || 'https://placehold.co/300x300.png'}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            unoptimized
            data-ai-hint={item.dataAiHint || (item.type === 'playlist' ? "playlist cover" : (item.type === 'album' || item.type === 'single' ? "album art" : "track artwork"))}
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

          {(item.type === 'track' || item.type === 'single' || item.type === 'album') && (
            <div className="absolute top-2 right-2 z-10 flex flex-col space-y-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground/80 hover:text-primary bg-card/60 hover:bg-card/90 backdrop-blur-sm rounded-full" onClick={handleToggleFavorite} aria-label="Favorite">
                <Heart size={16} className={isFavorited ? 'fill-primary text-primary' : ''} />
              </Button>
              <Dialog open={isAddToPlaylistModalOpen} onOpenChange={setIsAddToPlaylistModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground/80 hover:text-primary bg-card/60 hover:bg-card/90 backdrop-blur-sm rounded-full" onClick={handleOpenAddToPlaylistModal} aria-label="Add to playlist">
                    <PlusCircle size={16} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-popover">
                  <DialogHeader>
                    <DialogTitle>Add "{item.title}" to playlist</DialogTitle>
                    <DialogDescription>Select an existing playlist or create a new one.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Existing Playlists</Label>
                      {mockUserPlaylists.length > 0 ? (
                        <RadioGroup onValueChange={setSelectedPlaylistId} value={selectedPlaylistId || undefined} className="max-h-40 overflow-y-auto pr-2 scrollbar-thin">
                          {mockUserPlaylists.map((playlist) => (
                            <div key={playlist.id} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded-md">
                              <RadioGroupItem value={playlist.id} id={`playlist-${playlist.id}`} />
                              <Label htmlFor={`playlist-${playlist.id}`} className="font-normal cursor-pointer">{playlist.name}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      ) : (
                        <p className="text-sm text-muted-foreground">No playlists yet. Create one below!</p>
                      )}
                      <Button variant="outline" size="sm" onClick={handleAddTrackToExistingPlaylist} disabled={!selectedPlaylistId} className="w-full mt-2">Add to Selected Playlist</Button>
                    </div>
                    <div className="space-y-2 border-t pt-4 mt-2">
                      <Label htmlFor="new-playlist-name" className="text-sm font-medium">Create New Playlist</Label>
                      <Input 
                        id="new-playlist-name" 
                        placeholder="My Awesome Mix" 
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        className="bg-input"
                      />
                      <Button onClick={handleCreateAndAddTrackToNewPlaylist} className="w-full mt-2">Create & Add</Button>
                    </div>
                  </div>
                  {/* Footer can be used if DialogClose is desired outside specific buttons */}
                  {/* <DialogFooter> <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose> </DialogFooter> */}
                </DialogContent>
              </Dialog>
            </div>
          )}
          {/* Removed Single/Album specific badges from here */}
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

  // Ensure card is only a link if href is meaningful and not '#'
  if (href && href !== '#') {
    return (
      <Link href={href} legacyBehavior>
        <a aria-label={`View details for ${item.title}`} className="block h-full group/link">
          {cardContent}
        </a>
      </Link>
    );
  }
  return cardContent; 
}

    