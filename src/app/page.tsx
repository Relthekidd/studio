
import AlbumCard from '@/components/AlbumCard';
import SectionTitle from '@/components/SectionTitle';
import type { Track } from '@/contexts/PlayerContext';
import { generalMockItems } from '@/lib/mockData'; // Using centralized mock data

export default function HomePage() {
  // TODO: Replace with Firebase calls to fetch personalized data
  // Using generalMockItems and slicing/filtering for variety
  const recentlyPlayed = generalMockItems.slice(0, 5).map(item => ({ ...item, type: item.type || (item.tracklist ? 'album' : 'track') as any }));
  const madeForYou = generalMockItems.slice(1, 6).map(item => ({ ...item, type: item.type || (item.tracklist ? 'album' : 'track') as any }));
  const trending = generalMockItems.slice(2, 7).map(item => ({ ...item, type: item.type || (item.tracklist ? 'album' : 'track') as any }));
  const newReleases = [...generalMockItems].reverse().slice(0,5).map(item => ({ ...item, type: item.type || (item.tracklist ? 'album' : 'track') as any }));

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

    