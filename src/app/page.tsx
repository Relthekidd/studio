import AlbumCard from '@/components/AlbumCard';
import SectionTitle from '@/components/SectionTitle';
import { SonixLogo } from '@/components/icons/SonixLogo';
import type { Track } from '@/contexts/PlayerContext'; // Re-using Track for simplified item structure
import { Button } from '@/components/ui/button';
import { Search, Bell } from 'lucide-react';

const mockItems: (Track & { type?: 'track' | 'playlist' | 'album', description?: string, dataAiHint: string })[] = [
  { id: '1', title: 'Cyber Dreams', artist: 'Neon Voyager', imageUrl: 'https://placehold.co/300x300/BE52FF/222222.png?text=CD', type: 'track', dataAiHint: 'synthwave sunset' },
  { id: '2', title: 'Night Drive', artist: 'Grid Runner', imageUrl: 'https://placehold.co/300x300/39FF14/222222.png?text=ND', type: 'track', dataAiHint: 'neon city car' },
  { id: '3', title: 'Future Funk Vol. 3', artist: 'Various Artists', imageUrl: 'https://placehold.co/300x300/FF69B4/222222.png?text=FF3', type: 'album', dataAiHint: 'retro cassette' },
  { id: '4', title: 'Chillwave Vibes', description: 'Relax and unwind', imageUrl: 'https://placehold.co/300x300/00FFFF/222222.png?text=CV', type: 'playlist', dataAiHint: 'beach sunset' },
  { id: '5', title: 'Midnight City Run', artist: 'Kavinsky', imageUrl: 'https://placehold.co/300x300/FFD700/222222.png?text=MCR', type: 'track', dataAiHint: 'night city drive' },
  { id: '6', title: '80s Nostalgia', description: 'Hits from the 80s', imageUrl: 'https://placehold.co/300x300/FF4500/222222.png?text=80N', type: 'playlist', dataAiHint: 'vintage boombox' },
  { id: '7', title: 'Electro Swing Fever', artist: 'Parov Stelar', imageUrl: 'https://placehold.co/300x300/9370DB/222222.png?text=ESF', type: 'album', dataAiHint: 'vintage jazz club' },
  { id: '8', title: 'Lo-Fi Beats to Study', description: 'Focus and chill', imageUrl: 'https://placehold.co/300x300/8A2BE2/222222.png?text=LBS', type: 'playlist', dataAiHint: 'study desk rain' },
];


const Header = () => (
  <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border/50">
    <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
      <SonixLogo className="h-8 w-auto" />
      <div className="flex items-center gap-2 md:gap-4">
        <Button variant="ghost" size="icon" aria-label="Search">
          <Search className="h-5 w-5 text-accent" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5 text-accent" />
        </Button>
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
          U
        </div>
      </div>
    </div>
  </header>
);


export default function HomePage() {
  const recentlyPlayed = mockItems.slice(0, 5);
  const madeForYou = mockItems.slice(2, 6);
  const trending = mockItems.slice(4, 8);
  const newReleases = mockItems.slice(1, 6).reverse();

  return (
    <>
      <Header />
      <div className="container mx-auto p-4 md:p-6 space-y-8 md:space-y-12">
        <section aria-labelledby="recently-played-title">
          <SectionTitle id="recently-played-title">Recently Played</SectionTitle>
          <div className="flex overflow-x-auto space-x-4 md:space-x-6 pb-4 -mx-4 px-4 md:-mx-6 md:px-6">
            {recentlyPlayed.map((item) => (
              <AlbumCard key={`recent-${item.id}`} item={item} className="flex-shrink-0" />
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {trending.map((item) => (
              <AlbumCard key={`trending-${item.id}`} item={item} />
            ))}
          </div>
        </section>

        <section aria-labelledby="new-releases-title">
          <SectionTitle id="new-releases-title">New Releases</SectionTitle>
          <div className="flex overflow-x-auto space-x-4 md:space-x-6 pb-4 -mx-4 px-4 md:-mx-6 md:px-6">
            {newReleases.map((item) => (
              <AlbumCard key={`new-${item.id}`} item={item} className="flex-shrink-0" />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
