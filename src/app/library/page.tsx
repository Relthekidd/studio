
"use client";

import AlbumCard from '@/components/AlbumCard';
import SectionTitle from '@/components/SectionTitle';
import type { Track } from '@/contexts/PlayerContext';
import { Button } from '@/components/ui/button';
import { PlusCircle, Music, ListMusic, History as HistoryIcon, Heart } from 'lucide-react'; // Added icons
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from 'react'; // For managing state

// Mock data - replace with Firebase data for the authenticated user
// TODO: Fetch this data from Firebase based on the authenticated user's ID.
const mockLibraryItems: (Track & { type?: 'track' | 'playlist' | 'album', description?: string, dateAdded?: string, lastPlayed?: string, dataAiHint: string })[] = [
  { id: 'lib1', title: 'Sunset Drive', artist: 'Vector Space', audioSrc: '/music/placeholder1.mp3', imageUrl: 'https://placehold.co/300x300/FF7F50/222222.png?text=SD', type: 'track', dateAdded: '2024-07-15', dataAiHint: 'car sunset' },
  { id: 'lib2', title: 'My Chill Vibes', description: '23 tracks for relaxing evenings', imageUrl: 'https://placehold.co/300x300/6495ED/FFFFFF.png?text=CV', type: 'playlist', dateAdded: '2024-07-10', dataAiHint: 'hammock beach' },
  { id: 'lib3', title: 'Electra Heart', artist: 'Marina', audioSrc: '/music/placeholder2.mp3', imageUrl: 'https://placehold.co/300x300/DE3163/FFFFFF.png?text=EH', type: 'album', dateAdded: '2024-07-20', dataAiHint: 'pop art heart' },
  { id: 'lib4', title: 'Nightcall', artist: 'Kavinsky', audioSrc: '/music/placeholder1.mp3', imageUrl: 'https://placehold.co/300x300/4A4A4A/FFFFFF.png?text=NC', type: 'track', lastPlayed: '2024-07-21', dataAiHint: 'night drive city' },
  { id: 'lib5', title: 'Workout Power Hour', description: 'High-energy tracks to keep you moving', imageUrl: 'https://placehold.co/300x300/FFD700/222222.png?text=WPH', type: 'playlist', dateAdded: '2024-06-01', dataAiHint: 'gym dumbbell' },
  { id: 'lib6', title: 'Strobe', artist: 'deadmau5', audioSrc: '/music/placeholder2.mp3', imageUrl: 'https://placehold.co/300x300/00CED1/222222.png?text=S', type: 'track', dateAdded: '2024-05-05', dataAiHint: 'electronic mouse' },
];

