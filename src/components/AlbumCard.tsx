'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Heart, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { RadioGroup } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { Track } from '@/types/music';
import { useState, useEffect } from 'react';
import { formatArtists } from '@/utils/formatArtists';
import { saveLikedSong, isSongLiked } from '@/utils/saveLibraryData'; // Import utility functions
import { useUser } from '@/hooks/useUser';

export function AlbumCard({ item, className }: { item: Track; className?: string }) {
  const router = useRouter();
  const { user } = useUser();
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);

  // Determine type dynamically: "album" if albumId exists, otherwise "single"
  const type = item.albumId ? 'album' : 'single';
  const id = item.id;

  // Generate the href dynamically based on type and id
  const href = `/${type}/${id}`;

  // Fetch whether the song is liked
  useEffect(() => {
    if (user?.uid) {
      isSongLiked(user.uid, item.id).then(setIsFavorited);
    }
  }, [user?.uid, item.id]);

  const handleCardClick = () => {
    if (!type || !id) {
      console.error('Invalid type or id:', { type, id });
      return;
    }
    router.push(href); // Navigate to the details page
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); // Prevent default scrolling behavior for Space key
      handleCardClick();
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click propagation
    if (!user?.uid) {
      console.error('User not logged in');
      return;
    }

    try {
      const newFavoritedState = !isFavorited;
      setIsFavorited(newFavoritedState); // Optimistically update the UI
      await saveLikedSong(user.uid, item, newFavoritedState, item.id); // Call saveLikedSong with songId and userId
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setIsFavorited(!isFavorited); // Revert the UI state if an error occurs
    }
  };

  return (
    <div
      className={`group relative block rounded-xl bg-card/70 transition-all hover:bg-card/90 ${className || 'w-full'}`}
      onClick={handleCardClick} // Use router.push for navigation
      role="button" // Add role for accessibility
      tabIndex={0} // Make the div focusable
      onKeyDown={handleKeyDown} // Handle keyboard interactions
      aria-label={`View details for ${item.title}`} // Add an accessible label
    >
      <div className="relative aspect-square">
        <Image
          src={item.coverURL && item.coverURL !== '' ? item.coverURL : '/placeholder.png'}
          alt={item.title}
          width={500}
          height={500}
          className="size-full rounded-t-xl object-cover"
        />
        <div className="absolute right-2 top-2 z-20 flex flex-col gap-1">
          {/* Like Button */}
          <Button
            onClick={handleToggleFavorite}
            size="icon"
            className={`bg-muted ${isFavorited ? 'text-primary' : ''}`}
            aria-label={isFavorited ? `Unlike ${item.title}` : `Like ${item.title}`}
          >
            <Heart size={16} className={isFavorited ? 'fill-primary text-primary' : ''} />
          </Button>

          {/* Add to Playlist Button */}
          <Dialog open={isAddToPlaylistModalOpen} onOpenChange={setIsAddToPlaylistModalOpen}>
            <DialogTrigger asChild>
              <Button
                size="icon"
                className="bg-muted"
                onClick={(e) => e.stopPropagation()}
                aria-label={`Add ${item.title} to playlist`}
              >
                <PlusCircle size={16} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add to Playlist</DialogTitle>
                <DialogDescription>Select a playlist or create a new one.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Label>Existing Playlists</Label>
                <RadioGroup
                  onValueChange={setSelectedPlaylistId}
                  value={selectedPlaylistId || undefined}
                >
                  {/* playlists.map(pl => (...) ) */}
                </RadioGroup>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="p-3">
        <h3 className="truncate text-sm font-semibold">{item.title}</h3>
        <p className="truncate text-xs text-muted-foreground">{formatArtists(item.artists)}</p>
      </div>
    </div>
  );
}
