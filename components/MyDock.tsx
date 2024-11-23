"use client";

import React from "react";
import { Dock, DockIcon } from "@/components/ui/dock";
import { UserButton } from "@clerk/nextjs";
import { DockToggle } from "@/components/theme/DockToggle";
import { Separator } from "@/components/ui/separator";
import { Gem, Plus, Info, Pencil, DollarSign } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { RainbowButton } from "./ui/rainbow-button";
import ShinyButton from "./ui/shiny-button";

export function MyDock() {
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <Dock direction="middle" className="bg-background/80 backdrop-blur-sm border border-border rounded-full shadow-lg">
        {/* User Button */}
        <DockIcon>
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: {
                  width: 24,
                  height: 24,
                },
              },
            }}
          />
        </DockIcon>

        {/* Separator */}
        <Separator orientation="vertical" className="h-6 mx-2" />

        {/* Gem Icon linking to /pricing */}
        <DockIcon className="hover:text-primary transition-colors">
          <Link href="/pricing">
            <DollarSign className="size-6" />
          </Link>
        </DockIcon>

        {/* Plus Icon */}
        <DockIcon className="relative">
          <ShinyButton 
            onClick={() => document.getElementById('triggerButton')?.click()}
            className="rounded-full bg-secondary text-secondary-foreground transition-all duration-300 ease-in-out transform hover:scale-110 shadow-md hover:shadow-lg p-2 w-10 h-10 flex items-center justify-center"
          >
            <Pencil className="size-6" />
          </ShinyButton>
        </DockIcon>

        {/* About Us Icon linking to /about */}
        <DockIcon className="hover:text-primary transition-colors">
          <Link href="/about">
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

