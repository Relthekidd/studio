
"use client";

import AlbumCard from '@/components/AlbumCard';
import SectionTitle from '@/components/SectionTitle';
import type { Track } from '@/contexts/PlayerContext';
import { Button } from '@/components/ui/button';
import { PlusCircle, Music, ListMusic, History as HistoryIcon, Heart, DiscAlbum, GanttChartSquare } from 'lucide-react'; // Added DiscAlbum, GanttChartSquare for Genres
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from 'react'; 

// Mock data - replace with Firebase data for the authenticated user
// TODO: Fetch this data from Firebase based on the authenticated user's ID.
const mockLibraryItems: (Track & { type?: 'track' | 'playlist' | 'album' | 'single', description?: string, dateAdded?: string, lastPlayed?: string, dataAiHint: string, genre?: string })[] = [
  { id: 'libTr1', title: 'Sunset Drive', artist: 'Vector Space', audioSrc: '/music/placeholder1.mp3', imageUrl: 'https://placehold.co/300x300/FF7F50/222222.png?text=SD', type: 'track', dateAdded: '2024-07-15', dataAiHint: 'car sunset', genre: 'Synthwave' },
  { id: 'libPl1', title: 'My Chill Vibes', description: '23 tracks for relaxing evenings', imageUrl: 'https://placehold.co/300x300/6495ED/FFFFFF.png?text=CV', type: 'playlist', dateAdded: '2024-07-10', dataAiHint: 'hammock beach' },
  { id: 'libAl1', title: 'Electra Heart', artist: 'Marina', audioSrc: '/music/placeholder2.mp3', imageUrl: 'https://placehold.co/300x300/DE3163/FFFFFF.png?text=EH', type: 'album', dateAdded: '2024-07-20', dataAiHint: 'pop art heart', genre: 'Pop' },
  { id: 'libTr2', title: 'Nightcall', artist: 'Kavinsky', audioSrc: '/music/placeholder1.mp3', imageUrl: 'https://placehold.co/300x300/4A4A4A/FFFFFF.png?text=NC', type: 'track', lastPlayed: '2024-07-21', dataAiHint: 'night drive city', genre: 'Outrun' },
  { id: 'libPl2', title: 'Workout Power Hour', description: 'High-energy tracks to keep you moving', imageUrl: 'https://placehold.co/300x300/FFD700/222222.png?text=WPH', type: 'playlist', dateAdded: '2024-06-01', dataAiHint: 'gym dumbbell' },
  { id: 'libAl2', title: 'Discovery', artist: 'Daft Punk', imageUrl: 'https://placehold.co/300x300/00FFFF/222222.png?text=DPD', type: 'album', dateAdded: '2024-05-15', dataAiHint: 'robotic helmets', genre: 'French House'},
  { id: 'libTr3', title: 'Strobe', artist: 'deadmau5', audioSrc: '/music/placeholder2.mp3', imageUrl: 'https://placehold.co/300x300/00CED1/222222.png?text=S', type: 'track', dateAdded: '2024-05-05', dataAiHint: 'electronic mouse', genre: 'Progressive House' },
  { id: 'libPl3', title: 'Synthwave Classics', description: 'Iconic synthwave tracks', imageUrl: 'https://placehold.co/300x300/BE52FF/222222.png?text=SC', type: 'playlist', dateAdded: '2024-04-01', dataAiHint: 'retro grid' },
];

// Mock Genres - in a real app this would come from metadata or user tagging
const mockGenres = [
  { name: 'Synthwave', id: 'genre1', imageUrl: 'https://placehold.co/300x300/BE52FF/FFFFFF.png?text=Synth', dataAiHint: 'retro grid sunset' },
  { name: 'Pop', id: 'genre2', imageUrl: 'https://placehold.co/300x300/FF69B4/FFFFFF.png?text=Pop', dataAiHint: 'microphone stage' },
  { name: 'French House', id: 'genre3', imageUrl: 'https://placehold.co/300x300/00FFFF/222222.png?text=FrenchH', dataAiHint: 'dj disco ball' },
  { name: 'Progressive House', id: 'genre4', imageUrl: 'https://placehold.co/300x300/00CED1/222222.png?text=ProgH', dataAiHint: 'sound waves abstract' },
];

