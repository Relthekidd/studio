
"use client"; 

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import FilterChip from '@/components/FilterChip';
import SectionTitle from '@/components/SectionTitle';
import AlbumCard from '@/components/AlbumCard';
import type { Track } from '@/contexts/PlayerContext';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, ListMusic, DiscAlbum, Users } from 'lucide-react'; // Updated Disc to DiscAlbum for clarity, added Users

// Mock data - replace with Firebase search results
const allMockItems: (Track & { type?: 'track' | 'playlist' | 'album' | 'artist' | 'user', description?: string, dataAiHint: string, genre?: string, username?: string })[] = [
  { id: 's1', title: 'Synthwave Dreams', artist: 'Future Prez', imageUrl: 'https://placehold.co/300x300/8E44AD/FFFFFF.png?text=SD', type: 'track', genre: 'Synthwave', dataAiHint: '80s synth' },
  { id: 's2', title: 'Ocean Drive', artist: 'Miami Nights', imageUrl: 'https://placehold.co/300x300/3498DB/FFFFFF.png?text=OD', type: 'track', genre: 'Chillwave', dataAiHint: 'beach drive' },
  { id: 'a1', title: 'Retrowave Anthems', artist: 'Gridrunner', imageUrl: 'https://placehold.co/300x300/E74C3C/FFFFFF.png?text=RA', type: 'album', genre: 'Retrowave', dataAiHint: 'neon grid' },
  { id: 'p1', title: 'Focus Flow', description: 'Instrumental beats for deep work', imageUrl: 'https://placehold.co/300x300/2ECC71/FFFFFF.png?text=FF', type: 'playlist', genre: 'Lo-Fi', dataAiHint: 'study concentration' },
  { id: 'ar1', title: 'Com Truise', description: 'Synthwave Producer', imageUrl: 'https://placehold.co/300x300/F1C40F/000000.png?text=CT', type: 'artist', genre: 'Synthwave', dataAiHint: 'musician portrait' },
  { id: 'u1', username: 'SynthFan123', title: 'SynthFan123', imageUrl: 'https://placehold.co/100x100/5DADE2/FFFFFF.png?text=SF', type: 'user', description: 'Lover of all things synth.', dataAiHint: 'user avatar' },
  { id: 's3', title: 'Star Dust', artist: 'Cosmic Voyager', imageUrl: 'https://placehold.co/300x300/9B59B6/FFFFFF.png?text=SD', type: 'track', genre: 'Ambient', dataAiHint: 'space nebula' },
  { id: 'a2', title: 'Digital Emotion', artist: 'Vector Graphics', imageUrl: 'https://placehold.co/300x300/1ABC9C/FFFFFF.png?text=DE', type: 'album', genre: 'Electronic', dataAiHint: 'abstract circuit' },
  { id: 'u2', username: 'MusicExplorer', title: 'MusicExplorer', imageUrl: 'https://placehold.co/100x100/AF7AC5/FFFFFF.png?text=ME', type: 'user', description: 'Always looking for new tunes.', dataAiHint: 'headphones illustration' },
];

const resultTypes = ["All", "Tracks", "Albums", "Playlists", "Artists", "Users"];
const genres = ["Synthwave", "Chillwave", "Retrowave", "Lo-Fi", "Ambient", "Electronic", "All"];
// const moods = ["Focus", "Relax", "Energetic", "Nostalgic", "Driving"]; // Example moods

interface SearchResultItem {
  id: string;
  title: string;
  type: 'track' | 'album' | 'playlist' | 'artist' | 'user';
  imageUrl: string;
  artist?: string;
  username?: string;
  description?: string;
  dataAiHint: string;
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeType, setActiveType] = useState<string>("All");
  const [activeGenre, setActiveGenre] = useState<string | null>("All");
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);

  useEffect(() => {
    if (!searchTerm && activeType === "All" && activeGenre === "All") {
      setSearchResults([]); 
      return;
    }

    const filtered = allMockItems.filter(item => {
      const matchesSearch = searchTerm ? 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.artist?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      
      const matchesType = activeType !== "All" ? item.type === activeType.toLowerCase().slice(0, -1) : true; // 'Tracks' -> 'track'
      const matchesGenre = activeGenre && activeGenre !== "All" ? item.genre === activeGenre : true;
      
      return matchesSearch && matchesType && matchesGenre;
    });
    setSearchResults(filtered.map(item => ({...item} as SearchResultItem)));
  }, [searchTerm, activeType, activeGenre]);

  const renderItem = (item: SearchResultItem) => {
    if (item.type === 'user') {
      return (
        <Link href={`/profile/${item.id}`} key={item.id} legacyBehavior>
          <Card className="bg-card hover:bg-card/80 transition-colors cursor-pointer h-full">
            <CardContent className="p-4 flex flex-col items-center text-center gap-3">
              <Avatar className="w-20 h-20 border-2 border-primary">
                <AvatarImage src={item.imageUrl} alt={item.username} data-ai-hint={item.dataAiHint} />
                <AvatarFallback>{item.username?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-foreground">{item.username}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      );
    }
    if (item.type === 'artist') {
      return (
        <Card key={item.id} className="bg-card hover:bg-card/80 transition-colors h-full">
          <CardContent className="p-4 flex flex-col items-center text-center gap-3">
             <Avatar className="w-20 h-20 border-2 border-primary">
                <AvatarImage src={item.imageUrl} alt={item.title} data-ai-hint={item.dataAiHint} />
                <AvatarFallback>{item.title?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
            <div>
              <h3 className="font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground">Artist</p>
            </div>
          </CardContent>
        </Card>
      );
    }
    return <AlbumCard key={item.id} item={item as Track & {type?: 'track' | 'playlist' | 'album', description?: string, dataAiHint: string}} className="h-full"/>;
  };

  const getIconForType = (type: string) => {
    if (type === "Tracks") return <ListMusic size={16} className="mr-1.5" />;
    if (type === "Albums") return <DiscAlbum size={16} className="mr-1.5" />;
    if (type === "Playlists") return <ListMusic size={16} className="mr-1.5" />; // Consider a different icon if available
    if (type === "Artists") return <User size={16} className="mr-1.5" />;
    if (type === "Users") return <Users size={16} className="mr-1.5" />;
    return null;
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
      <SearchBar 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <section>
        <div className="flex flex-wrap gap-2 mb-4">
          {resultTypes.map(type => (
            <FilterChip 
              key={type} 
              isActive={activeType === type}
              onClick={() => setActiveType(type)}
              className="flex items-center"
            >
              {getIconForType(type)}
              {type}
            </FilterChip>
          ))}
        </div>
        <SectionTitle className="text-lg mb-2 sr-only">Genres</SectionTitle>
        <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-thin">
          {genres.map(genre => (
            <FilterChip 
              key={genre} 
              isActive={activeGenre === genre}
              onClick={() => setActiveGenre(genre === activeGenre ? "All" : genre)}
              className="flex-shrink-0"
            >
              {genre}
            </FilterChip>
          ))}
        </div>
      </section>

      <section aria-labelledby="search-results-title">
        <SectionTitle id="search-results-title" className="text-2xl">
          {searchTerm || activeType !== "All" || activeGenre !== "All" ? 'Results' : 'Start Searching or Select Filters'}
        </SectionTitle>
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {searchResults.map(renderItem)}
          </div>
        ) : (
          (searchTerm || activeType !== "All" || activeGenre !== "All") && (
            <p className="text-muted-foreground text-center py-8">
              No results found. Try a different search or broaden your filters.
            </p>
          )
        )}
      </section>
    </div>
  );
}
