
"use client"; // Required for useState, useEffect, event handlers

import { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import FilterChip from '@/components/FilterChip';
import SectionTitle from '@/components/SectionTitle';
import AlbumCard from '@/components/AlbumCard';
import type { Track } from '@/contexts/PlayerContext';
import { Card, CardContent } from '@/components/ui/card';
import { User, ListMusic, Disc } from 'lucide-react';

// Mock data - replace with Firebase search results
const allMockItems: (Track & { type?: 'track' | 'playlist' | 'album' | 'artist', description?: string, dataAiHint: string, genre?: string })[] = [
  { id: 's1', title: 'Synthwave Dreams', artist: 'Future Prez', imageUrl: 'https://placehold.co/300x300/8E44AD/FFFFFF.png?text=SD', type: 'track', genre: 'Synthwave', dataAiHint: '80s synth' },
  { id: 's2', title: 'Ocean Drive', artist: 'Miami Nights', imageUrl: 'https://placehold.co/300x300/3498DB/FFFFFF.png?text=OD', type: 'track', genre: 'Chillwave', dataAiHint: 'beach drive' },
  { id: 'a1', title: 'Retrowave Anthems', artist: 'Gridrunner', imageUrl: 'https://placehold.co/300x300/E74C3C/FFFFFF.png?text=RA', type: 'album', genre: 'Retrowave', dataAiHint: 'neon grid' },
  { id: 'p1', title: 'Focus Flow', description: 'Instrumental beats for deep work', imageUrl: 'https://placehold.co/300x300/2ECC71/FFFFFF.png?text=FF', type: 'playlist', genre: 'Lo-Fi', dataAiHint: 'study concentration' },
  { id: 'ar1', title: 'Com Truise', description: 'Synthwave Producer', imageUrl: 'https://placehold.co/300x300/F1C40F/000000.png?text=CT', type: 'artist', genre: 'Synthwave', dataAiHint: 'musician portrait' },
  { id: 's3', title: 'Star Dust', artist: 'Cosmic Voyager', imageUrl: 'https://placehold.co/300x300/9B59B6/FFFFFF.png?text=SD', type: 'track', genre: 'Ambient', dataAiHint: 'space nebula' },
  { id: 'a2', title: 'Digital Emotion', artist: 'Vector Graphics', imageUrl: 'https://placehold.co/300x300/1ABC9C/FFFFFF.png?text=DE', type: 'album', genre: 'Electronic', dataAiHint: 'abstract circuit' },
];

const genres = ["Synthwave", "Chillwave", "Retrowave", "Lo-Fi", "Ambient", "Electronic", "All"];
const moods = ["Focus", "Relax", "Energetic", "Nostalgic", "Driving"]; // Example moods

interface SearchResultItem {
  id: string;
  title: string;
  type: 'track' | 'album' | 'playlist' | 'artist';
  imageUrl: string;
  artist?: string;
  description?: string;
  dataAiHint: string;
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeGenre, setActiveGenre] = useState<string | null>("All");
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);

  // TODO: Implement Firebase search logic here
  // This useEffect simulates a search operation.
  useEffect(() => {
    if (!searchTerm && activeGenre === "All" && !activeMood) {
      setSearchResults([]); // Show nothing or popular searches initially
      return;
    }

    const filtered = allMockItems.filter(item => {
      const matchesSearch = searchTerm ? 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.artist?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      const matchesGenre = activeGenre && activeGenre !== "All" ? item.genre === activeGenre : true;
      // Mood filtering would require mood tags on items or AI-based mood detection
      const matchesMood = activeMood ? true : true; // Placeholder for mood filtering

      return matchesSearch && matchesGenre && matchesMood;
    });
    setSearchResults(filtered.map(item => ({...item, type: item.type || 'track'} as SearchResultItem)));
  }, [searchTerm, activeGenre, activeMood]);

  const renderItem = (item: SearchResultItem) => {
    if (item.type === 'artist') {
      return (
        <Card key={item.id} className="bg-card hover:bg-card/80 transition-colors">
          <CardContent className="p-4 flex items-center gap-4">
            <img src={item.imageUrl} alt={item.title} data-ai-hint={item.dataAiHint} className="w-16 h-16 rounded-full object-cover"/>
            <div>
              <h3 className="font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground">Artist</p>
            </div>
          </CardContent>
        </Card>
      );
    }
    // For tracks, albums, playlists, use AlbumCard
    return <AlbumCard key={item.id} item={item as Track & {type?: 'track' | 'playlist' | 'album', description?: string, dataAiHint: string}} />;
  };


  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8">
      <SearchBar 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <section>
        <SectionTitle className="text-xl mb-3">Genres</SectionTitle>
        <div className="flex flex-wrap gap-2 mb-6">
          {genres.map(genre => (
            <FilterChip 
              key={genre} 
              isActive={activeGenre === genre}
              onClick={() => setActiveGenre(genre === activeGenre ? null : genre)}
            >
              {genre}
            </FilterChip>
          ))}
        </div>
        {/* 
        <SectionTitle className="text-xl mb-3">Moods</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {moods.map(mood => (
            <FilterChip 
              key={mood} 
              isActive={activeMood === mood}
              onClick={() => setActiveMood(mood === activeMood ? null : mood)}
            >
              {mood}
            </FilterChip>
          ))}
        </div>
         */}
      </section>

      <section aria-labelledby="search-results-title">
        <SectionTitle id="search-results-title">
          {searchTerm || activeGenre !== "All" || activeMood ? 'Results' : 'Browse All (Mock Data)'}
        </SectionTitle>
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {searchResults.map(renderItem)}
          </div>
        ) : (
          <p className="text-muted-foreground">
            {searchTerm || activeGenre !== "All" || activeMood ? 'No results found. Try a different search or filters.' : 'Start typing to search or select a filter.'}
          </p>
        )}
      </section>
      
      {/* Example of how different result types could be sectioned */}
       {searchResults.length > 0 && (
        <>
          {searchResults.filter(item => item.type === 'track').length > 0 && (
            <section className="mt-8">
              <SectionTitle className="text-xl flex items-center gap-2"><ListMusic size={22}/> Tracks</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {searchResults.filter(item => item.type === 'track').map(renderItem)}
              </div>
            </section>
          )}
          {searchResults.filter(item => item.type === 'album').length > 0 && (
            <section className="mt-8">
              <SectionTitle className="text-xl flex items-center gap-2"><Disc size={22}/> Albums</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {searchResults.filter(item => item.type === 'album').map(renderItem)}
              </div>
            </section>
          )}
          {searchResults.filter(item => item.type === 'artist').length > 0 && (
            <section className="mt-8">
              <SectionTitle className="text-xl flex items-center gap-2"><User size={22}/> Artists</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {searchResults.filter(item => item.type === 'artist').map(renderItem)}
              </div>
            </section>
          )}
        </>
      )}

    </div>
  );
}
