
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SectionTitle from '@/components/SectionTitle';
import AlbumCard from '@/components/AlbumCard';
import type { Track } from '@/contexts/PlayerContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, MessageCircle, Settings, EyeOff, Eye } from 'lucide-react'; // Added icons

// Mock data structures - replace with Firebase data
interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  joinDate: string;
  isPublic: boolean;
  // Relationships - simplified
  followersCount: number;
  followingCount: number;
  isCurrentUserFollowing?: boolean; // If the viewing user is following this profile
  // Content visibility (controlled by the profile owner)
  favoritesPublic: boolean;
  topStatsPublic: boolean;
}

interface UserContent {
  playlists: (Track & { type: 'playlist', description: string, dataAiHint: string })[];
  likedSongs: (Track & { type: 'track', dataAiHint: string })[];
  favoriteAlbums: (Track & { type: 'album', dataAiHint: string })[];
  topArtists: { name: string, imageUrl: string, dataAiHint: string }[];
  topSongs: (Track & { type: 'track', dataAiHint: string })[];
}

// TODO: Replace with actual Firebase data fetching logic based on `params.userId`
const mockProfiles: Record<string, UserProfile> = {
  "mockUserId123": { 
    id: "mockUserId123", 
    username: "SynthFan123", 
    displayName: "Synth Explorer",
    avatarUrl: "https://placehold.co/150x150/7D3C98/FFFFFF.png?text=SE", 
    bio: "Riding the synth waves since '83. Collector of obscure electronic gems.",
    joinDate: "2023-01-15",
    isPublic: true,
    followersCount: 125,
    followingCount: 78,
    isCurrentUserFollowing: false,
    favoritesPublic: true,
    topStatsPublic: true,
  },
  "anotherUser": { 
    id: "anotherUser", 
    username: "LoFiDreamer",
    displayName: "Lo-Fi Dreamer",
    avatarUrl: "https://placehold.co/150x150/1ABC9C/FFFFFF.png?text=LD",
    bio: "Just chillin' with some beats. Always looking for new study vibes.",
    joinDate: "2024-03-10",
    isPublic: false, // Private profile example
    followersCount: 42,
    followingCount: 60,
    isCurrentUserFollowing: true, // Example if current user follows
    favoritesPublic: false, // Example of private section
    topStatsPublic: true,
  }
};

const mockUserContent: Record<string, UserContent> = {
  "mockUserId123": {
    playlists: [
      { id: 'pl1', title: 'Neon Nights Drive', description: 'Synthwave for late night drives', imageUrl: 'https://placehold.co/300x300/BE52FF/222222.png?text=NND', type: 'playlist', dataAiHint: 'neon city car' },
      { id: 'pl2', title: 'Retro Revival Mix', description: '80s inspired electronic', imageUrl: 'https://placehold.co/300x300/39FF14/222222.png?text=RRM', type: 'playlist', dataAiHint: 'vintage arcade' },
    ],
    likedSongs: [
      { id: 's1', title: 'Midnight City', artist: 'M83', imageUrl: 'https://placehold.co/300x300/FF69B4/222222.png?text=MC', type: 'track', dataAiHint: 'city night lights' },
    ],
    favoriteAlbums: [
       { id: 'fa1', title: 'Discovery', artist: 'Daft Punk', imageUrl: 'https://placehold.co/300x300/00FFFF/222222.png?text=DPD', type: 'album', dataAiHint: 'robotic helmets' },
    ],
    topArtists: [
      { name: 'Kavinsky', imageUrl: 'https://placehold.co/100x100/FFD700/222222.png?text=KV', dataAiHint: 'sunglasses dark' },
      { name: 'Com Truise', imageUrl: 'https://placehold.co/100x100/FF4500/222222.png?text=CT', dataAiHint: 'abstract geometric' },
    ],
    topSongs: [
      { id: 'ts1', title: 'Nightcall', artist: 'Kavinsky', imageUrl: 'https://placehold.co/300x300/9370DB/222222.png?text=NC', type: 'track', dataAiHint: 'car night' },
    ]
  },
  "anotherUser": { // Content for private profile - might not be shown based on privacy
    playlists: [{ id: 'pl3', title: 'Study Beats', description: 'Lo-fi hip hop for focus', imageUrl: 'https://placehold.co/300x300/FFC300/222222.png?text=SB', type: 'playlist', dataAiHint: 'desk lamp books' }],
    likedSongs: [], favoriteAlbums:[], topArtists: [], topSongs: []
  }
};


