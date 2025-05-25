'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import type { ChangeEventHandler } from 'react';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  className?: string;
}

export default function SearchBar({
  placeholder = 'Search songs, albums, artists...',
  value,
  onChange,
  className,
}: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="h-12 border-border bg-card py-2 pl-10 pr-4 text-base focus:bg-input"
        aria-label="Search bar"
      />
    </div>
  );
}
