export function formatArtists(artists: { name: string }[]): string {
  if (!artists || artists.length === 0) return 'Unknown Artist';

  if (artists.length === 1) {
    return artists[0].name;
  }

  if (artists.length === 2) {
    return `${artists[0].name} & ${artists[1].name}`;
  }

  return `${artists[0].name}, ${artists[1].name}, +${artists.length - 2}`;
}
