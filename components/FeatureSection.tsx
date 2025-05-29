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
    <section className="relative py-16 sm:py-20 lg:py-28 overflow-hidden">
      {/* Enhanced background gradients */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-50/30 to-transparent dark:via-purple-950/20" />
        {reversed ? (
          <div className="absolute inset-0 bg-gradient-to-r from-pink-50/40 via-transparent to-blue-50/40 dark:from-pink-950/20 dark:via-transparent dark:to-blue-950/20" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/40 via-transparent to-pink-50/40 dark:from-blue-950/20 dark:via-transparent dark:to-pink-950/20" />
        )}
      </div>
      
      {/* Enhanced floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {reversed ? (
          <>
            <div className="absolute top-16 sm:top-20 left-8 sm:left-20 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-br from-pink-400/15 to-purple-400/15 dark:from-pink-500/8 dark:to-purple-500/8 rounded-full blur-3xl animate-pulse delay-300" />
            <div className="absolute bottom-16 sm:bottom-20 right-8 sm:right-20 w-40 sm:w-56 h-40 sm:h-56 bg-gradient-to-tr from-blue-400/15 to-indigo-400/15 dark:from-blue-500/8 dark:to-indigo-500/8 rounded-full blur-3xl animate-pulse delay-700" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-purple-300/10 to-pink-300/10 dark:from-purple-500/5 dark:to-pink-500/5 rounded-full blur-2xl animate-pulse delay-1000" />
          </>
        ) : (
          <>
            <div className="absolute top-16 sm:top-20 right-8 sm:right-20 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-br from-blue-400/15 to-indigo-400/15 dark:from-blue-500/8 dark:to-indigo-500/8 rounded-full blur-3xl animate-pulse delay-300" />
            <div className="absolute bottom-16 sm:bottom-20 left-8 sm:left-20 w-40 sm:w-56 h-40 sm:h-56 bg-gradient-to-tr from-purple-400/15 to-pink-400/15 dark:from-purple-500/8 dark:to-pink-500/8 rounded-full blur-3xl animate-pulse delay-700" />
            <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-gradient-to-br from-indigo-300/10 to-blue-300/10 dark:from-indigo-500/5 dark:to-blue-500/5 rounded-full blur-2xl animate-pulse delay-1000" />
          </>
        )}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center ${reversed ? 'lg:grid-flow-col-dense' : ''}`}>
          {/* Content Section */}
          <div className={`space-y-6 sm:space-y-8 ${reversed ? 'lg:col-start-2' : ''}`}>
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent leading-tight">
                {title}
              </h3>
              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-xl">
                {description}
              </p>
            </div>
            
            {/* Enhanced feature grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-white/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-start space-x-3 mb-3">
                      <div className="text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300 flex-shrink-0 mt-0.5">
                        {feature.icon}
                      </div>
                      <h4 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300 leading-tight">
                        {feature.title}
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300 ml-8">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Image Section */}
          <div className={`relative ${reversed ? 'lg:col-start-1' : ''} order-first lg:order-none`}>
            <div className="relative h-[250px] sm:h-[350px] lg:h-[450px] xl:h-[500px] rounded-2xl overflow-hidden group">
              {/* Enhanced gradient border effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 dark:from-indigo-400/20 dark:via-purple-400/20 dark:to-pink-400/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
              
              {/* Main image container */}
              <div className="relative h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-white/60 dark:border-gray-700/60 group-hover:scale-[1.02] transition-all duration-500">
                {/* Image with theme-aware display */}
                { theme === 'dark' ?
                <Image 
                  src={imageSrc} 
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw" 
                  alt={imageAlt} 
                  className="rounded-2xl object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                /> :
                <Image
                  src={imageSrc == '/assets/SlidesSS.png' ? '/assets/SlidesSSDark.png' : '/assets/QuizSSDark.png'}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                  alt={imageAlt}              
                  className="rounded-2xl object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                  />
                }
                
                {/* Overlay gradient for better text readability if needed */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent dark:from-black/20 pointer-events-none" />
              </div>
              
              {/* Floating accent elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full blur-sm opacity-60 animate-pulse delay-500" />
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-pink-400 to-indigo-400 rounded-full blur-sm opacity-60 animate-pulse delay-800" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

