import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Download, Layers, Zap, FileSearch, PenTool } from 'lucide-react';

interface FeatureSectionProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  features: { icon: React.ReactNode; title: string; description: string }[];
  reversed?: boolean;
}

export function FeatureSection({ 
  title, 
  description, 
  imageSrc, 
  imageAlt, 
  features,
  reversed = false
}: FeatureSectionProps) {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className={`grid md:grid-cols-2 gap-12 items-center ${reversed ? 'md:grid-flow-col-dense' : ''}`}>
          <div className={`space-y-6 text-center md:text-left ${reversed ? 'md:col-start-2' : ''}`}>
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
            <Image 
              src={imageSrc} 
              layout="fill" 
              objectFit="cover" 
              alt={imageAlt} 
              className="rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

