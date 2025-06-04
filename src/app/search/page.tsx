'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import FilterChip from '@/components/FilterChip';
import SectionTitle from '@/components/SectionTitle';
import { AlbumCard } from '@/components/AlbumCard';
import type { Track, Song, Album, Artist } from '@/types/music';
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
import { searchLibrary } from '@/utils/searchLibrary';

const resultTypes = ['All', 'Tracks', 'Albums', 'Singles', 'Playlists', 'Artists', 'Users'];

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeType, setActiveType] = useState<string>('All');
  const [searchResults, setSearchResults] = useState<{
    songs: Track[];
    albums: Album[];
    artists: Artist[];
  }>({ songs: [], albums: [], artists: [] });

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchTerm.trim()) {
        setSearchResults({ songs: [], albums: [], artists: [] });
        return;
      }

      const results = await searchLibrary(searchTerm);

      setSearchResults({
        songs: results.songs.map((song: Song) => normalizeTrack(song)),
        albums: results.albums,
        artists: results.artists,
      });
    };

    fetchResults();
  }, [searchTerm, activeType]);

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

        {(activeType === 'All' || activeType === 'Tracks') && searchResults.songs.length > 0 && (
          <div className="mt-4 space-y-2">
            <SectionTitle className="text-xl">Songs</SectionTitle>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">
              {searchResults.songs.map((song) => (
                <AlbumCard key={song.id} item={song} className="h-full" />
              ))}
            </div>
          </div>
        )}

        {(activeType === 'All' || activeType === 'Albums') && searchResults.albums.length > 0 && (
          <div className="mt-4 space-y-2">
            <SectionTitle className="text-xl">Albums</SectionTitle>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">
              {searchResults.albums.map((album) => (
                <AlbumCard
                  key={album.id}
                  item={{
                    id: album.id,
                    type: 'album',
                    title: (album as any).title || '',
                    artists: (album as any).artist ? [{ id: '', name: (album as any).artist }] : [],
                    audioURL: '',
                    coverURL: (album as any).coverURL || '',
                    album: (album as any).title || '',
                  }}
                  className="h-full"
                />
              ))}
            </div>
          </div>
        )}

        {(activeType === 'All' || activeType === 'Artists') && searchResults.artists.length > 0 && (
          <div className="mt-4 space-y-2">
            <SectionTitle className="text-xl">Artists</SectionTitle>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6 lg:grid-cols-5">
              {searchResults.artists.map((artist) => (
                <Link href={`/artist/${artist.id}`} key={artist.id} legacyBehavior>
                  <Card className="h-full cursor-pointer bg-card transition-colors hover:bg-card/80">
                    <CardContent className="flex flex-col items-center gap-3 p-4 text-center">
                      <Avatar className="size-20 border-2 border-primary">
                        <AvatarImage src={(artist as any).coverURL} alt={artist.name} />
                        <AvatarFallback>{artist.name?.[0]?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-foreground">{artist.name}</h3>
                        <p className="text-sm text-muted-foreground">Artist</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {searchResults.songs.length === 0 &&
          searchResults.albums.length === 0 &&
          searchResults.artists.length === 0 &&
          (searchTerm || activeType !== 'All') && (
            <p className="py-8 text-center text-muted-foreground">
              No results found for &quot;{searchTerm}&quot;{' '}
              {activeType !== 'All' ? `in ${activeType}` : ''}. Try a different search or broaden
              your filters.
            </p>
          )}
      </section>
    </div>
  );
}
