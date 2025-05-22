"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import SearchBar from "@/components/SearchBar";
import FilterChip from "@/components/FilterChip";
import SectionTitle from "@/components/SectionTitle";
import { AlbumCard } from "@/components/AlbumCard";
import type { Track } from "@/contexts/PlayerContext";
import { Music, DiscAlbum, ListMusic, User, Users as UsersIcon, Search as SearchIcon } from "lucide-react";

const resultTypes = ["All", "Tracks", "Albums", "Singles"];

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeType, setActiveType] = useState("All");
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);

      try {
        const q = query(collection(db, "tracks"));
        const querySnapshot = await getDocs(q);
        const allSongs = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            artist: data.artist,
            imageUrl: data.coverUrl, // required field
            coverUrl: data.coverUrl,
            audioUrl: data.audioUrl,
            duration: data.duration,
            type: "track",
          } as Track;
        });

        // Filter
        const lowerTerm = searchTerm.toLowerCase();
        const filtered = allSongs.filter((song) => {
          const matchesType =
            activeType === "All" ||
            (activeType === "Tracks" && song.type === "track") ||
            (activeType === "Albums" && song.type === "album") ||
            (activeType === "Singles" && song.type === "single");

          const matchesSearch =
            song.title?.toLowerCase().includes(lowerTerm) ||
            song.artist?.toLowerCase().includes(lowerTerm);

          return matchesType && matchesSearch;
        });

        setSearchResults(filtered);
      } catch (err) {
        console.error("Search fetch error:", err);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [searchTerm, activeType]);

  const getIconForType = (type: string) => {
    if (type === "Tracks") return <Music size={16} className="mr-1.5" />;
    if (type === "Albums" || type === "Singles") return <DiscAlbum size={16} className="mr-1.5" />;
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
        placeholder="Search tracks, albums, artists..."
      />

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

      <SectionTitle className="text-2xl">
        {searchTerm || activeType !== "All" ? "Results" : "Start Searching or Select Filters"}
      </SectionTitle>

      {loading ? (
        <p className="text-muted-foreground text-center py-8">Loading...</p>
      ) : searchResults.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {searchResults.map((item) => (
            <AlbumCard key={item.id} item={item} className="h-full" />
          ))}
        </div>
      ) : (
        (searchTerm || activeType !== "All") && (
          <p className="text-muted-foreground text-center py-8">
            No results found for "{searchTerm}" in {activeType}.
          </p>
        )
      )}
    </div>
  );
}
