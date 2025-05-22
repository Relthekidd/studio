// src/components/AlbumCard.tsx
"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Track } from '@/contexts/PlayerContext'; 
import { PlayCircle, Heart, PlusCircle, PauseCircle } from 'lucide-react'; 
import { usePlayer } from '@/contexts/PlayerContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast"; 
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { useUser } from '@/hooks/useUser';
import { doc, setDoc, deleteDoc, getDoc, getDocs, collection } from 'firebase/firestore';

export default function AlbumCard({ item, className }: { item: Track & { type?: string, description?: string }, className?: string }) {
  const { playTrack, currentTrack, isPlaying, togglePlayPause } = usePlayer();
  const { toast } = useToast();
  const { user } = useUser();

  const [isFavorited, setIsFavorited] = useState(false);
  const [playlists, setPlaylists] = useState<{ id: string, name: string }[]>([]);
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const isCurrentlyPlayingItem = currentTrack?.id === item.id && isPlaying;
  const isCurrentItemPaused = currentTrack?.id === item.id && !isPlaying;

  useEffect(() => {
    if (!user) return;
    const checkFavorite = async () => {
      const favDoc = await getDoc(doc(db, 'users', user.uid, 'favorites', item.id));
      setIsFavorited(favDoc.exists());
    };
    const fetchPlaylists = async () => {
      const snap = await getDocs(collection(db, 'users', user.uid, 'playlists'));
      setPlaylists(snap.docs.map(d => ({ id: d.id, name: d.data().name })));
    };
    checkFavorite();
    fetchPlaylists();
  }, [user, item.id]);

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

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    const favRef = doc(db, 'users', user.uid, 'favorites', item.id);
    const isFav = isFavorited;
    if (isFav) {
      await deleteDoc(favRef);
      setIsFavorited(false);
      toast({ title: "Unfavorited", description: `${item.title} removed from your library.` });
    } else {
      await setDoc(favRef, { ...item, favoritedAt: Date.now() });
      setIsFavorited(true);
      toast({ title: "Favorited!", description: `${item.title} added to your library.` });
    }
  };

  const handleAddTrackToExistingPlaylist = async () => {
    if (!selectedPlaylistId || !user) return;
    await setDoc(doc(db, 'users', user.uid, 'playlists', selectedPlaylistId, 'tracks', item.id), {
      ...item,
      addedAt: Date.now(),
    });
    toast({ title: "Added to Playlist", description: `${item.title} added to playlist.` });
    setIsAddToPlaylistModalOpen(false);
    setSelectedPlaylistId(null);
  };

  const handleCreateAndAddTrackToNewPlaylist = async () => {
    if (!newPlaylistName.trim() || !user) return;
    const playlistRef = doc(db, 'users', user.uid, 'playlists', newPlaylistName);
    await setDoc(playlistRef, { name: newPlaylistName, createdAt: Date.now() });
    await setDoc(doc(playlistRef, 'tracks', item.id), { ...item, addedAt: Date.now() });
    toast({ title: "Playlist Created", description: `${item.title} added to new playlist.` });
    setIsAddToPlaylistModalOpen(false);
    setNewPlaylistName('');
  };

  const subText = item.type === 'playlist' ? item.description : item.artist;
  const href = item.type === 'album' ? `/album/${item.id}`
              : item.type === 'single' ? `/single/${item.id}`
              : item.type === 'track' && item.albumId ? `/album/${item.albumId}`
              : item.type === 'artist' ? `/artist/${item.id}`
              : item.type === 'playlist' ? `/playlist/${item.id}`
              : '#';

  const card = (
    <Card className={`group relative bg-card/70 hover:bg-card/90 transition-all rounded-xl ${className || 'w-full'}`} role="button">
      <CardContent className="p-0">
        <div className="relative aspect-square">
          <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Button onClick={handlePlayPauseClick} className="rounded-full bg-accent">
              {isCurrentlyPlayingItem ? <PauseCircle size={28} /> : <PlayCircle size={28} />}
            </Button>
          </div>
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            <Button onClick={handleToggleFavorite} size="icon" className="bg-muted">
              <Heart size={16} className={isFavorited ? 'fill-primary text-primary' : ''} />
            </Button>
            <Dialog open={isAddToPlaylistModalOpen} onOpenChange={setIsAddToPlaylistModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsAddToPlaylistModalOpen(true)} size="icon" className="bg-muted">
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
                  <Button onClick={handleAddTrackToExistingPlaylist} disabled={!selectedPlaylistId}>Add</Button>
                  <Label>Create New Playlist</Label>
                  <Input value={newPlaylistName} onChange={(e) => setNewPlaylistName(e.target.value)} placeholder="New playlist name" />
                  <Button onClick={handleCreateAndAddTrackToNewPlaylist}>Create & Add</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-foreground font-semibold truncate">{item.title}</h3>
          {subText && <p className="text-muted-foreground text-sm truncate">{subText}</p>}
        </div>
      </CardContent>
    </Card>
  );

  return href && href !== '#' ? <Link href={href}>{card}</Link> : card;
}
