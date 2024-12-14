"use client";

import { SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function HeroSection() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

    // Ensures the component is only rendered on the client
    useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) {
      return null; // Prevents rendering on the server
    }

  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-center md:text-left">
          <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Create Teaching Content in Minutes, Not Hours
          </h2>
          <p className="text-xl text-muted-foreground">
            TeachMagic uses AI to generate comprehensive slides and quizzes on any topic, revolutionizing how you create educational content.
          </p>
          <div>
            <SignUpButton mode="modal">
              <Button size="lg" className="text-white">Start Creating for Free</Button>
            </SignUpButton>
          </div>
        </div>
        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-xl">
        { theme === 'dark' ? 
          <Image 
            src="/assets/DashboardSS.png" 
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            alt="TeachMagic platform preview" 
            className="rounded-xl object-cover"
          />
          :
          <Image
            src="/assets/DashboardSSDark.png"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            alt="TeachMagic platform preview" 
            className="rounded-xl object-cover"
          />
          }
        </div>
      </div>
    </section>
  );
}

