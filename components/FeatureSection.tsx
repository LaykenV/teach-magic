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
  reversed = false,
  isAbout
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
    <section className={`py-16 ${isAbout ? '' : 'bg-gray-50 dark:bg-gray-900'} text-center md:text-left`}>
      <div className="container mx-auto px-4">
        <div className={`grid md:grid-cols-2 gap-12 items-center ${reversed ? 'md:grid-flow-col-dense' : ''}`}>
          <div className={`space-y-6 ${reversed ? 'md:col-start-2' : ''}`}>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{title}</h3>
            <p className="text-xl text-gray-700 dark:text-gray-300">{description}</p>
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <Card key={index} className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="text-primary">{feature.icon}</div>
                      <h4 className="font-semibold text-sm">{feature.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className={`relative h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-xl ${reversed ? 'md:col-start-1' : ''}`}>
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
    </section>
  );
}

