'use client';

import React from 'react';
import Link from 'next/link';
import { Track } from '@/contexts/PlayerContext';

export default function TrackInfo({ track }: { track: Track }) {
  const titleDisplay = (
    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground drop-shadow-md truncate">
      {track.title}
    </h2>
  );

  const artistsDisplay =
    track.artists?.length ? (
      track.artists.map((artist, index) => (
        <React.Fragment key={artist.id}>
          <Link href={`/artist/${artist.id}`} legacyBehavior>
            <a className="hover:text-primary hover:underline transition-colors">
              {artist.name}
            </a>
          </Link>
        </React.Fragment>
      ))
    ) : (
      <span>{track.artist || 'Unknown Artist'}</span>
    );

  return (
    <div className="text-center max-w-md">
      {track.albumId ? (
        <Link href={`/album/${track.albumId}`} legacyBehavior>
          <a className="hover:underline" title={`View album: ${track.albumName || track.title}`}>
            {titleDisplay}
          </a>
        </Link>
      ) : (
        titleDisplay
      )}

      <p className="text-base sm:text-lg md:text-xl text-muted-foreground mt-1 drop-shadow-sm truncate">
        {artistsDisplay}
      </p>

      {track.albumName && (
        <Link href={`/album/${track.albumId || track.id}`} legacyBehavior>
          <a
            className="text-sm text-muted-foreground/70 mt-0.5 hover:underline"
            title={`View album: ${track.albumName}`}
          >
            {track.albumName}
          </a>
        </Link>
      )}
    </div>
  );
}
