import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export default function DashboardCard({
  href,
  title,
  description,
  icon: Icon,
}: DashboardCardProps) {
  return (
    <Link
      href={href}
      className="rounded-lg border bg-card p-6 shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring"
    >
      <Icon className="h-6 w-6 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </Link>
  );
}
