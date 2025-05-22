import type { ReactNode } from 'react';

interface SectionTitleProps {
  children: ReactNode;
  className?: string;
  id?: string; // ✅ added for anchor scrolling or navigation
}

export default function SectionTitle({ children, className = '', id }: SectionTitleProps) {
  return (
    <h2
      id={id}
      className={`text-2xl md:text-3xl font-bold text-foreground mb-4 md:mb-6 ${className}`}
    >
      {children}
    </h2>
  );
}
