import React from 'react';
import { Track } from '@/contexts/PlayerContext';
import { AlbumCard as TrackCard } from '@/components/AlbumCard'; // or however you're displaying each track

interface SectionProps {
  title: string;
  items: Track[];
}

const Section: React.FC<SectionProps> = ({ title, items }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map((track) => (
          <TrackCard key={track.id} item={track} />
        ))}
      </div>
    </div>
  );
};

export default Section;
