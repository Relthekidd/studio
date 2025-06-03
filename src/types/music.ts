export type Artist = {
  id: string;
  name: string;
};

export type AlbumInfo = {
  id: string;
  name: string;
  coverURL: string;
};

export type Track = {
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
  coverURL?: string;
  artist?: string;
};
