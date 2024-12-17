"use client";

import React, { useEffect, useState } from 'react';
import { Creation } from '@/types/types';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CreationCard from './CreationCard';
import CreateNewDrawer from './CreateNewDrawer';
import { useSlideContext } from '@/context/SlideContext';
import { useToast } from '@/hooks/use-toast';

interface UserCreationsProps {
  filteredCreations: Creation[];
  self: boolean
  success: string | null
  setSuccess: (message: string | null) => void,
  tokens: number | null
}

export default function UserCreations({ filteredCreations, self, success, setSuccess, tokens }: UserCreationsProps) {
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const router = useRouter();
  const { userCreations, setUserCreations } = useSlideContext();
  const { toast } = useToast();

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
    <div className="container mx-auto py-8">
      {filteredCreations.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">You have no creations.</p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button asChild onClick={() => document.getElementById('triggerButton')?.click()} className='cursor-pointer'>
              <div>
                <Plus className="mr-2 h-4 w-4" />
                Create your first
              </div>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCreations.map((creation) => (
            <CreationCard
              key={creation.id}
              creation={creation}
              deleting={deletingIds.has(creation.id)}
              onDelete={deleteCreation}
              self={self}
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-center w-auto pt-20">
        <CreateNewDrawer onSuccess={handleCreationSuccess} tokens={tokens}/>
      </div>
    </div>
  );
}