export default function UserProfilePage() {
  const params = useParams();
  const userId = params.userId as string;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [content, setContent] = useState<UserContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // TODO: Determine if current logged-in user is viewing their own profile
  const isOwnProfile = userId === "mockUserId123"; // Replace with actual check

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const foundProfile = mockProfiles[userId];
      const foundContent = mockUserContent[userId];
      if (foundProfile) {
        setProfile(foundProfile);
        // For a private profile not owned by current user, content might be restricted by backend
        // Here, we show it if public, or if it's own profile, or if current user is following (mocked logic)
        if (foundProfile.isPublic || isOwnProfile /* || checkFollowStatus() */) {
          setContent(foundContent || { playlists: [], likedSongs: [], favoriteAlbums: [], topArtists: [], topSongs: [] });
        } else {
          setContent(null); // Not authorized to see content
        }
      } else {
        // TODO: Handle profile not found (e.g., redirect to 404 or show message)
        console.error("Profile not found for ID:", userId);
      }
      setIsLoading(false);
    }, 500);
  }, [userId, isOwnProfile]);

  // TODO: Implement follow/unfollow logic with Firebase
  const handleFollowToggle = () => {
    if (!profile) return;
    console.log(profile.isCurrentUserFollowing ? "Unfollowing" : "Following", profile.username);
    // Update mock state for UI
    setProfile(p => p ? {...p, isCurrentUserFollowing: !p.isCurrentUserFollowing, followersCount: p.isCurrentUserFollowing ? p.followersCount -1 : p.followersCount + 1 } : null);
  };

  if (isLoading) {
    return <div className="container mx-auto p-6 text-center">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="container mx-auto p-6 text-center">User profile not found.</div>;
  }

  const canViewContent = profile.isPublic || isOwnProfile /* || checkFollowStatus() */;
  const canViewFavorites = canViewContent && (profile.favoritesPublic || isOwnProfile);
  const canViewTopStats = canViewContent && (profile.topStatsPublic || isOwnProfile);


  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Profile Header */}
      <Card className="overflow-hidden">
        <div className="relative h-32 md:h-48 bg-gradient-to-r from-primary/30 to-accent/30">
          {/* Placeholder for a banner image */}
          <Image src="https://placehold.co/1200x300/262626/1A1A1A.png?text=" alt="Profile banner" layout="fill" objectFit="cover" data-ai-hint="abstract banner" unoptimized />
        </div>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12 sm:-mt-16 relative z-10">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-lg">
              <AvatarImage src={profile.avatarUrl} alt={profile.displayName} data-ai-hint="user avatar large" />
              <AvatarFallback>{profile.displayName?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{profile.displayName}</h1>
              <p className="text-sm text-muted-foreground">@{profile.username}</p>
              <p className="text-sm text-muted-foreground mt-0.5">Joined: {new Date(profile.joinDate).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2 mt-2 sm:mt-0">
              {isOwnProfile ? (
                <Button variant="outline" asChild>
                  <Link href="/account"><Settings size={16} className="mr-2" /> Edit Profile</Link>
                </Button>
              ) : (
                <>
                  <Button variant={profile.isCurrentUserFollowing ? "secondary" : "default"} onClick={handleFollowToggle}>
                    <UserPlus size={16} className="mr-2" /> {profile.isCurrentUserFollowing ? "Following" : "Follow"}
                  </Button>
                  <Button variant="outline"><MessageCircle size={16} className="mr-2" /> Message</Button>
                </>
              )}
            </div>
          </div>
          <p className="mt-4 text-sm text-foreground max-w-2xl">{profile.bio}</p>
          <div className="mt-3 flex gap-4 text-sm text-muted-foreground">
            <span><strong className="text-foreground">{profile.followersCount}</strong> Followers</span>
            <span><strong className="text-foreground">{profile.followingCount}</strong> Following</span>
          </div>
        </CardContent>
      </Card>

      {!canViewContent && !isOwnProfile && (
         <Card className="text-center p-8">
            <EyeOff size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-semibold">This profile is private.</p>
            <p className="text-muted-foreground">Follow {profile.displayName} to see their activity.</p>
            {/* TODO: Add request to follow button if not already requested */}
         </Card>
      )}

      {canViewContent && content && (
        <Tabs defaultValue="playlists" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mb-6 bg-card border border-border">
            <TabsTrigger value="playlists">Playlists</TabsTrigger>
            <TabsTrigger value="liked">Liked Songs</TabsTrigger>
            <TabsTrigger value="albums">Favorite Albums</TabsTrigger>
            {canViewTopStats && <TabsTrigger value="top-artists">Top Artists</TabsTrigger>}
            {canViewTopStats && <TabsTrigger value="top-songs">Top Songs</TabsTrigger>}
          </TabsList>

          <TabsContent value="playlists">
            <SectionTitle className="text-xl sr-only">Playlists</SectionTitle>
            {content.playlists.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {content.playlists.map(item => <AlbumCard key={item.id} item={item} />)}
              </div>
            ) : <p className="text-muted-foreground text-center py-4">No public playlists yet.</p>}
          </TabsContent>

          <TabsContent value="liked">
             <SectionTitle className="text-xl sr-only">Liked Songs</SectionTitle>
             {canViewFavorites ? (
                content.likedSongs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {content.likedSongs.map(item => <AlbumCard key={item.id} item={item} />)}
                </div>
                ) : <p className="text-muted-foreground text-center py-4">No publicly liked songs.</p>
             ) : <p className="flex items-center justify-center text-muted-foreground text-center py-4"><EyeOff size={18} className="mr-2"/>Liked songs are private.</p>}
          </TabsContent>

          <TabsContent value="albums">
            <SectionTitle className="text-xl sr-only">Favorite Albums</SectionTitle>
            {canViewFavorites ? (
                content.favoriteAlbums.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {content.favoriteAlbums.map(item => <AlbumCard key={item.id} item={item} />)}
                </div>
                ) : <p className="text-muted-foreground text-center py-4">No publicly favorited albums.</p>
             ) : <p className="flex items-center justify-center text-muted-foreground text-center py-4"><EyeOff size={18} className="mr-2"/>Favorite albums are private.</p>}
          </TabsContent>
          
          {canViewTopStats && (
            <>
            <TabsContent value="top-artists">
                <SectionTitle className="text-xl sr-only">Top Artists</SectionTitle>
                {content.topArtists.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {content.topArtists.map(artist => (
                    <Card key={artist.name} className="text-center">
                        <CardContent className="p-4 flex flex-col items-center gap-2">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={artist.imageUrl} alt={artist.name} data-ai-hint={artist.dataAiHint} />
                            <AvatarFallback>{artist.name[0]}</AvatarFallback>
                        </Avatar>
                        <p className="font-medium text-sm">{artist.name}</p>
                        </CardContent>
                    </Card>
                    ))}
                </div>
                ) : <p className="text-muted-foreground text-center py-4">Not enough listening data for Top Artists.</p>}
            </TabsContent>

            <TabsContent value="top-songs">
                <SectionTitle className="text-xl sr-only">Top Songs</SectionTitle>
                {content.topSongs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {content.topSongs.map(item => <AlbumCard key={item.id} item={item} />)}
                </div>
                ) : <p className="text-muted-foreground text-center py-4">Not enough listening data for Top Songs.</p>}
            </TabsContent>
            </>
          )}
        </Tabs>
      )}
    </div>
  );
}