export default function LibraryPage() {
  const { toast } = useToast();
  
  // TODO: These arrays should be populated by fetching data from Firebase specific to the logged-in user.
  // For example, query Firestore for collections like 'userLikedSongs', 'userPlaylists', etc.
  const [likedSongs, setLikedSongs] = useState<Track[]>([]);
  const [createdPlaylists, setCreatedPlaylists] = useState<Track[]>([]); // Assuming playlist is a type of Track for AlbumCard
  const [recentlyAdded, setRecentlyAdded] = useState<Track[]>([]);
  const [history, setHistory] = useState<Track[]>([]);

  useEffect(() => {
    // Simulate fetching data
    // In a real app, this would be an async call to Firebase
    setLikedSongs(mockLibraryItems.filter(item => item.type === 'track' && (item.id === 'lib1' || item.id === 'lib6')).slice(0, 5));
    setCreatedPlaylists(mockLibraryItems.filter(item => item.type === 'playlist'));
    setRecentlyAdded(mockLibraryItems.sort((a,b) => new Date(b.dateAdded || 0).getTime() - new Date(a.dateAdded || 0).getTime()).slice(0,5));
    setHistory(mockLibraryItems.filter(item => item.lastPlayed).sort((a,b) => new Date(b.lastPlayed || 0).getTime() - new Date(a.lastPlayed || 0).getTime()).slice(0,5));
  }, []);


  // TODO: Implement playlist creation functionality (e.g., open modal, save to Firebase)
  const handleCreatePlaylist = () => {
    toast({
      title: "Create Playlist",
      description: "Playlist creation modal would open here. (Not implemented)",
    });
    // This would typically open a modal or navigate to a playlist creation page
    // On save, a new playlist document would be created in Firebase for the user.
  };

  const renderEmptyState = (message: string, icon?: React.ReactNode) => (
    <div className="flex flex-col items-center justify-center text-center py-12 text-muted-foreground">
      {icon && <div className="mb-4 opacity-50">{icon}</div>}
      <p className="text-lg">{message}</p>
    </div>
  );

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <SectionTitle className="mb-0">My Library</SectionTitle>
        <Button onClick={handleCreatePlaylist} variant="outline" className="bg-primary-foreground hover:bg-accent/10 hover:text-accent-foreground">
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Playlist
        </Button>
      </div>

      <Tabs defaultValue="playlists" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6 bg-card border border-border">
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
          <TabsTrigger value="liked">Liked Songs</TabsTrigger>
          <TabsTrigger value="added">Recently Added</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="playlists">
          <SectionTitle id="my-playlists-title" className="text-xl sr-only">My Playlists</SectionTitle>
          {/* TODO: Fetch user's created playlists from Firebase */}
          {createdPlaylists.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {createdPlaylists.map((item) => (
                <AlbumCard key={`playlist-${item.id}`} item={item} />
              ))}
            </div>
          ) : (
            renderEmptyState("You haven't created any playlists yet.", <ListMusic size={48}/>)
          )}
        </TabsContent>

        <TabsContent value="liked">
          <SectionTitle id="liked-songs-title" className="text-xl sr-only">Liked Songs</SectionTitle>
          {/* TODO: Fetch user's liked songs from Firebase */}
          {likedSongs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {likedSongs.map((item) => (
              <AlbumCard key={`liked-${item.id}`} item={item} />
            ))}
          </div>
          ) : (
            renderEmptyState("Songs you like will appear here.", <Heart size={48} />)
          )}
        </TabsContent>

        <TabsContent value="added">
          <SectionTitle id="recently-added-title" className="text-xl sr-only">Recently Added</SectionTitle>
          {/* TODO: Fetch recently added items (could be albums or tracks user saved) from Firebase */}
          {recentlyAdded.length > 0 ? (
          <div className="flex overflow-x-auto space-x-4 md:space-x-6 pb-4 -mx-4 px-4 md:-mx-6 md:px-6 scrollbar-thin">
            {recentlyAdded.map((item) => (
              <AlbumCard key={`recentadd-${item.id}`} item={item} className="flex-shrink-0 w-36 sm:w-40 md:w-48"/>
            ))}
          </div>
          ) : (
            renderEmptyState("Music you add to your library will show up here.", <Music size={48}/>)
          )}
        </TabsContent>

        <TabsContent value="history">
          <SectionTitle id="history-title" className="text-xl sr-only">Listening History</SectionTitle>
           {/* TODO: Fetch user's listening history from Firebase */}
           {history.length > 0 ? (
          <div className="space-y-4">
            {/* TODO: Consider a denser list item component for history for better UX if many items */}
            {history.map((item) => (
               <AlbumCard key={`history-${item.id}`} item={{...item, description: `Last played: ${item.lastPlayed || 'N/A'}`}} className="w-full max-w-md mx-auto"/>
            ))}
          </div>
           ) : (
            renderEmptyState("Your listening history is empty. Start listening!", <HistoryIcon size={48} />)
           )}
        </TabsContent>
      </Tabs>
      {/* TODO: Add sections for Albums, Artists user follows if applicable */}
    </div>
  );
}
