/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Creation } from '@/types/types';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from "@/components/ui/button";
import { CldImage } from "next-cloudinary";
import { BookOpen, Loader2, Trash, Download, FileDown } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from '@/hooks/use-toast';
import { createPptx } from '@/utils/createPowerpoint';
import { exportQuizPdf } from '@/utils/exportQuizPdf';

interface CreationCardProps {
  creation: Creation;
  deleting: boolean;
  onDelete: (id: string, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  self: boolean
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
      return 'bg-green-800 hover:bg-green-800';
    case 'middle-school':
      return 'bg-blue-800 hover:bg-blue-800';
    case 'high-school':
      return 'bg-yellow-800 hover:bg-yellow-800';
    case 'college':
      return 'bg-red-800 hover:bg-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const CreationCard: React.FC<CreationCardProps> = ({ creation, deleting, onDelete, self }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    onDelete(creation.id, e);
    setIsOpen(false);
  };

  const handleExportPptx = async () => {
    try {
      await createPptx(creation.slides);
      toast({
        title: "Success",
        description: "Slides exported to PowerPoint successfully.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export slides to PowerPoint.",
        variant: "destructive",
      });
    }
  };

  const handleExportPdf = async () => {
    try {
      await exportQuizPdf(creation);
      toast({
        title: "Success",
        description: "Quiz exported to PDF successfully.",
        variant: "default",
      });
    } catch (error) {
      console.log(error)
      toast({
        title: "Error",
        description: "Failed to export quiz to PDF.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="overflow-hidden bg-card/70 backdrop-blur-sm border border-border/40 transition-all duration-300 shadow-lg text-card-foreground relative">
      <Link href={`/SlideViewer?id=${creation.id}`} prefetch={true} className="block relative z-10">
        <CardHeader className="p-0">
          {creation.slides[0]?.slide_image_url ? (
            <div className="relative aspect-video overflow-hidden">
              <CldImage
                priority
                loading="eager"
                width={400}
                height={225}
                src={creation.slides[0].slide_image_url}
                alt={creation.slides[0].slide_title || 'Slide Image'}
                className="object-cover w-full h-full"
              />
            </div>
          ) : (
            <div className="bg-gradient-to-br from-muted/50 to-muted aspect-video flex items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-4 sm:p-5">
          <CardTitle className="text-lg font-semibold line-clamp-2 mb-3 h-14 overflow-hidden">
            {creation.slides[0]?.slide_title || 'Untitled Creation'}
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="default" className="text-xs text-white bg-gradient-to-r from-primary to-primary/90 shadow-sm">
              6 Slides
            </Badge>
            <Badge variant="default" className={`text-xs text-white shadow-sm ${getAgeGroupColor(creation.age_group)}`}>
              {getAgeGroup(creation.age_group)}
            </Badge>
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4 sm:p-5 pt-2 sm:pt-3 flex justify-between items-center relative z-10">
        <div className="flex space-x-2">
          <Link href={`/SlideViewer?id=${creation.id}`} prefetch={true}>
            <Button variant="outline" size="sm" className="backdrop-blur-sm flex items-center space-x-1">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs">Slides</span>
              <span className="sr-only">View slides</span>
            </Button>
          </Link>
          <Link href={`/Quiz?id=${creation.id}`}>
            <Button variant="outline" size="sm" className="backdrop-blur-sm flex items-center space-x-1">
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
              <span className="text-xs">Quiz</span>
              <span className="sr-only">Take quiz</span>
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="backdrop-blur-sm">
                <Download className="h-4 w-4" />
                <span className="sr-only">Export options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className='bg-background/95 backdrop-blur-sm border border-border/50'>
              <DropdownMenuItem onClick={handleExportPptx} className="hover:bg-primary/10 transition-colors">
                <FileDown className="mr-2 h-4 w-4" />
                <span>Export Slides to PowerPoint</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportPdf} className="hover:bg-primary/10 transition-colors">
                <FileDown className="mr-2 h-4 w-4" />
                <span>Export Quiz to PDF</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {self && (
          <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                className="backdrop-blur-sm"
                disabled={deleting}
              >
                {deleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash className="h-4 w-4" />
                )}
                <span className="sr-only">Delete creation</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-background/95 backdrop-blur-sm border border-border/50">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your creation
                  and remove all associated data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="hover:bg-muted/50 transition-colors">Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-destructive hover:bg-destructive/90 transition-colors"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardFooter>
    </Card>
  );
};

export default CreationCard;

