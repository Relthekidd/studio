'use client';

import Link from 'next/link';
import { Heart, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { usePlayer } from '@/contexts/PlayerContext';
import { useState } from 'react';

export function AlbumCard({ item, className }: { item: any, className?: string }) {
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const { setTrack, play } = usePlayer();
  const playlists: any[] = []; // TODO: real playlists
  const isFavorited = false; // TODO: real state
  const handleToggleFavorite = () => {}; // TODO: implement favorite logic

  const href = item.type === 'album' ? `/album/${item.id}`
              : item.type === 'single' ? `/single/${item.id}`
              : item.type === 'track' && item.albumId ? `/album/${item.albumId}`
              : item.type === 'artist' ? `/artist/${item.id}`
              : item.type === 'playlist' ? `/playlist/${item.id}`
              : '#';

  const handlePlayClick = () => {
    if (item.audioUrl) {
      setTrack({
        id: item.id,
        title: item.title,
        artist: item.artist,
        audioUrl: item.audioUrl,
        imageUrl: item.coverUrl,
        duration: item.duration || 0,
        type: item.type || 'track',
      });
      play();
    }
  };

  const card = (
    <div
      className={`group relative bg-card/70 hover:bg-card/90 transition-all rounded-xl ${className || 'w-full'} cursor-pointer`}
      role="button"
      onClick={handlePlayClick}
    >
      <div className="relative aspect-square">
        <img
          src={item.coverUrl || '/placeholder.png'}
          alt={item.title}
          className="object-cover w-full h-full rounded-t-xl"
        />
        <div className="absolute top-2 right-2 z-20 flex flex-col gap-1">
          <Button onClick={(e) => { e.stopPropagation(); handleToggleFavorite(); }} size="icon" className="bg-muted">
            <Heart size={16} className={isFavorited ? 'fill-primary text-primary' : ''} />
          </Button>
          <Dialog open={isAddToPlaylistModalOpen} onOpenChange={setIsAddToPlaylistModalOpen}>
            <DialogTrigger asChild>
              <Button size="icon" className="bg-muted" onClick={(e) => e.stopPropagation()}>
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
                <RadioGroup onValueChange={setSelectedPlaylistId} value={selectedPlaylistId || undefined}>
                  {playlists.map((pl) => (
                    <div key={pl.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={pl.id} id={pl.id} />
                      <Label htmlFor={pl.id}>{pl.name}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold truncate">{item.title}</h3>
        <p className="text-xs text-muted-foreground truncate">{item.artist || item.description}</p>
      </div>
    </div>
  );

  return (
    <Link href={href} legacyBehavior>
      <a className="block h-full group/link" aria-label={`View ${item.title}`}>
        {card}
      </a>
    </Link>
  );
}
