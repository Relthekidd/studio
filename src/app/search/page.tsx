"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import FilterChip from "@/components/FilterChip";
import SectionTitle from "@/components/SectionTitle";
import { AlbumCard } from "@/components/AlbumCard";
import type { Track as PlayerTrack } from "@/contexts/PlayerContext";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  ListMusic,
  DiscAlbum,
  Users as UsersIcon,
  Search as SearchIcon,
  Music,
} from "lucide-react";
import { normalizeTrack } from "@/utils/normalizeTrack";
import { formatArtists } from "@/utils/formatArtists";

const resultTypes = [
  "All",
  "Tracks",
  "Albums",
  "Singles",
  "Playlists",
  "Artists",
  "Users",
];

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeType, setActiveType] = useState<string>("All");
  const [searchResults, setSearchResults] = useState<PlayerTrack[]>([]);

  useEffect(() => {
    setSearchResults([]); // Clear results until real search is implemented

    // TODO: Replace this mock data with real fetched results from your API
    const fetchedResults: PlayerTrack[] = []; // Example: []

    // Define Artist type (replace with import if available elsewhere)
    type Artist = {
      id: string;
      name: string;
    };

    // Fetch artist details (mock example)
    const fetchedArtists: Artist[] = [
      { id: "artist1", name: "Artist One" },
      { id: "artist2", name: "Artist Two" },
    ];

    const results: PlayerTrack[] = fetchedResults.map((item) =>
      normalizeTrack(item, fetchedArtists)
    );
    setSearchResults(results);
  }, [searchTerm, activeType]);

  const renderItem = (item: PlayerTrack) => {
    if (item.type === "user") {
      return (
        <Link href={`/profile/${item.id}`} key={item.id} legacyBehavior>
          <Card className="bg-card hover:bg-card/80 transition-colors cursor-pointer h-full">
            <CardContent className="p-4 flex flex-col items-center text-center gap-3">
              <Avatar className="w-20 h-20 border-2 border-primary">
                <AvatarImage src={item.coverURL} alt={item.title} />
                <AvatarFallback>
                  {item.title?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {formatArtists(item.artist)}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      );
    }

    if (item.type === "artist") {
      return (
        <Link href={`/artist/${item.id}`} key={item.id} legacyBehavior>
          <Card className="bg-card hover:bg-card/80 transition-colors cursor-pointer h-full">
            <CardContent className="p-4 flex flex-col items-center text-center gap-3">
              <Avatar className="w-20 h-20 border-2 border-primary">
                <AvatarImage src={item.coverURL} alt={item.title} />
                <AvatarFallback>
                  {item.title?.[0]?.toUpperCase()}
                </AvatarFallback>
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
    if (type === "Tracks") return <Music size={16} className="mr-1.5" />;
    if (type === "Albums") return <DiscAlbum size={16} className="mr-1.5" />;
    if (type === "Singles") return <DiscAlbum size={16} className="mr-1.5" />;
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
          {searchTerm || activeType !== "All"
            ? "Results"
            : "Start Searching or Select Filters"}
        </SectionTitle>
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {searchResults.map(renderItem)}
          </div>
        ) : (
          (searchTerm || activeType !== "All") && (
            <p className="text-muted-foreground text-center py-8">
              No results found for "{searchTerm}"{" "}
              {activeType !== "All" ? `in ${activeType}` : ""}. Try a different
              search or broaden your filters.
            </p>
          )
        )}
      </section>
    </div>
  );
}