export default function LibraryPage() {
  const { toast } = useToast();
  
  const [likedSongs, setLikedSongs] = useState<Track[]>([]);
  const [createdPlaylists, setCreatedPlaylists] = useState<Track[]>([]);
  const [savedAlbums, setSavedAlbums] = useState<Track[]>([]);
  const [recentlyAdded, setRecentlyAdded] = useState<Track[]>([]);
  const [history, setHistory] = useState<Track[]>([]);
  // Genres are static for this mock
  const genres = mockGenres.map(g => ({...g, title: g.name, type: 'playlist' as const, description: `Explore ${g.name}`}));


  useEffect(() => {
    // Simulate fetching data
    // TODO: Fetch from Firebase: user's liked songs, created/saved playlists, albums, recently added, listening history
    setLikedSongs(mockLibraryItems.filter(item => item.type === 'track' && (item.id === 'libTr1' || item.id === 'libTr3')).slice(0, 10));
    setCreatedPlaylists(mockLibraryItems.filter(item => item.type === 'playlist'));
    setSavedAlbums(mockLibraryItems.filter(item => item.type === 'album').slice(0,10));
    setRecentlyAdded(mockLibraryItems.sort((a,b) => new Date(b.dateAdded || 0).getTime() - new Date(a.dateAdded || 0).getTime()).slice(0,10));
    setHistory(mockLibraryItems.filter(item => item.lastPlayed).sort((a,b) => new Date(b.lastPlayed || 0).getTime() - new Date(a.lastPlayed || 0).getTime()).slice(0,10));
  }, []);

  const handleCreatePlaylist = () => {
    // TODO: Implement playlist creation modal/flow here. (See AlbumCard for a Dialog example)
    // On save, a new playlist document would be created in Firebase for the user.
    // Then, update the `createdPlaylists` state.
    toast({
      title: "Create Playlist",
      description: "Playlist creation UI would open here. (Not implemented)",
    });
  };

  const renderEmptyState = (message: string, icon?: React.ReactNode) => (
    <div className="flex flex-col items-center justify-center text-center py-12 text-muted-foreground">
      {icon && <div className="mb-4 opacity-50">{icon}</div>}
      <p className="text-lg">{message}</p>
    </div>
  );

  const renderGridSection = (items: Track[], emptyMessage: string, emptyIcon: React.ReactNode, itemType: 'track' | 'album' | 'playlist' = 'album') => {
     if (items.length === 0) {
      return renderEmptyState(emptyMessage, emptyIcon);
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {items.map((item) => (
          <AlbumCard key={`${itemType}-${item.id}`} item={{...item, type: item.type || itemType }} />
        ))}
      </div>
    );
  };
  
  const renderHorizontalScrollSection = (items: Track[], emptyMessage: string, emptyIcon: React.ReactNode, itemType: 'track' | 'album' | 'playlist' = 'album') => {
    if (items.length === 0) {
      return renderEmptyState(emptyMessage, emptyIcon);
    }
    return (
      <div className="flex overflow-x-auto space-x-4 md:space-x-6 pb-4 -mx-4 px-4 md:-mx-6 md:px-6 scrollbar-thin">
        {items.map((item) => (
          <AlbumCard key={`recentadd-${item.id}`} item={{...item, type: item.type || itemType}} className="flex-shrink-0 w-36 sm:w-40 md:w-48"/>
        ))}
      </div>
    );
  }


  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <SectionTitle className="mb-0">My Library</SectionTitle>
        <Button onClick={handleCreatePlaylist} variant="outline" className="bg-primary-foreground hover:bg-accent/10 hover:text-accent-foreground">
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Playlist
        </Button>
      </div>

      <Tabs defaultValue="playlists" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-6 bg-card border border-border">
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
          <TabsTrigger value="liked">Liked Songs</TabsTrigger>
          <TabsTrigger value="albums">Albums</TabsTrigger>
          <TabsTrigger value="genres">Genres</TabsTrigger>
          <TabsTrigger value="added">Recently Added</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="playlists">
          <SectionTitle id="my-playlists-title" className="text-xl sr-only">My Playlists</SectionTitle>
          {renderGridSection(createdPlaylists, "You haven't created or saved any playlists yet.", <ListMusic size={48}/>, 'playlist')}
        </TabsContent>

        <TabsContent value="liked">
          <SectionTitle id="liked-songs-title" className="text-xl sr-only">Liked Songs</SectionTitle>
          {renderGridSection(likedSongs, "Songs you like will appear here.", <Heart size={48} />, 'track')}
        </TabsContent>
        
        <TabsContent value="albums">
          <SectionTitle id="saved-albums-title" className="text-xl sr-only">Saved Albums</SectionTitle>
          {renderGridSection(savedAlbums, "Albums you save will appear here.", <DiscAlbum size={48} />, 'album')}
        </TabsContent>

        <TabsContent value="genres">
          <SectionTitle id="my-genres-title" className="text-xl sr-only">My Genres</SectionTitle>
          {/* For genres, we might want a different display or link to a genre-specific page */}
           {renderGridSection(genres, "Browse music by genre.", <GanttChartSquare size={48}/>, 'playlist' /* Assuming genre card links to a discover/playlist-like page */)}
        </TabsContent>

        <TabsContent value="added">
          <SectionTitle id="recently-added-title" className="text-xl sr-only">Recently Added</SectionTitle>
          {renderHorizontalScrollSection(recentlyAdded, "Music you add to your library will show up here.", <Music size={48}/>, 'track')}
        </TabsContent>

        <TabsContent value="history">
          <SectionTitle id="history-title" className="text-xl sr-only">Listening History</SectionTitle>
           {history.length > 0 ? (
          <div className="space-y-2">
            {history.map((item) => ( // History items are typically tracks
               <AlbumCard 
                key={`history-${item.id}`} 
                item={{...item, type: 'track', description: `Last played: ${item.lastPlayed || 'N/A'}`}} 
                className="w-full max-w-md mx-auto !shadow-none border-b border-border/50 rounded-none hover:bg-muted/30 p-2" // Simplified style for list view
               />
            ))}
          </div>
           ) : (
            renderEmptyState("Your listening history is empty. Start listening!", <HistoryIcon size={48} />)
           )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
    