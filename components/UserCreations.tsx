"use client";

import React, { useState } from 'react';
import { Creation } from '@/types/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, Plus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CreationCard from './CreationCard';
import CreateNewDrawer from './CreateNewDrawer';

interface UserCreationsProps {
  userCreations: Creation[];
}

export default function UserCreations({ userCreations }: UserCreationsProps) {
  const [creations, setCreations] = useState<Creation[]>(userCreations);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const deleteCreation = async (id: string, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    event.stopPropagation();
    setError(null);
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

      setCreations((prevCreations) => prevCreations.filter((creation) => creation.id !== id));
      setSuccess('Creation deleted successfully.');
    } catch (error: any) {
      console.error('Error deleting creation:', error);
      setError(error.message || 'Failed to delete creation.');
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleCreationSuccess = (newCreationId: string) => {
    router.push(`/SlideViewer?id=${newCreationId}`);
  };

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold mb-6">My Creations</h2>

      {success && (
        <Alert variant="default" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {creations.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">You have no creations.</p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button asChild>
              <Link prefetch={true} href="/generate">
                <Plus className="mr-2 h-4 w-4" />
                Create your first
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {creations.map((creation) => (
            <CreationCard
              key={creation.id}
              creation={creation}
              deleting={deletingIds.has(creation.id)}
              onDelete={deleteCreation}
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-center w-auto pt-20">
        <CreateNewDrawer onSuccess={handleCreationSuccess} />
      </div>
    </div>
  );
}