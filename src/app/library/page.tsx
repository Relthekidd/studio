'use client';

import { AlbumCard } from '@/components/AlbumCard';
import SectionTitle from '@/components/SectionTitle';
import type { Track } from '@/contexts/PlayerContext';
import { Button } from '@/components/ui/button';
import { PlusCircle, Music, ListMusic, History as HistoryIcon, Heart, DiscAlbum, GanttChartSquare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import CreatePlaylistModal from '@/components/playlists/CreatePlaylistModal';

export default function LibraryPage() {
  const { toast } = useToast();

  const [likedSongs, setLikedSongs] = useState<Track[]>([]);
  const [createdPlaylists, setCreatedPlaylists] = useState<Track[]>([]);
  const [savedAlbums, setSavedAlbums] = useState<Track[]>([]);
  const [recentlyAdded, setRecentlyAdded] = useState<Track[]>([]);
  const [history, setHistory] = useState<Track[]>([]);

  const genres = [
    { name: 'Synthwave', id: 'genre1', imageUrl: 'https://placehold.co/300x300/BE52FF/FFFFFF.png?text=Synth', dataAiHint: 'retro grid sunset', title: 'Synthwave', type: 'playlist' as const, description: 'Explore Synthwave' },
    { name: 'Pop', id: 'genre2', imageUrl: 'https://placehold.co/300x300/FF69B4/FFFFFF.png?text=Pop', dataAiHint: 'microphone stage', title: 'Pop', type: 'playlist' as const, description: 'Explore Pop' },
    { name: 'French House', id: 'genre3', imageUrl: 'https://placehold.co/300x300/00FFFF/222222.png?text=FrenchH', dataAiHint: 'dj disco ball', title: 'French House', type: 'playlist' as const, description: 'Explore French House' },
    { name: 'Progressive House', id: 'genre4', imageUrl: 'https://placehold.co/300x300/00CED1/222222.png?text=ProgH', dataAiHint: 'sound waves abstract', title: 'Progressive House', type: 'playlist' as const, description: 'Explore Progressive House' },
  ];

  useEffect(() => {
    const user = getAuth().currentUser;
    if (!user) return;

    // Get static favorites on mount
    getDocs(collection(db, 'users', user.uid, 'favorites')).then(favSnap => {
      const favs = favSnap.docs.map(doc => doc.data() as Track);
      setLikedSongs(favs.filter(item => item.type === 'track'));
      setSavedAlbums(favs.filter(item => item.type === 'album'));
      setRecentlyAdded(
        favs
          .filter(item => item.dateAdded)
          .sort((a, b) => new Date(b.dateAdded!).getTime() - new Date(a.dateAdded!).getTime())
      );
    });

    // Real-time sync for playlists
    const unsub = onSnapshot(collection(db, 'users', user.uid, 'playlists'), (snap) => {
      const playlists = snap.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        imageUrl: 'https://placehold.co/300x300/888888/FFFFFF.png?text=PL',
        type: 'playlist' as const,
        description: doc.data().description || '',
        dateAdded: doc.data().createdAt?.toDate().toISOString() || ''
      }));
      setCreatedPlaylists(playlists);
    });

    return () => unsub();
  }, []);

  const renderEmptyState = (message: string, icon?: React.ReactNode) => (
    <div className="flex flex-col items-center justify-center text-center py-12 text-muted-foreground">
      {icon && <div className="mb-4 opacity-50">{icon}</div>}
      <p className="text-lg">{message}</p>
    </div>
  );

  const renderGridSection = (
    items: Track[],
    emptyMessage: string,
    emptyIcon: React.ReactNode,
    itemType: 'track' | 'album' | 'playlist' = 'album'
  ) => {
    if (items.length === 0) {
      return renderEmptyState(emptyMessage, emptyIcon);
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {items.map((item) => (
          <AlbumCard key={`${itemType}-${item.id}`} item={{ ...item, type: item.type || itemType }} />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <SectionTitle className="mb-0">My Library</SectionTitle>
        <CreatePlaylistModal />
      </div>

      <Tabs defaultValue="playlists" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-6 bg-card border border-border">
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
          <TabsTrigger value="liked">Liked Songs</TabsTrigger>
          <TabsTrigger value="albums">Albums</TabsTrigger>
          <TabsTrigger value="genres">Genres</TabsTrigger>
          <TabsTrigger value="added">Recently Added</TabsTrigger>
        </TabsList>

        <TabsContent value="playlists">
          {renderGridSection(createdPlaylists, "You haven't created or saved any playlists yet.", <ListMusic size={48} />, 'playlist')}
        </TabsContent>

        <TabsContent value="liked">
          {renderGridSection(likedSongs, "Songs you like will appear here.", <Heart size={48} />, 'track')}
        </TabsContent>

        <TabsContent value="albums">
          {renderGridSection(savedAlbums, "Albums you save will appear here.", <DiscAlbum size={48} />, 'album')}
        </TabsContent>

        <TabsContent value="genres">
          {renderGridSection(genres, "Browse music by genre.", <GanttChartSquare size={48} />, 'playlist')}
        </TabsContent>

        <TabsContent value="added">
          {renderGridSection(recentlyAdded, "Music you add to your library will show up here.", <Music size={48} />, 'track')}
        </TabsContent>
      </Tabs>
    </div>
  );
}
