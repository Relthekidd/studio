
"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { ChangeEventHandler } from "react";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  className?: string;
}

export default function SearchBar({
  placeholder = "Search songs, albums, artists...",
  value,
  onChange,
  className,
}: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pl-10 pr-4 py-2 h-12 text-base bg-card border-border focus:bg-input"
        aria-label="Search bar"
      />
    </div>
  );
}
