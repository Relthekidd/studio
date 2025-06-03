export type Track = {
  id: string;
  title: string;
  artist: string;
  audioURL: string;
  coverURL?: string;
  type: string; // required so all components agree
};
