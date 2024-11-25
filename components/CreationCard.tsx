import React, { useState } from 'react';
import { Creation } from '@/types/types';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from "@/components/ui/button";
import { CldImage } from "next-cloudinary";
import { BookOpen, Loader2, Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface CreationCardProps {
  creation: Creation;
  deleting: boolean;
  onDelete: (id: string, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const getAgeGroup = (ageGroup: string) => {
  switch (ageGroup) {
    case 'elementary':
      return 'Elementary';
    case 'middle-school':
      return 'Middle School';
    case 'high-school':
      return 'High School';
    case 'college':
      return 'College';
    default:
      return ageGroup;
  }
};

const getAgeGroupColor = (ageGroup: string) => {
  switch (ageGroup) {
    case 'elementary':
      return 'bg-green-100 text-green-800';
    case 'middle-school':
      return 'bg-blue-100 text-blue-800';
    case 'high-school':
      return 'bg-purple-100 text-purple-800';
    case 'college':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const CreationCard: React.FC<CreationCardProps> = ({ creation, deleting, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    onDelete(creation.id, e);
    setIsOpen(false);
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group">
      <Link href={`/SlideViewer?id=${creation.id}`} prefetch={true} className="block">
        <CardHeader className="p-0">
          {creation.slides[0]?.slide_image_url ? (
            <div className="relative aspect-video">
              <CldImage
                loading="eager"
                width={400}
                height={225}
                src={creation.slides[0].slide_image_url}
                alt={creation.slides[0].slide_title || 'Slide Image'}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300" />
            </div>
          ) : (
            <div className="bg-muted aspect-video flex items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-lg font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors duration-300 h-14 overflow-hidden">
            {creation.slides[0]?.slide_title || 'Untitled Creation'}
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">
              {creation.slides.length} {creation.slides.length === 1 ? 'slide' : 'slides'}
            </Badge>
            <Badge variant="secondary" className={`text-xs ${getAgeGroupColor(creation.age_group)}`}>
              {getAgeGroup(creation.age_group)}
            </Badge>
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex space-x-2">
          <Link href={`/SlideViewer?id=${creation.id}`} prefetch={true}>
            <Button variant="outline" size="icon" className="group-hover:border-primary group-hover:text-primary transition-colors duration-300">
              <BookOpen className="h-4 w-4" />
              <span className="sr-only">View slides</span>
            </Button>
          </Link>
          <Link href={`/Quiz?id=${creation.id}`}>
            <Button variant="outline" size="icon" className="group-hover:border-primary group-hover:text-primary transition-colors duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
              <span className="sr-only">Take quiz</span>
            </Button>
          </Link>
        </div>
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              className="hover:bg-destructive/90 transition-colors duration-300"
            >
              <Trash className="h-4 w-4" />
              <span className="sr-only">Delete creation</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your creation.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={(e) => handleDelete(e)} disabled={deleting}>
                {deleting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Trash className="h-4 w-4 mr-2" />
                )}
                {deleting ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default CreationCard;

