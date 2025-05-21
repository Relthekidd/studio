
import AlbumCard from '@/components/AlbumCard';
import SectionTitle from '@/components/SectionTitle';
import type { Track } from '@/contexts/PlayerContext';
import { generalMockItems, mockAlbumsAndSingles } from '@/lib/mockData'; // Using centralized mock data


export default function DiscoverPage() {
  // TODO: Replace with Firebase calls
  // Make sure items have a 'type' for AlbumCard
  const newestTracks = Object.values(mockAlbumsAndSingles)
    .filter(item => item.type === 'single' || (item.tracklist && item.tracklist.length > 0))
    .sort((a,b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
    .slice(0, 5)
    .map(item => ({ ...item, type: item.type, artist: item.artistsDisplay } as Track));

  const curatedPlaylists = generalMockItems
    .filter(item => item.type === 'playlist')
    .slice(0,4);

  const suggestedForYou = [...generalMockItems]
    .filter(item => item.type === 'album' || item.type === 'track')
    .reverse()
    .slice(0,5)
    .map(item => ({ ...item, type: item.type || (item.tracklist ? 'album' : 'track') as any }));


  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8 md:space-y-12">
      <SectionTitle>Discover New Music</SectionTitle>
      
      <section aria-labelledby="newest-releases-title">
        <SectionTitle id="newest-releases-title" className="text-2xl">Newest Releases</SectionTitle>
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

    