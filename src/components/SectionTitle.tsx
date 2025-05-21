import type { ReactNode } from 'react';

interface SectionTitleProps {
  children: ReactNode;
  className?: string;
}

export default function SectionTitle({ children, className = '' }: SectionTitleProps) {
  return (
    <h2 className={`text-2xl md:text-3xl font-bold text-foreground mb-4 md:mb-6 ${className}`}>
      {children}
    </h2>
  );
}
