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
    users: { id: string; displayName: string; avatarURL?: string }[];
  }>({ songs: [], albums: [], artists: [], users: [] });

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchTerm.trim()) {
        setSearchResults({ songs: [], albums: [], artists: [], users: [] });
        return;
      }

      const results = await searchLibrary(searchTerm);

      setSearchResults({
        songs: results.songs.map((song: Song) => normalizeTrack(song, (song as any).artists || [])),
        albums: results.albums.map((album: Album) => ({
          id: album.id,
          title: album.title || '',
          coverURL: album.coverURL || '',
          artistIds: album.artistIds || [],
          genre: album.genre || '',
          description: album.description || '',
          createdAt: album.createdAt?.toDate() || new Date(),
          tags: album.tags || [],
          type: 'album',
          order: album.order || 0, // Add order
          artists:
            Array.isArray(album.artists) && album.artists.length > 0
              ? album.artists
              : typeof album.artists === 'string' && album.artists
                ? [
                    {
                      id: '',
                      name: album.artists,
                      coverURL: '',
                    },
                  ]
                : [],
        })),
        artists: results.artists,
        users: results.users,
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
                <AlbumCard
                  key={song.id}
                  item={{
                    ...song,
                    album: song.album
                      ? {
                          id: song.albumId || '', // Use the album ID if available
                          name: typeof song.album === 'string' ? song.album : '', // Use the album title as string
                          coverURL: song.coverURL || '', // Use the cover URL if available
                        }
                      : undefined, // If no album info is available, set it to undefined
                    order: song.order || 0, // Add order
                  }}
                  className="h-full"
                />
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
                    title: album.title || '',
                    artists: album.artists || [],
                    audioURL: '',
                    coverURL: album.coverURL || '',
                    album: {
                      id: album.id,
                      name: album.title || '',
                      coverURL: album.coverURL || '',
                    }, // Assign a valid AlbumInfo object
                    createdAt: album.createdAt || new Date(),
                    order: album.order || 0, // Add order
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
                <Link href={`/artist/${artist.id}`} key={artist.id}>
                  <Card className="h-full cursor-pointer bg-card transition-colors hover:bg-card/80">
                    <CardContent className="flex flex-col items-center gap-3 p-4 text-center">
                      <Avatar className="size-20 border-2 border-primary">
                        <AvatarImage src={artist.coverURL} alt={artist.name} />
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

        {(activeType === 'All' || activeType === 'Users') && searchResults.users.length > 0 && (
          <div className="mt-4 space-y-2">
            <SectionTitle className="text-xl">Users</SectionTitle>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
              {searchResults.users.map((u) => (
                <Link key={u.id} href={`/profile/${u.id}`} legacyBehavior>
                  <Card className="flex cursor-pointer items-center gap-4 p-4 transition-colors hover:bg-card/80">
                    <Avatar>
                      <AvatarImage src={u.avatarURL} alt={u.displayName} />
                      <AvatarFallback>{u.displayName?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{u.displayName}</span>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {searchResults.songs.length === 0 &&
          searchResults.albums.length === 0 &&
          searchResults.artists.length === 0 &&
          searchResults.users.length === 0 &&
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
