'use client';

import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { UserCircle, Settings, LogOut, UserCog, LogIn, User as UserIcon } from 'lucide-react'; // Added UserIcon

interface ProfileMenuProps {
  isAuthenticated: boolean;
  onLogout: () => void;
  userId?: string; // To link to the current user's profile
}

export default function ProfileMenu({ isAuthenticated, onLogout, userId }: ProfileMenuProps) {
  // const user = { name: "Demo User", email: "demo@example.com" }; // Placeholder

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full transition-colors hover:bg-accent/20"
        >
          {/* TODO: Replace with actual user avatar if available, else fallback to icon */}
          <UserCircle size={28} className="text-foreground hover:text-primary" />
          <span className="sr-only">Open user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-popover shadow-xl">
        {isAuthenticated ? (
          <>
            <DropdownMenuLabel>
              My Account
              {/* <p className="text-xs text-muted-foreground font-normal truncate">{user.email}</p> */}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {userId && (
              <DropdownMenuItem asChild>
                <Link
                  href={`/profile/${userId}`}
                  className="flex cursor-pointer items-center hover:bg-accent/10"
                >
                  <UserIcon className="mr-2 size-4 text-primary" />
                  <span>My Profile</span>
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <Link href="/account" className="flex cursor-pointer items-center hover:bg-accent/10">
                <UserCog className="mr-2 size-4 text-primary" />
                <span>Account Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/settings"
                className="flex cursor-pointer items-center hover:bg-accent/10"
              >
                <Settings className="mr-2 size-4 text-primary" />
                <span>App Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onLogout}
              className="flex cursor-pointer items-center text-destructive hover:bg-accent/10"
            >
              <LogOut className="mr-2 size-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuLabel>Welcome</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/login" className="flex cursor-pointer items-center hover:bg-accent/10">
                <LogIn className="mr-2 size-4 text-primary" />
                <span>Login / Sign Up</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
