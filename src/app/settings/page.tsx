'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import SearchBar from '@/components/SearchBar';
import FilterChip from '@/components/FilterChip';
import SectionTitle from '@/components/SectionTitle';
import { AlbumCard } from '@/components/AlbumCard';
import type { Track } from '@/types/music';
import {
  Music,
  DiscAlbum,
  ListMusic,
  User,
  Users as UsersIcon,
  Search as SearchIcon,
} from 'lucide-react';

const resultTypes = ['All', 'Tracks', 'Albums', 'Singles'];

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeType, setActiveType] = useState('All');
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);

      try {
        const lowerTerm = searchTerm.toLowerCase();

        // Firestore query based on activeType
        let q;
        if (activeType === 'Tracks' || activeType === 'All') {
          q = query(collection(db, 'tracks'), where('keywords', 'array-contains', lowerTerm));
        } else if (activeType === 'Albums') {
          q = query(collection(db, 'albums'), where('keywords', 'array-contains', lowerTerm));
        } else if (activeType === 'Singles') {
          q = query(collection(db, 'singles'), where('keywords', 'array-contains', lowerTerm));
        } else {
          // If no valid type, return empty results
          setSearchResults([]);
          setLoading(false);
          return;
        }

        const querySnapshot = await getDocs(q);
        const results: Track[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();

          const artists = Array.isArray(data.artists)
            ? data.artists
            : data.artist
              ? [{ id: data.artistId ?? '', name: data.artist }]
              : [];

          return {
            id: doc.id,
            title: data.title || 'Untitled',
            audioURL: data.audioURL || '',
            coverURL: data.coverURL || '/placeholder.png',
            artists,
            album: data.album || null,
            type: activeType.toLowerCase(),
          };
        });

        setSearchResults(results);
      } catch (err) {
        console.error('Error fetching search results:', err);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    if (searchTerm.trim()) {
      fetchResults();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, activeType]);

  const getIconForType = (type: string) => {
    if (type === 'Tracks') return <Music size={16} className="mr-1.5" />;
    if (type === 'Albums' || type === 'Singles') return <DiscAlbum size={16} className="mr-1.5" />;
    if (type === 'Playlists') return <ListMusic size={16} className="mr-1.5" />;
    if (type === 'Artists') return <User size={16} className="mr-1.5" />;
    if (type === 'Users') return <UsersIcon size={16} className="mr-1.5" />;
    return <SearchIcon size={16} className="mr-1.5" />;
  };

  return (
    <div className="container mx-auto space-y-6 p-4 md:space-y-8 md:p-6">
      <SearchBar
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search tracks, albums, artists..."
      />

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

      <SectionTitle className="text-2xl">
        {searchTerm || activeType !== 'All' ? 'Results' : 'Start Searching or Select Filters'}
      </SectionTitle>

      {loading ? (
        <p className="py-8 text-center text-muted-foreground">Loading...</p>
      ) : searchResults.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {searchResults.map((item) => (
            <AlbumCard key={item.id} item={item} className="h-full" />
          ))}
        </div>
      ) : (
        (searchTerm || activeType !== 'All') && (
          <p className="py-8 text-center text-muted-foreground">
            No results found for &quot;{searchTerm}&quot; in {activeType}.
          </p>
        )
      )}
    </div>
  );
}
