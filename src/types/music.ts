export type Artist = {
  coverURL: string | undefined;
  id: string;
  name: string;
};

export type AlbumInfo = {
  id: string;
  name: string;
  coverURL: string;
};

export type Track = {
  order: number;
  
  createdAt: any;
  id: string;
  title: string;
  artists: Artist[];
  audioURL: string;
  coverURL?: string;
  type: string;
  albumId?: string;
  album?: AlbumInfo;
  duration?: number;
  trackNumber?: number;
  description?: string;
  dataAiHint?: string;
};

// A song is represented the same as a Track in most of the app
export type Song = Track;

export type Album = {
  id: string;
  title: string;
  order: number;
  coverURL?: string;
  artistIds: string[]; // Array of artist IDs
  genre?: string; // Genre of the album
  description?: string; // Description of the album
  createdAt: any; // Timestamp when the album was created
  tags?: string[]; // Tags associated with the album
  type: 'album'; // Type is always 'album'
  artists?: Artist[]; // Array of artist objects
};
