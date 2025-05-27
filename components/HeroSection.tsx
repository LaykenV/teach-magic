"use client";

import { SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles, Zap, Users } from "lucide-react";

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
    <section className="relative">
      {/* Subtle section-specific gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      
      {/* Additional floating elements for this section */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-primary/8 to-secondary/6 rounded-full blur-2xl animate-pulse delay-200" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-to-tr from-accent/6 to-primary/8 rounded-full blur-2xl animate-pulse delay-800" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content Section */}
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-primary/15 backdrop-blur-sm text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20 shadow-lg">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Education</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Create Teaching Content in{" "}
                <span className="bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
                  Minutes
                </span>
                , Not Hours
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                TeachMagic uses AI to generate comprehensive slides and quizzes on any topic, 
                revolutionizing how you create educational content.
              </p>
            </div>

            {/* Stats */}
            <div className="flex justify-center lg:justify-start">
              <div className="flex items-center space-x-2 bg-background/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/30">
                <div className="w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse" />
                <span className="text-muted-foreground text-sm font-medium">Any Topic, Any Level</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center lg:justify-start">
              <SignUpButton mode="modal">
                <Button 
                  size="lg" 
                  className="group bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-xl hover:shadow-2xl transition-all duration-300 text-base px-8 py-3 border border-primary/20"
                >
                  Start Creating for Free
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </SignUpButton>
            </div>

            {/* Trust indicators */}
            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-3">Trusted by educators worldwide</p>
              <div className="flex items-center justify-center lg:justify-start space-x-4 opacity-70">
                <div className="flex items-center space-x-1 bg-background/30 backdrop-blur-sm px-2 py-1 rounded-md">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">K-12 Schools</span>
                </div>
                <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                <div className="flex items-center space-x-1 bg-background/30 backdrop-blur-sm px-2 py-1 rounded-md">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Universities</span>
                </div>
                <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                <div className="flex items-center space-x-1 bg-background/30 backdrop-blur-sm px-2 py-1 rounded-md">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Training Centers</span>
                </div>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              {/* Enhanced decorative elements */}
              <div className="absolute -inset-6 bg-gradient-to-r from-primary/15 via-secondary/10 to-accent/15 rounded-3xl blur-2xl opacity-60" />
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-xl opacity-40" />
              
              {/* Main image container */}
              <div className="relative bg-background/60 backdrop-blur-md rounded-2xl p-3 shadow-2xl border border-border/40">
                <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
                  {theme === 'dark' ? 
                    <Image 
                      src="/assets/DashboardSS.png" 
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      alt="TeachMagic platform preview" 
                      className="rounded-xl object-cover"
                      priority
                    />
                    :
                    <Image
                      src="/assets/DashboardSSDark.png"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      alt="TeachMagic platform preview" 
                      className="rounded-xl object-cover"
                      priority
                    />
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

