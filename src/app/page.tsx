
import AlbumCard from '@/components/AlbumCard';
import SectionTitle from '@/components/SectionTitle';
import type { Track } from '@/contexts/PlayerContext';

// Extended mock data with more specific dataAiHint values
const mockItems: (Track & { type?: 'track' | 'playlist' | 'album', description?: string, dataAiHint: string })[] = [
  { id: '1', title: 'Cyber Dreams', artist: 'Neon Voyager', imageUrl: 'https://placehold.co/300x300/BE52FF/222222.png?text=CD', type: 'album', dataAiHint: 'synthwave sunset' },
  { id: '2', title: 'Night Drive', artist: 'Grid Runner', imageUrl: 'https://placehold.co/300x300/39FF14/222222.png?text=ND', type: 'track', dataAiHint: 'neon city car' },
  { id: '3', title: 'Future Funk Vol. 3', artist: 'Various Artists', imageUrl: 'https://placehold.co/300x300/FF69B4/222222.png?text=FF3', type: 'album', dataAiHint: 'retro cassette' },
  { id: '4', title: 'Chillwave Peace', description: 'Relax and unwind with lo-fi beats', imageUrl: 'https://placehold.co/300x300/00FFFF/222222.png?text=CP', type: 'playlist', dataAiHint: 'beach hammock' },
  { id: '5', title: 'Midnight City Run', artist: 'Kavinsky', imageUrl: 'https://placehold.co/300x300/FFD700/222222.png?text=MCR', type: 'track', dataAiHint: 'night city skyline' },
  { id: '6', title: '80s Rewind', description: 'Iconic hits from the 1980s', imageUrl: 'https://placehold.co/300x300/FF4500/222222.png?text=80R', type: 'playlist', dataAiHint: 'vintage boombox' },
  { id: '7', title: 'Electro Swing Fever', artist: 'Parov Stelar', imageUrl: 'https://placehold.co/300x300/9370DB/222222.png?text=ESF', type: 'album', dataAiHint: 'vintage jazz club' },
  { id: '8', title: 'Lo-Fi Study Cafe', description: 'Focus and chill beats for studying', imageUrl: 'https://placehold.co/300x300/8A2BE2/222222.png?text=LSC', type: 'playlist', dataAiHint: 'study desk rain' },
  { id: '9', title: 'Cosmic Echoes', artist: 'Star Sailor', imageUrl: 'https://placehold.co/300x300/C0C0C0/222222.png?text=CE', type: 'album', dataAiHint: 'galaxy stars' },
  { id: '10', title: 'Sunset Rider', artist: 'Vector Hold', imageUrl: 'https://placehold.co/300x300/FFA07A/222222.png?text=SR', type: 'track', dataAiHint: 'motorcycle sunset' },
];


export default function HomePage() {
  // TODO: Replace with Firebase calls to fetch personalized data
  const recentlyPlayed = mockItems.slice(0, 5);
  const madeForYou = mockItems.slice(2, 7);
  const trending = mockItems.slice(4, 9);
  const newReleases = mockItems.slice(1, 6).reverse();

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8 md:space-y-12">
      <section aria-labelledby="recently-played-title">
        <SectionTitle id="recently-played-title">Recently Played</SectionTitle>
        <div className="flex overflow-x-auto space-x-4 md:space-x-6 pb-4 -mx-4 px-4 md:-mx-6 md:px-6 scrollbar-thin scrollbar-thumb-muted-foreground/50 scrollbar-track-transparent">
          {recentlyPlayed.map((item) => (
            <AlbumCard key={`recent-${item.id}`} item={item} className="flex-shrink-0 w-36 sm:w-40 md:w-48" />
          ))}
        </div>
      </section>

      <section aria-labelledby="made-for-you-title">
        <SectionTitle id="made-for-you-title">Made For You</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {madeForYou.map((item) => (
            <AlbumCard key={`foryou-${item.id}`} item={item} />
          ))}
        </div>
      </section>

      <section aria-labelledby="trending-title">
        <SectionTitle id="trending-title">Trending Now</SectionTitle>
         <div className="flex overflow-x-auto space-x-4 md:space-x-6 pb-4 -mx-4 px-4 md:-mx-6 md:px-6 scrollbar-thin scrollbar-thumb-muted-foreground/50 scrollbar-track-transparent">
          {trending.map((item) => (
            <AlbumCard key={`trending-${item.id}`} item={item} className="flex-shrink-0 w-36 sm:w-40 md:w-48" />
          ))}
        </div>
      </section>

      <section aria-labelledby="new-releases-title">
        <SectionTitle id="new-releases-title">New Releases</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {newReleases.map((item) => (
            <AlbumCard key={`new-${item.id}`} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
