// src/app/library/page.tsx
'use client';

import { AlbumCard } from '@/components/AlbumCard';
import SectionTitle from '@/components/SectionTitle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ListMusic, Heart, DiscAlbum, GanttChartSquare, Music, Loader } from 'lucide-react';
import CreatePlaylistModal from '@/components/playlists/CreatePlaylistModal';
import { useLibrary } from '@/hooks/useLibrary';
import { useEffect } from 'react';

export default function LibraryPage() {
  const { library, loading, reloadLibrary } = useLibrary();

  const likedSongs = library?.likedSongs || [];
  const savedAlbums = library?.savedAlbums || [];
  const recentlyAdded = library?.recentlyAdded || [];
  const createdPlaylists = library?.createdPlaylists || [];
  const genres = library?.genres || [];

  // Automatically reload the library after changes
  useEffect(() => {
    const handleLibraryChange = () => {
      reloadLibrary();
    };

    // Example: Add event listeners for changes (e.g., playlist added, song liked)
    window.addEventListener('libraryChange', handleLibraryChange);

    return () => {
      window.removeEventListener('libraryChange', handleLibraryChange);
    };
  }, [reloadLibrary]);

  const renderEmptyState = (message: string, icon?: React.ReactNode) => (
    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
      {icon && <div className="mb-4 opacity-50">{icon}</div>}
      <p className="text-lg">{message}</p>
    </div>
  );

  const renderGridSection = (
    items: any[],
    emptyMessage: string,
    emptyIcon: React.ReactNode,
    itemType: 'track' | 'album' | 'playlist'
  ) => {
    if (items.length === 0) {
      return renderEmptyState(emptyMessage, emptyIcon);
    }
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">
        {items.map((item) => (
          <AlbumCard
            key={`${itemType}-${item.id}`}
            item={{ ...item, type: item.type || itemType }}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-8 p-4 md:p-6 lg:p-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <SectionTitle className="mb-0">My Library</SectionTitle>
        <CreatePlaylistModal onPlaylistCreated={reloadLibrary} />
      </div>

      <Tabs defaultValue="playlists" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-3 border border-border bg-card md:grid-cols-6">
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
          <TabsTrigger value="liked">Liked Songs</TabsTrigger>
          <TabsTrigger value="albums">Albums</TabsTrigger>
          <TabsTrigger value="genres">Genres</TabsTrigger>
          <TabsTrigger value="added">Recently Added</TabsTrigger>
        </TabsList>

        <TabsContent value="playlists">
          {renderGridSection(createdPlaylists, 'No playlists found.', <ListMusic size={48} />, 'playlist')}
        </TabsContent>

        <TabsContent value="liked">
          {renderGridSection(likedSongs, 'No liked songs yet.', <Heart size={48} />, 'track')}
        </TabsContent>

        <TabsContent value="albums">
          {renderGridSection(savedAlbums, 'No saved albums.', <DiscAlbum size={48} />, 'album')}
        </TabsContent>

        <TabsContent value="genres">
          {renderGridSection(genres, 'No genre playlists found.', <GanttChartSquare size={48} />, 'playlist')}
        </TabsContent>

        <TabsContent value="added">
          {renderGridSection(recentlyAdded, 'No recent activity.', <Music size={48} />, 'track')}
        </TabsContent>
      </Tabs>
    </div>
  );
}
