
"use client";

import { useState } from 'react';
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
import { UserCircle, Settings, LogOut, UserCog, LogIn } from "lucide-react"; // Added UserCog, LogIn

// TODO: Replace with actual authentication state from Firebase
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Simulate auth state
  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);
  return { isAuthenticated, login, logout };
};

export default function ProfileMenu() {
  const { isAuthenticated, logout } = useAuth();
  // const user = { name: "Demo User", email: "demo@example.com" }; // Placeholder for user data

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <UserCircle size={24} className="text-foreground" />
          <span className="sr-only">Open user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {isAuthenticated ? (
          <>
            <DropdownMenuLabel>
              My Account
              {/* <p className="text-xs text-muted-foreground font-normal truncate">{user.email}</p> */}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/account" className="flex items-center">
                <UserCog className="mr-2 h-4 w-4" />
                <span>Manage Account</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="flex items-center cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuLabel>Welcome</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/login" className="flex items-center">
                <LogIn className="mr-2 h-4 w-4" />
                <span>Login / Sign Up</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
