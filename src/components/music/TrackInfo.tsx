'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Track } from '@/contexts/PlayerContext';
import { formatArtists } from '@/utils/formatArtists';

export default function TrackInfo({ track }: { track: Track }) {
  return (
    <div className="text-center">
      <h2 className="text-lg font-bold">{track.title}</h2>
      <p className="text-sm text-muted-foreground">{formatArtists(track.artist)}</p>
    </div>
  );
}

export function AlbumCard({ item, className }: { item: Track; className?: string }) {
  const href =
    item.type === 'album'
      ? `/album/${item.id}`
      : item.type === 'single'
        ? `/single/${item.id}`
        : '#'; // Fallback to '#' if type is invalid

  return (
    <Link href={href} legacyBehavior>
      <a
        className={`group relative block rounded-xl bg-card/70 transition-all hover:bg-card/90 ${className || 'w-full'}`}
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
            {Array.isArray(item.artist)
              ? item.artist.map((artist: { id: string; name: string }, idx: number) => (
                  <span key={artist.id}>
                    {artist.name}
                    {idx < item.artist.length - 1 ? ', ' : ''}
                  </span>
                ))
              : item.artist || 'Unknown Artist'}
          </p>
        </div>
      </a>
    </Link>
  );
}
