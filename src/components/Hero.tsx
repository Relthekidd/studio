'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative flex h-[60vh] items-center justify-center overflow-hidden rounded-b-xl bg-gradient-to-br from-primary to-background text-center text-foreground">
      <Image
        src="/logo.png"
        alt="Sonix logo background"
        fill
        className="object-cover opacity-10 dark:opacity-20"
        priority
      />
      <div className="relative z-10 space-y-6 p-6">
        <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">Feel the Music</h1>
        <p className="max-w-xl text-sm text-muted-foreground md:text-base">
          Discover and share your favorite tracks with the world.
        </p>
        <Button asChild size="lg" className="mt-4">
          <Link href="#recent">Get Started</Link>
        </Button>
      </div>
    </section>
  );
}
