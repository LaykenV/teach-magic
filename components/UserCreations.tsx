"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Creation } from '@/types/types';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CreationCard from './CreationCard';
import CreateNewDrawer from './CreateNewDrawer';
import { useSlideContext } from '@/context/SlideContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface UserCreationsProps {
  filteredCreations: Creation[];
  self: boolean
  success: string | null
  setSuccess: (message: string | null) => void,
  tokens: number | null
}

export default function UserCreations({ filteredCreations, self, success, setSuccess, tokens }: UserCreationsProps) {
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { userCreations, setUserCreations } = useSlideContext();
  const { toast } = useToast();

  // Handle mobile scroll indicators
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = 320 + 24; // card width + gap
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

  useEffect(() => {
    if (success) {
      toast({
        title: "Success",
        description: success,
        duration: 5000,
      });
      setSuccess(null);
    }
  }, [success, setSuccess, toast]);

  const deleteCreation = async (id: string, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    event.stopPropagation();
    setSuccess(null);

    setDeletingIds((prev) => new Set(prev).add(id));

    try {
      const response = await fetch(`/api/deleteCreation?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API error: ${response.statusText}`);
      }

      const updatedCreations = userCreations.filter((creation) => creation.id !== id);
      setUserCreations(updatedCreations);

      console.log('deleted');
      toast({
        title: "Success",
        description: "Creation deleted successfully.",
        duration: 5000,
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error deleting creation:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to delete creation.',
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleCreationSuccess = (newCreation: Creation) => {
    const c = [...userCreations];
    c.push(newCreation);
    setUserCreations(c);
    router.push(`/SlideViewer?id=${newCreation.id}`);
  };

  return (
    <div className="relative">
      {filteredCreations.length === 0 ? (
        <Card className="bg-card/60 backdrop-blur-sm border border-border/30 shadow-lg">
          <CardContent className="pt-8 pb-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">No creations yet</h3>
                <p className="text-muted-foreground">Start your learning journey by creating your first module.</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-center pb-8">
            <Button 
              onClick={() => document.getElementById('triggerButton')?.click()} 
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-lg hover:shadow-xl px-8 py-2 text-white font-medium"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create your first
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <>
          {/* Mobile: Horizontal scrolling layout */}
          <div 
            ref={scrollContainerRef}
            className="lg:hidden flex overflow-x-auto space-x-6 pb-6 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide"
            onScroll={handleScroll}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {filteredCreations.map((creation) => (
              <div 
                key={creation.id} 
                className={cn(
                  "min-w-[320px] w-[85vw] max-w-[380px] snap-center flex-shrink-0"
                )}
              >
                <CreationCard
                  creation={creation}
                  deleting={deletingIds.has(creation.id)}
                  onDelete={deleteCreation}
                  self={self}
                />
              </div>
            ))}
          </div>

          {/* Mobile Scroll Indicators */}
          {filteredCreations.length > 1 && (
            <div className="lg:hidden flex justify-center mt-6 mb-8">
              <div className="flex space-x-2 bg-background/60 backdrop-blur-sm px-4 py-2 rounded-full border border-border/30 shadow-lg">
                {filteredCreations.map((_, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      "transition-all duration-300 rounded-full cursor-pointer",
                      selectedIndex === index 
                        ? "w-8 h-2 bg-gradient-to-r from-primary to-secondary" 
                        : "w-2 h-2 bg-primary/40 hover:bg-primary/60"
                    )}
                    onClick={() => {
                      if (scrollContainerRef.current) {
                        const cardWidth = 320 + 24;
                        scrollContainerRef.current.scrollTo({
                          left: index * cardWidth,
                          behavior: 'smooth'
                        });
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Desktop: Grid layout */}
          <div className="hidden lg:grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 lg:gap-8">
            {filteredCreations.map((creation) => (
              <div key={creation.id}>
                <CreationCard
                  creation={creation}
                  deleting={deletingIds.has(creation.id)}
                  onDelete={deleteCreation}
                  self={self}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Create New Button - Enhanced styling */}
      <div className="flex items-center justify-center w-full pt-12 sm:pt-16 lg:pt-20">
        <CreateNewDrawer onSuccess={handleCreationSuccess} tokens={tokens}/>
      </div>
    </div>
  );
}


