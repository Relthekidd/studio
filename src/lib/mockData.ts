
import type { Track, ArtistStub } from '@/contexts/PlayerContext';

export interface ArtistFull extends ArtistStub {
  bio: string;
  imageUrl: string;
  dataAiHint: string;
  albums: string[]; // Array of album IDs
  singles: string[]; // Array of single IDs (can be album IDs too)
  featuredOn: string[]; // Array of track IDs
}

export interface AlbumFull extends Track {
  type: 'album' | 'single'; // Differentiate for display/linking
  artistIds: string[]; // IDs of main artists
  artistsDisplay: string; // Formatted artist string for display
  tracklist: Track[];
  releaseDate: string;
  credits: string; // e.g., "Produced by X, Written by Y"
}

// --- MOCK DATA ---

export const mockArtists: Record<string, ArtistFull> = {
  "artist1": { 
    id: "artist1", 
    name: "Neon Voyager", 
    bio: "Exploring synthetic soundscapes and retro-futuristic vibes. Neon Voyager is known for their driving basslines and ethereal melodies.",
    imageUrl: "https://placehold.co/300x300/BE52FF/222222.png?text=NV",
    dataAiHint: "synthwave artist",
    albums: ["album1"],
    singles: ["single1"],
    featuredOn: ["track5_feat"],
  },
  "artist2": {
    id: "artist2",
    name: "Grid Runner",
    bio: "High-octane electronic music producer specializing in outrun and darksynth.",
    imageUrl: "https://placehold.co/300x300/39FF14/222222.png?text=GR",
    dataAiHint: "electronic musician",
    albums: [],
    singles: ["track2_single"],
    featuredOn: [],
  },
  "artist3": {
    id: "artist3",
    name: "Kavinsky", // Example well-known artist
    bio: "French electronic music producer, known for his distinctive 80s-inspired style.",
    imageUrl: "https://placehold.co/300x300/FFD700/222222.png?text=KV",
    dataAiHint: "retro dj",
    albums: ["album_kavinsky1"],
    singles: [],
    featuredOn: [],
  }
};

export const mockAlbumsAndSingles: Record<string, AlbumFull> = {
  "album1": {
    id: "album1",
    title: "Cyber Dreams",
    artistIds: ["artist1"],
    artistsDisplay: "Neon Voyager",
    imageUrl: "https://placehold.co/300x300/BE52FF/222222.png?text=CD",
    dataAiHint: "synthwave sunset",
    type: "album",
    releaseDate: "2023-03-15",
    credits: "All tracks written and produced by Neon Voyager.",
    tracklist: [
      { id: "track1_1", title: "First Light", artist: "Neon Voyager", albumId: "album1", trackNumber: 1, duration: 210, imageUrl: "https://placehold.co/300x300/BE52FF/222222.png?text=CD", artists: [{id: "artist1", name: "Neon Voyager"}], audioSrc: "/music/placeholder1.mp3" },
      { id: "track1_2", title: "Digital Dawn", artist: "Neon Voyager", albumId: "album1", trackNumber: 2, duration: 245, imageUrl: "https://placehold.co/300x300/BE52FF/222222.png?text=CD", artists: [{id: "artist1", name: "Neon Voyager"}], audioSrc: "/music/placeholder2.mp3" },
      { id: "track1_3", title: "Neon Pulse", artist: "Neon Voyager", albumId: "album1", trackNumber: 3, duration: 190, imageUrl: "https://placehold.co/300x300/BE52FF/222222.png?text=CD", artists: [{id: "artist1", name: "Neon Voyager"}] },
    ]
  },
  "single1": {
    id: "single1",
    title: "Starlight Drive",
    artistIds: ["artist1"],
    artistsDisplay: "Neon Voyager",
    imageUrl: "https://placehold.co/300x300/BE52FF/333333.png?text=SD",
    dataAiHint: "night highway stars",
    type: "single",
    releaseDate: "2024-01-20",
    credits: "Written and produced by Neon Voyager.",
    tracklist: [
      { id: "track_single1", title: "Starlight Drive", artist: "Neon Voyager", albumId: "single1", trackNumber: 1, duration: 220, imageUrl: "https://placehold.co/300x300/BE52FF/333333.png?text=SD", artists: [{id: "artist1", name: "Neon Voyager"}], audioSrc: "/music/placeholder1.mp3" },
    ]
  },
  "track2_single": { // This is a track that is also marketed as a single
    id: "track2_single",
    title: "Night Drive",
    artistIds: ["artist2"],
    artistsDisplay: "Grid Runner",
    imageUrl: "https://placehold.co/300x300/39FF14/222222.png?text=ND",
    dataAiHint: "neon city car",
    type: "single", // Could also be 'track' if we differentiate single pages from track pages
    releaseDate: "2022-11-05",
    credits: "Produced by Grid Runner.",
    tracklist: [
       { id: "track2", title: "Night Drive", artist: "Grid Runner", albumId: "track2_single", trackNumber: 1, duration: 200, imageUrl: "https://placehold.co/300x300/39FF14/222222.png?text=ND", artists: [{id: "artist2", name: "Grid Runner"}], audioSrc: "/music/placeholder2.mp3" }
    ]
  },
  "album_kavinsky1": {
    id: "album_kavinsky1",
    title: "OutRun",
    artistIds: ["artist3"],
    artistsDisplay: "Kavinsky",
    imageUrl: "https://placehold.co/300x300/FFD700/222222.png?text=OutRun",
    dataAiHint: "retro car game",
    type: "album",
    releaseDate: "2013-02-22",
    credits: "Iconic album by Kavinsky.",
    tracklist: [
      { id: "ktrack1", title: "Prelude", artist: "Kavinsky", albumId: "album_kavinsky1", trackNumber: 1, duration: 90, imageUrl: "https://placehold.co/300x300/FFD700/222222.png?text=OutRun", artists: [{id: "artist3", name: "Kavinsky"}] },
      { id: "ktrack2", title: "Nightcall", artist: "Kavinsky", albumId: "album_kavinsky1", trackNumber: 2, duration: 258, imageUrl: "https://placehold.co/300x300/FFD700/222222.png?text=OutRun", artists: [{id: "artist3", name: "Kavinsky"}], audioSrc: "/music/placeholder1.mp3" },
    ]
  }
};

