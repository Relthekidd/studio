
import AlbumCard from '@/components/AlbumCard';
import SectionTitle from '@/components/SectionTitle';
import type { Track } from '@/contexts/PlayerContext';

// Mock data - replace with Firebase data
const mockDiscoverItems: (Track & { type?: 'track' | 'playlist' | 'album', description?: string, dataAiHint: string })[] = [
  { id: 'd1', title: 'Fresh Finds Hip Hop', description: 'The latest underground hip hop tracks.', imageUrl: 'https://placehold.co/300x300/FFC300/222222.png?text=FFHH', type: 'playlist', dataAiHint: 'graffiti wall' },
  { id: 'd2', title: 'Aurora Haze', artist: 'Echo Bloom', imageUrl: 'https://placehold.co/300x300/DAF7A6/222222.png?text=AH', type: 'track', dataAiHint: 'misty forest' },
  { id: 'd3', title: 'Indie Anthems 2024', description: 'Breakthrough indie artists of the year.', imageUrl: 'https://placehold.co/300x300/FF5733/222222.png?text=IA24', type: 'playlist', dataAiHint: 'concert crowd' },
  { id: 'd4', title: 'Algorithm & Blues', description: 'Tracks chosen just for you by Sonix AI.', imageUrl: 'https://placehold.co/300x300/C70039/FFFFFF.png?text=A&B', type: 'playlist', dataAiHint: 'abstract data' },
  { id: 'd5', title: 'Neon Tides', artist: 'Synth Pilots', imageUrl: 'https://placehold.co/300x300/900C3F/FFFFFF.png?text=NT', type: 'album', dataAiHint: 'futuristic city' },
  { id: 'd6', title: 'Lo-Fi Morning Commute', description: 'Chill beats for your journey.', imageUrl: 'https://placehold.co/300x300/581845/FFFFFF.png?text=LMC', type: 'playlist', dataAiHint: 'train window rain' },
  { id: 'd7', title: 'Warp Speed', artist: 'Galaxy Drifters', imageUrl: 'https://placehold.co/300x300/4A235A/FFFFFF.png?text=WS', type: 'track', dataAiHint: 'spaceship cockpit' },
  { id: 'd8', title: 'Global Grooves', description: 'Hit songs from around the world.', imageUrl: 'https://placehold.co/300x300/7D3C98/FFFFFF.png?text=GG', type: 'playlist', dataAiHint: 'world map music' },
];


export default function DiscoverPage() {
  // TODO: Replace with Firebase calls
  const newestTracks = mockDiscoverItems.filter(item => item.type === 'track').slice(0, 5);
  const curatedPlaylists = mockDiscoverItems.filter(item => item.type === 'playlist').slice(0,4);
  const suggestedForYou = [...mockDiscoverItems].reverse().slice(0,5); // Just some variety for mock

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8 md:space-y-12">
      <SectionTitle>Discover New Music</SectionTitle>
      
      <section aria-labelledby="newest-tracks-title">
        <SectionTitle id="newest-tracks-title" className="text-2xl">Newest Tracks</SectionTitle>
        <div className="flex overflow-x-auto space-x-4 md:space-x-6 pb-4 -mx-4 px-4 md:-mx-6 md:px-6 scrollbar-thin scrollbar-thumb-muted-foreground/50 scrollbar-track-transparent">
          {newestTracks.map((item) => (
            <AlbumCard key={`newest-${item.id}`} item={item} className="flex-shrink-0 w-36 sm:w-40 md:w-48" />
          ))}
        </div>
      </section>

      <section aria-labelledby="curated-playlists-title">
        <SectionTitle id="curated-playlists-title" className="text-2xl">Curated Playlists</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {curatedPlaylists.map((item) => (
            <AlbumCard key={`curated-${item.id}`} item={item} />
          ))}
        </div>
      </section>

      <section aria-labelledby="suggested-for-you-title">
        <SectionTitle id="suggested-for-you-title" className="text-2xl">Algorithm Suggestions</SectionTitle>
        {/* TODO: This could be a Genkit flow output */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {suggestedForYou.map((item) => (
            <AlbumCard key={`suggested-${item.id}`} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
