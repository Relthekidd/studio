
"use client";

import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserCircle, Settings, LogOut, UserCog, LogIn } from "lucide-react";

interface ProfileMenuProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

export default function ProfileMenu({ isAuthenticated, onLogout }: ProfileMenuProps) {
  // const user = { name: "Demo User", email: "demo@example.com" }; // Placeholder for user data, fetch from Firebase

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent/20 transition-colors">
          <UserCircle size={28} className="text-foreground hover:text-primary" />
          <span className="sr-only">Open user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-popover shadow-xl">
        {isAuthenticated ? (
          <>
            <DropdownMenuLabel>
              My Account
              {/* <p className="text-xs text-muted-foreground font-normal truncate">{user.email}</p> 
                 TODO: Fetch and display user email from Firebase
              */}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/account" className="flex items-center cursor-pointer hover:bg-accent/10">
                <UserCog className="mr-2 h-4 w-4 text-primary" />
                <span>Manage Account</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center cursor-pointer hover:bg-accent/10">
                <Settings className="mr-2 h-4 w-4 text-primary" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="flex items-center cursor-pointer hover:bg-accent/10 text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuLabel>Welcome</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/login" className="flex items-center cursor-pointer hover:bg-accent/10">
                <LogIn className="mr-2 h-4 w-4 text-primary" />
                <span>Login / Sign Up</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
