'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Track } from '@/types/music';
import { formatArtists } from '@/utils/formatArtists';

export default function TrackInfo({ track }: { track: Track }) {
  return (
    <div className="text-center">
      <h2 className="text-lg font-bold">{track.title}</h2>
      <p className="text-sm text-muted-foreground">{formatArtists(track.artists)}</p>
    </div>
  );
}

export function AlbumCard({ item, className }: { item: Track; className?: string }) {
  const href =
    item.type === 'album'
      ? `/album/${item.id}`
      : item.type === 'single'
        ? `/single/${item.id}`
        : null; // Use null if type is invalid

  const handleClick = () => {
    if (!href) {
      console.error('Invalid item type or ID:', item);
      return;
    }
    // Perform navigation or other actions here
    window.location.href = href; // Fallback navigation if needed
  };

  return href ? (
    <Link
      href={href}
      className={`group relative block rounded-xl bg-card/70 transition-all hover:bg-card/90 ${className || 'w-full'}`}
      aria-label={`View details for ${item.title}`}
    >
      <div className="relative aspect-square">
        <Image
          src={item.coverURL || '/placeholder.png'}
          alt={item.title}
          width={500}
          height={500}
          className="size-full rounded-t-xl object-cover"
        />
      </div>
      <div className="p-3">
        <h3 className="truncate text-sm font-semibold">{item.title}</h3>
        <p className="truncate text-xs text-muted-foreground">
          {Array.isArray(item.artists)
            ? item.artists.map((artist: { id: string; name: string }, idx: number) => (
                <span key={artist.id}>
                  {artist.name}
                  {idx < item.artists.length - 1 ? ', ' : ''}
                </span>
              ))
            : item.artists || 'Unknown Artist'}
        </p>
      </div>
    </Link>
  ) : (
    <button
      className={`group relative block rounded-xl bg-card/70 transition-all hover:bg-card/90 ${className || 'w-full'}`}
      onClick={handleClick}
      aria-label={`View details for ${item.title}`}
    >
      <div className="relative aspect-square">
        <Image
          src={item.coverURL || '/placeholder.png'}
          alt={item.title}
          width={500}
          height={500}
          className="size-full rounded-t-xl object-cover"
        />
      </div>
      <div className="p-3">
        <h3 className="truncate text-sm font-semibold">{item.title}</h3>
        <p className="truncate text-xs text-muted-foreground">
          {Array.isArray(item.artists)
            ? item.artists.map((artist: { id: string; name: string }, idx: number) => (
                <span key={artist.id}>
                  {artist.name}
                  {idx < item.artists.length - 1 ? ', ' : ''}
                </span>
              ))
            : item.artists || 'Unknown Artist'}
        </p>
      </div>
    </button>
  );
}

{
  /* 
<button
  className="text-center"
  onClick={() => console.log('Track clicked')}
  aria-label="View details"
>
  ...
</button>
*/
}
