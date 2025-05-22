// src/app/genre/[genre]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { usePlayer } from "@/contexts/PlayerContext";
import { PlayCircle } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";
import AlbumCard from "@/components/AlbumCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Track } from "@/contexts/PlayerContext";

export default function GenrePage() {
  const { genre } = useParams();
  const [tracks, setTracks] = useState<Track[]>([]);
  const { playTrack, setQueue } = usePlayer();
  const { toast } = useToast();

  useEffect(() => {
    const fetchGenreTracks = async () => {
      const q = query(collection(db, "tracks"), where("genre", "==", genre));
      const snap = await getDocs(q);
      setTracks(snap.docs.map((doc) => doc.data() as Track));
    };
    fetchGenreTracks();
  }, [genre]);

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      setQueue(tracks);
      playTrack(tracks[0]);
      toast({ title: "Now Playing", description: `Genre: ${genre}` });
    }
  };

  return (
    <div className="container py-8 space-y-6">
      <div className="flex justify-between items-center">
        <SectionTitle>Genre: {genre}</SectionTitle>
        <Button onClick={handlePlayAll}><PlayCircle className="mr-2" /> Play All</Button>
      </div>

      {tracks.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tracks.map((track) => (
            <AlbumCard key={track.id} item={{ ...track, type: "track" }} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No songs found in this genre.</p>
      )}
    </div>
  );
}
