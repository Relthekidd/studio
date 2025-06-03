export type Artist = {
  id: string;
  name: string;
};

export type Track = {
  album: any;
  id: string;
  title: string;
  audioURL: string;
  coverURL?: string;
  artists: Artist[]; // Updated to support multiple artists
  type: string; // Required so all components agree
};

// A song is represented the same as a Track in most of the app
export type Song = Track;

export type Album = {
  id: string;
  title: string;
  coverURL?: string;
  artist?: string;
};
