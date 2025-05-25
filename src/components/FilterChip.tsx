'use client';

import { Badge } from '@/components/ui/badge';
import type { ReactNode } from 'react';

interface FilterChipProps {
  children: ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function FilterChip({ children, isActive, onClick, className }: FilterChipProps) {
  return (
    <Badge
      variant={isActive ? 'default' : 'secondary'}
      className={`cursor-pointer px-3 py-1.5 text-sm transition-colors hover:bg-primary/80 ${isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:text-secondary-foreground'} ${className}`}
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
