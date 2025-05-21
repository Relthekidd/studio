
"use client";

import { Badge } from "@/components/ui/badge";
import type { ReactNode } from "react";

interface FilterChipProps {
  children: ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function FilterChip({
  children,
  isActive,
  onClick,
  className,
}: FilterChipProps) {
  return (
    <Badge
      variant={isActive ? "default" : "secondary"}
      className={`cursor-pointer hover:bg-primary/80 transition-colors text-sm py-1.5 px-3 ${isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:text-secondary-foreground'} ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick?.()}
      aria-pressed={isActive}
    >
      {children}
    </Badge>
  );
}
