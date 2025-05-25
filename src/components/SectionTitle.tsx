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
      className={`mb-4 text-2xl font-bold text-foreground md:mb-6 md:text-3xl ${className}`}
    >
      {children}
    </h2>
  );
}
