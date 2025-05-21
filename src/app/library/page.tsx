
"use client";

import AlbumCard from '@/components/AlbumCard';
import SectionTitle from '@/components/SectionTitle';
import type { Track } from '@/contexts/PlayerContext';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data - replace with Firebase data for the authenticated user
const mockLibraryItems: (Track & { type?: 'track' | 'playlist' | 'album', description?: string, dateAdded?: string, lastPlayed?: string, dataAiHint: string })[] = [
  { id: 'lib1', title: 'Liked: Sunset Drive', artist: 'Vector Space', imageUrl: 'https://placehold.co/300x300/FF7F50/222222.png?text=LD', type: 'track', dateAdded: '2024-07-15', dataAiHint: 'car sunset' },
  { id: 'lib2', title: 'My Chill Vibes', description: '23 tracks for relaxing evenings', imageUrl: 'https://placehold.co/300x300/6495ED/FFFFFF.png?text=CV', type: 'playlist', dateAdded: '2024-07-10', dataAiHint: 'hammock beach' },
  { id: 'lib3', title: 'Recently Added: Electra Heart', artist: 'Marina', imageUrl: 'https://placehold.co/300x300/DE3163/FFFFFF.png?text=EH', type: 'album', dateAdded: '2024-07-20', dataAiHint: 'pop art heart' },
  { id: 'lib4', title: 'History: Nightcall', artist: 'Kavinsky', imageUrl: 'https://placehold.co/300x300/4A4A4A/FFFFFF.png?text=NC', type: 'track', lastPlayed: '2024-07-21', dataAiHint: 'night drive city' },
  { id: 'lib5', title: 'Workout Power Hour', description: 'High-energy tracks to keep you moving', imageUrl: 'https://placehold.co/300x300/FFD700/222222.png?text=WPH', type: 'playlist', dateAdded: '2024-06-01', dataAiHint: 'gym dumbbell' },
  { id: 'lib6', title: 'Liked: Strobe', artist: 'deadmau5', imageUrl: 'https://placehold.co/300x300/00CED1/222222.png?text=S', type: 'track', dateAdded: '2024-05-05', dataAiHint: 'electronic mouse' },
];

export default function LibraryPage() {
  // TODO: Fetch user's library data from Firebase
  const likedSongs = mockLibraryItems.filter(item => item.title.startsWith('Liked:')).slice(0, 5);
  const createdPlaylists = mockLibraryItems.filter(item => item.type === 'playlist');
  const recentlyAdded = mockLibraryItems.sort((a,b) => new Date(b.dateAdded || 0).getTime() - new Date(a.dateAdded || 0).getTime()).slice(0,5);
  const history = mockLibraryItems.filter(item => item.lastPlayed).sort((a,b) => new Date(b.lastPlayed || 0).getTime() - new Date(a.lastPlayed || 0).getTime()).slice(0,5);

  // TODO: Implement playlist creation functionality
  const handleCreatePlaylist = () => {
    alert("Feature to create playlist coming soon!");
    // This would typically open a modal or navigate to a playlist creation page
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8">
      <div className="flex justify-between items-center">
        <SectionTitle>My Library</SectionTitle>
        <Button onClick={handleCreatePlaylist} variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" /> Create Playlist
        </Button>
      </div>

      <Tabs defaultValue="playlists" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
          <TabsTrigger value="liked">Liked Songs</TabsTrigger>
          <TabsTrigger value="added">Recently Added</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="playlists">
          <SectionTitle id="my-playlists-title" className="text-xl sr-only">My Playlists</SectionTitle>
          {createdPlaylists.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {createdPlaylists.map((item) => (
                <AlbumCard key={`playlist-${item.id}`} item={item} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">You haven&apos;t created any playlists yet. Start by clicking &quot;Create Playlist&quot;!</p>
          )}
        </TabsContent>

        <TabsContent value="liked">
          <SectionTitle id="liked-songs-title" className="text-xl sr-only">Liked Songs</SectionTitle>
          {likedSongs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {/* TODO: Use a more appropriate component for song lists if AlbumCard is too large */}
            {likedSongs.map((item) => (
              <AlbumCard key={`liked-${item.id}`} item={item} />
            ))}
          </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">Songs you like will appear here.</p>
          )}
        </TabsContent>

        <TabsContent value="added">
          <SectionTitle id="recently-added-title" className="text-xl sr-only">Recently Added</SectionTitle>
          {recentlyAdded.length > 0 ? (
          <div className="flex overflow-x-auto space-x-4 md:space-x-6 pb-4 -mx-4 px-4 md:-mx-6 md:px-6 scrollbar-thin scrollbar-thumb-muted-foreground/50 scrollbar-track-transparent">
            {recentlyAdded.map((item) => (
              <AlbumCard key={`recentadd-${item.id}`} item={item} className="flex-shrink-0 w-36 sm:w-40 md:w-48"/>
            ))}
          </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">Recently added music will show up here.</p>
          )}
        </TabsContent>

        <TabsContent value="history">
          <SectionTitle id="history-title" className="text-xl sr-only">Listening History</SectionTitle>
           {history.length > 0 ? (
          <div className="space-y-4">
            {/* TODO: Use a list item component for history for better density */}
            {history.map((item) => (
               <AlbumCard key={`history-${item.id}`} item={item} className="w-full max-w-md mx-auto"/> // Example, might need specific styling
            ))}
          </div>
           ) : (
            <p className="text-muted-foreground text-center py-8">Your listening history is empty.</p>
           )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
