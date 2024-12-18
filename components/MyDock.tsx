"use client";

import React, { useEffect, useState } from "react";
import { Dock, DockIcon } from "@/components/ui/dock";
import { UserButton } from "@clerk/nextjs";
import { DockToggle } from "@/components/theme/DockToggle";
import { Separator } from "@/components/ui/separator";
import { Info, Pencil, DollarSign, Home } from "lucide-react";
import Link from "next/link";
import ShinyButton from "./ui/shiny-button";

interface MyDockProps {
  dashboard: boolean;
}

export const MyDock = ({ dashboard }: MyDockProps) => { 
  const [mounted, setMounted] = useState(false);

  // Ensures the component is only rendered on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevents rendering on the server
  }
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <Dock direction="middle" className="bg-background/80 backdrop-blur-sm border border-border rounded-full shadow-lg">
        {/* User Button */}
        <DockIcon>
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: {
                  width: 28,
                  height: 28,
                },
              },
            }}
          />
        </DockIcon>

        {/* Separator */}
        <Separator orientation="vertical" className="h-6 mx-2" />

        {/* Gem Icon linking to /pricing */}
        <DockIcon className="hover:text-primary transition-colors">
          <Link href="/pricing" prefetch>
            <DollarSign className="size-6" />
          </Link>
        </DockIcon>

        {/* Plus Icon */}
        <DockIcon className="relative">
            {dashboard ? 
            <ShinyButton
            onClick={() => document.getElementById('triggerButton')?.click()}
            className="rounded-full bg-primary transition-all duration-300 ease-in-out transform hover:scale-110 shadow-md hover:shadow-lg p-2 w-10 h-10 flex items-center justify-center"
          >
            <Pencil className="size-6 text-secondary-foreground" />
          </ShinyButton> :
          <Link href="/dashboard" prefetch>
            <ShinyButton
                className="rounded-full bg-primary transition-all duration-300 ease-in-out transform hover:scale-110 shadow-md hover:shadow-lg p-2 w-10 h-10 flex items-center justify-center"
            >
                <Home className="size-6 text-secondary-foreground" />
            </ShinyButton>
          </Link>
          }
        </DockIcon>

        {/* About Us Icon linking to /about */}
        <DockIcon className="hover:text-primary transition-colors">
          <Link href="/about" prefetch>
            <Info className="size-6" />
          </Link>
        </DockIcon>

        {/* Separator */}
        <Separator orientation="vertical" className="h-6 mx-2" />

        {/* Theme Toggle */}
        <DockIcon>
          <DockToggle />
        </DockIcon>
      </Dock>
    </div>
  );
}