// Individual tracks (some might be part of albums above, some standalone)
export const mockTracks: Record<string, Track> = {
  "track1_1": { ...mockAlbumsAndSingles["album1"].tracklist[0], album: "Cyber Dreams" },
  "track1_2": { ...mockAlbumsAndSingles["album1"].tracklist[1], album: "Cyber Dreams" },
  "track1_3": { ...mockAlbumsAndSingles["album1"].tracklist[2], album: "Cyber Dreams" },
  "track_single1": { ...mockAlbumsAndSingles["single1"].tracklist[0], album: "Starlight Drive (Single)" },
  "track2": { ...mockAlbumsAndSingles["track2_single"].tracklist[0], album: "Night Drive (Single)" },
  "ktrack1": { ...mockAlbumsAndSingles["album_kavinsky1"].tracklist[0], album: "OutRun" },
  "ktrack2": { ...mockAlbumsAndSingles["album_kavinsky1"].tracklist[1], album: "OutRun" },
  "track5_feat": { 
    id: "track5_feat", 
    title: "Cosmic Ray (feat. Neon Voyager)", 
    artist: "Starship Alpha", 
    artists: [{id: "artist_unknown", name: "Starship Alpha"}, {id: "artist1", name: "Neon Voyager"}], 
    album: "Galaxy Quest", 
    imageUrl: "https://placehold.co/300x300/C0C0C0/222222.png?text=CR", 
    dataAiHint: "space laser",
    duration: 230 
  },
  "track_standalone": {
    id: 'track_standalone', 
    title: 'Midnight City Run', 
    artist: 'Synth Riders', 
    artists: [{id: "artist_synthriders", name:"Synth Riders"}],
    imageUrl: 'https://placehold.co/300x300/FF4500/222222.png?text=MCR', 
    dataAiHint: 'night city driving',
    type: 'track',
    duration: 195,
    audioSrc: "/music/placeholder2.mp3"
  }
};

// Helper function to get multiple albums/singles by IDs
export const getMultipleAlbumsByIds = (ids: string[]): AlbumFull[] => {
  return ids.map(id => mockAlbumsAndSingles[id]).filter(Boolean) as AlbumFull[];
};

// Helper function to get multiple tracks by IDs
export const getMultipleTracksByIds = (ids: string[]): Track[] => {
  return ids.map(id => mockTracks[id]).filter(Boolean);
};

// Simplified items for general lists like homepage, discover
export const generalMockItems: Track[] = [
  { ...mockAlbumsAndSingles["album1"], artist: mockAlbumsAndSingles["album1"].artistsDisplay },
  { ...mockTracks["track2"], albumId: "track2_single"}, // Ensure track2 has albumId to link to its single page
  { ...mockAlbumsAndSingles["album_kavinsky1"], artist: mockAlbumsAndSingles["album_kavinsky1"].artistsDisplay },
  { 
    id: 'playlist1', 
    title: 'Chillwave Peace', 
    description: 'Relax and unwind with lo-fi beats', 
    imageUrl: 'https://placehold.co/300x300/00FFFF/222222.png?text=CP', 
    type: 'playlist', 
    dataAiHint: 'beach hammock' 
  },
  mockTracks["track_standalone"],
  mockTracks["track5_feat"],
];

    