'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import FilterChip from '@/components/FilterChip';
import SectionTitle from '@/components/SectionTitle';
import { AlbumCard } from '@/components/AlbumCard';
import type { Track } from '@/types/music';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  User,
  ListMusic,
  DiscAlbum,
  Users as UsersIcon,
  Search as SearchIcon,
  Music,
} from 'lucide-react';
import { normalizeTrack } from '@/utils/normalizeTrack';
import { formatArtists } from '@/utils/formatArtists';
import { searchLibrary } from '@/utils/searchLibrary';

const resultTypes = ['All', 'Tracks', 'Albums', 'Singles', 'Playlists', 'Artists', 'Users'];

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeType, setActiveType] = useState<string>('All');
  const [searchResults, setSearchResults] = useState<Track[]>([]); // Updated type to Track[]

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }

      const results = await searchLibrary(searchTerm);

      // Combine results based on activeType
      let combinedResults: Track[] = [];
      if (activeType === 'All' || activeType === 'Tracks') {
        combinedResults = combinedResults.concat(
          results.songs.map((song: any) => normalizeTrack(song))
        );
      }
      if (activeType === 'All' || activeType === 'Albums') {
        combinedResults = combinedResults.concat(
          results.albums.map((album: any) => ({
            id: album.id,
            type: 'album',
            title: album.title || '',
            artist: album.artist || '',
            audioURL: album.audioURL || '',
            coverURL: album.coverURL || '',
            album: album.title || '',
            artists: album.artist ? [album.artist] : [],
          }))
        );
      }
      if (activeType === 'All' || activeType === 'Artists') {
        combinedResults = combinedResults.concat(
          results.artists.map((artist: any) => ({
            id: artist.id,
            type: 'artist',
            title: artist.name || '',
            artist: artist.name || '',
            audioURL: '',
            coverURL: artist.coverURL || '',
            album: '',
            artists: artist.name ? [artist.name] : [],
          }))
        );
      }

      setSearchResults(combinedResults);
    };

    fetchResults();
  }, [searchTerm, activeType]);

  const renderItem = (item: Track) => {
    if (item.type === 'user') {
      return (
        <Link href={`/profile/${item.id}`} key={item.id} legacyBehavior>
          <Card className="h-full cursor-pointer bg-card transition-colors hover:bg-card/80">
            <CardContent className="flex flex-col items-center gap-3 p-4 text-center">
              <Avatar className="size-20 border-2 border-primary">
                <AvatarImage src={item.coverURL} alt={item.title} />
                <AvatarFallback>{item.title?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="line-clamp-2 text-xs text-muted-foreground">
                  {formatArtists(item.artists)}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      );
    }

    if (item.type === 'artist') {
      return (
        <Link href={`/artist/${item.id}`} key={item.id} legacyBehavior>
          <Card className="h-full cursor-pointer bg-card transition-colors hover:bg-card/80">
            <CardContent className="flex flex-col items-center gap-3 p-4 text-center">
              <Avatar className="size-20 border-2 border-primary">
                <AvatarImage src={item.coverURL} alt={item.title} />
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

    return <AlbumCard key={item.id} item={item} className="h-full" />;
  };

  const getIconForType = (type: string) => {
    if (type === 'Tracks') return <Music size={16} className="mr-1.5" />;
    if (type === 'Albums') return <DiscAlbum size={16} className="mr-1.5" />;
    if (type === 'Singles') return <DiscAlbum size={16} className="mr-1.5" />;
    if (type === 'Playlists') return <ListMusic size={16} className="mr-1.5" />;
    if (type === 'Artists') return <User size={16} className="mr-1.5" />;
    if (type === 'Users') return <UsersIcon size={16} className="mr-1.5" />;
    return <SearchIcon size={16} className="mr-1.5" />;
  };

  return (
    <div className="container mx-auto space-y-6 p-4 md:space-y-8 md:p-6">
      <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

      <section>
        <div className="mb-4 flex flex-wrap gap-2">
          {resultTypes.map((type) => (
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
      </section>

      <section aria-labelledby="search-results-title">
        <SectionTitle id="search-results-title" className="text-2xl">
          {searchTerm || activeType !== 'All' ? 'Results' : 'Start Searching or Select Filters'}
        </SectionTitle>
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">
            {searchResults.map(renderItem)}
          </div>
        ) : (
          (searchTerm || activeType !== 'All') && (
            <p className="py-8 text-center text-muted-foreground">
              No results found for &quot;{searchTerm}&quot;{' '}
              {activeType !== 'All' ? `in ${activeType}` : ''}. Try a different search or broaden
              your filters.
            </p>
          )
        )}
      </section>
    </div>
  );
}
