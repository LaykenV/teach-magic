"use client";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface FeatureSectionProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  features: { icon: React.ReactNode; title: string; description: string }[];
  reversed?: boolean;
  isAbout?: boolean;
}

export function FeatureSection({ 
  title, 
  description, 
  imageSrc, 
  imageAlt, 
  features,
  reversed = false
}: FeatureSectionProps) {
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
    <section className="relative py-16 sm:py-20 lg:py-24">
      {/* Section-specific gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/4 to-transparent" />
      {reversed && (
        <div className="absolute inset-0 bg-gradient-to-r from-accent/4 via-transparent to-secondary/6" />
      )}
      {!reversed && (
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/4 via-transparent to-accent/6" />
      )}
      
      {/* Floating elements for this section */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {reversed ? (
          <>
            <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-accent/8 to-primary/6 rounded-full blur-2xl animate-pulse delay-400" />
            <div className="absolute bottom-20 right-20 w-56 h-56 bg-gradient-to-tr from-secondary/6 to-accent/8 rounded-full blur-2xl animate-pulse delay-900" />
          </>
        ) : (
          <>
            <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-primary/8 to-secondary/6 rounded-full blur-2xl animate-pulse delay-400" />
            <div className="absolute bottom-20 left-20 w-56 h-56 bg-gradient-to-tr from-accent/6 to-primary/8 rounded-full blur-2xl animate-pulse delay-900" />
          </>
        )}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className={`grid md:grid-cols-2 gap-12 items-center ${reversed ? 'md:grid-flow-col-dense' : ''}`}>
          <div className={`space-y-6 ${reversed ? 'md:col-start-2' : ''}`}>
            <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
              {title}
            </h3>
            <p className="text-xl text-muted-foreground leading-relaxed">{description}</p>
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <Card key={index} className="bg-background/60 backdrop-blur-md border-border/40 shadow-lg hover:shadow-xl hover:bg-background/80 transition-all duration-300 group">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="text-primary group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                      <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors duration-300">{feature.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className={`relative h-[300px] md:h-[400px] rounded-xl overflow-hidden ${reversed ? 'md:col-start-1' : ''}`}>
            {/* Enhanced image container with gradient border */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-secondary/15 to-accent/20 rounded-xl blur-sm"></div>
            <div className="relative h-full bg-background/20 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl border border-border/30">
              { theme === 'dark' ?
              <Image 
                src={imageSrc} 
                fill
                sizes="(max-width: 768px) 100vw, 50vw" 
                alt={imageAlt} 
                className="rounded-xl object-cover"
              /> :
              <Image
                src={imageSrc == '/assets/SlidesSS.png' ? '/assets/SlidesSSDark.png' : '/assets/QuizSSDark.png'}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                alt={imageAlt}              
                className="rounded-xl object-cover"
                />
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

