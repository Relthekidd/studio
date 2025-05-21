
"use client"; 

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import FilterChip from '@/components/FilterChip';
import SectionTitle from '@/components/SectionTitle';
import AlbumCard from '@/components/AlbumCard';
import type { Track as PlayerTrack } from '@/contexts/PlayerContext';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, ListMusic, DiscAlbum, Users as UsersIcon, Search as SearchIcon } from 'lucide-react';
import { mockArtists, mockAlbumsAndSingles, mockTracks, generalMockItems } from '@/lib/mockData';

// Combine all mock data into a searchable array
const allSearchableItems: PlayerTrack[] = [
  ...Object.values(mockArtists).map(a => ({ id: a.id, title: a.name, imageUrl: a.imageUrl, type: 'artist' as 'artist', description: a.bio, dataAiHint: a.dataAiHint, artist: a.name /* for AlbumCard */})),
  ...Object.values(mockAlbumsAndSingles).map(al => ({ ...al, artist: al.artistsDisplay, type: al.type as 'album' | 'single' })),
  ...Object.values(mockTracks).map(t => ({ ...t, type: 'track' as 'track' })),
  ...generalMockItems.filter(i => i.type === 'playlist').map(p => ({...p, type: 'playlist' as 'playlist'}))
  // TODO: Add mock user profiles when that data structure is ready
];


const resultTypes = ["All", "Tracks", "Albums", "Singles", "Playlists", "Artists", "Users"];
// const genres = ["Synthwave", "Chillwave", "Retrowave", "Lo-Fi", "Ambient", "Electronic", "All"]; // Genre filtering can be added later

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeType, setActiveType] = useState<string>("All");
  // const [activeGenre, setActiveGenre] = useState<string | null>("All");
  const [searchResults, setSearchResults] = useState<PlayerTrack[]>([]);

  useEffect(() => {
    if (!searchTerm && activeType === "All") { // && activeGenre === "All"
      setSearchResults([]); 
      return;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = allSearchableItems.filter(item => {
      const matchesSearch = searchTerm ? 
        item.title?.toLowerCase().includes(lowerSearchTerm) ||
        item.artist?.toLowerCase().includes(lowerSearchTerm) ||
        (item.type === 'artist' && item.description?.toLowerCase().includes(lowerSearchTerm)) || // Artist bio
        (item.type === 'playlist' && item.description?.toLowerCase().includes(lowerSearchTerm))
        : true;
      
      let typeMatch = true;
      if (activeType !== "All") {
        if (activeType === "Albums") typeMatch = item.type === 'album';
        else if (activeType === "Singles") typeMatch = item.type === 'single';
        else if (activeType === "Tracks") typeMatch = item.type === 'track';
        else if (activeType === "Playlists") typeMatch = item.type === 'playlist';
        else if (activeType === "Artists") typeMatch = item.type === 'artist';
        else if (activeType === "Users") typeMatch = item.type === 'user'; // Placeholder
        else typeMatch = false;
      }
      
      // const matchesGenre = activeGenre && activeGenre !== "All" ? item.genre === activeGenre : true; // Genre field not yet on all items
      
      return matchesSearch && typeMatch; // && matchesGenre;
    });
    setSearchResults(filtered);
  }, [searchTerm, activeType]); // activeGenre

  const renderItem = (item: PlayerTrack) => {
    if (item.type === 'user') { // Placeholder for user search results
      return (
        <Link href={`/profile/${item.id}`} key={item.id} legacyBehavior>
          <Card className="bg-card hover:bg-card/80 transition-colors cursor-pointer h-full">
            <CardContent className="p-4 flex flex-col items-center text-center gap-3">
              <Avatar className="w-20 h-20 border-2 border-primary">
                <AvatarImage src={item.imageUrl} alt={item.title} data-ai-hint={item.dataAiHint || "user avatar"} />
                <AvatarFallback>{item.title?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-foreground">{item.title}</h3> {/* Username */}
                <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p> {/* Bio */}
              </div>
            </CardContent>
          </Card>
        </Link>
      );
    }
    if (item.type === 'artist') {
       return (
        <Link href={`/artist/${item.id}`} key={item.id} legacyBehavior>
          <Card className="bg-card hover:bg-card/80 transition-colors cursor-pointer h-full">
            <CardContent className="p-4 flex flex-col items-center text-center gap-3">
              <Avatar className="w-20 h-20 border-2 border-primary">
                  <AvatarImage src={item.imageUrl} alt={item.title} data-ai-hint={item.dataAiHint || "artist picture"} />
                  <AvatarFallback>{item.title?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
              <div>
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">Artist</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      );
    }
    // For tracks, albums, singles, playlists
    return <AlbumCard key={item.id} item={item} className="h-full"/>;
  };

  const getIconForType = (type: string) => {
    if (type === "Tracks") return <Music size={16} className="mr-1.5" />;
    if (type === "Albums") return <DiscAlbum size={16} className="mr-1.5" />;
    if (type === "Singles") return <DiscAlbum size={16} className="mr-1.5" />; // Using same icon as album for now
    if (type === "Playlists") return <ListMusic size={16} className="mr-1.5" />;
    if (type === "Artists") return <User size={16} className="mr-1.5" />;
    if (type === "Users") return <UsersIcon size={16} className="mr-1.5" />;
    return <SearchIcon size={16} className="mr-1.5" />;
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
        {/* 
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
        */}
      </section>

      <section aria-labelledby="search-results-title">
        <SectionTitle id="search-results-title" className="text-2xl">
          {searchTerm || activeType !== "All" ? 'Results' : 'Start Searching or Select Filters'}
        </SectionTitle>
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {searchResults.map(renderItem)}
          </div>
        ) : (
          (searchTerm || activeType !== "All") && (
            <p className="text-muted-foreground text-center py-8">
              No results found for "{searchTerm}" {activeType !== "All" ? `in ${activeType}`: ""}. Try a different search or broaden your filters.
            </p>
          )
        )}
      </section>
    </div>
  );
}

    