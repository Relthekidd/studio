export function formatArtists(input: any): string {
  if (Array.isArray(input)) {
    return input.map((a: any) => a.name || a).join(', ');
  }
  if (typeof input === 'object' && input?.name) {
    return input.name;
  }
  if (typeof input === 'string') {
    return input;
  }
  return 'Unknown Artist';
}
