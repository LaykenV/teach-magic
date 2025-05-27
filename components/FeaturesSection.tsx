'use client';

import { useState, useRef, useEffect } from "react";
import { FeatureCard } from "@/components/FeatureCard";
import { cn } from "@/lib/utils";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeaturesSectionProps {
  features: Feature[];
}

export function FeaturesSection({ features }: FeaturesSectionProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = 280 + 24; // card width + gap
      const scrollLeft = container.scrollLeft;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setSelectedIndex(newIndex);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <section className="relative">
      {/* Section-specific gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/8 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/6 via-transparent to-accent/6" />
      
      {/* Enhanced floating elements for this section */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 right-16 w-80 h-80 bg-gradient-to-br from-secondary/10 to-primary/8 rounded-full blur-3xl animate-pulse delay-300" />
        <div className="absolute bottom-16 left-16 w-96 h-96 bg-gradient-to-tr from-accent/8 to-secondary/10 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-primary/6 to-accent/8 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      
      <div className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Revolutionize Your{" "}
              <span className="bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
                Teaching
              </span>
            </h3>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover powerful AI-driven features that transform how you create and deliver educational content, 
              making lesson preparation faster and more engaging than ever before.
            </p>
          </div>
          
          {/* Mobile: Scrollable horizontal card container */}
          <div 
            ref={scrollContainerRef}
            className="lg:hidden flex overflow-x-auto space-x-6 pb-6 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide"
            onScroll={handleScroll}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={cn(
                  "min-w-[280px] w-[85vw] max-w-[360px] snap-center flex-shrink-0"
                )}
              >
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>

          {/* Mobile Scroll Indicators */}
          {features.length > 1 && (
            <div className="lg:hidden flex justify-center mt-8">
              <div className="flex space-x-2 bg-background/50 backdrop-blur-sm px-3 py-2 rounded-full border border-border/30">
                {features.map((_, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      "transition-all duration-300 rounded-full",
                      selectedIndex === index 
                        ? "w-8 h-2 bg-gradient-to-r from-primary to-secondary" 
                        : "w-2 h-2 bg-primary/40"
                    )}
                  ></div>
                ))}
              </div>
            </div>
          )}

          {/* Desktop: Grid layout */}
          <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="transform transition-all duration-300 hover:scale-[1.02]">
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 