/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RainbowButton } from './ui/rainbow-button';
import { Loader2, Plus } from 'lucide-react';
import { Creation } from '@/types/types';

interface CreateNewDrawerProps {
  onSuccess: (newCreation: Creation) => void;
}

const CreateNewDrawer: React.FC<CreateNewDrawerProps> = ({ onSuccess }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [prompt, setPrompt] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setProgress(100), 30000);
      const interval = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) {
            clearInterval(interval);
            return 100;
          }
          const newProgress = oldProgress + 100 / 300; // 100% over 30 seconds (300 intervals of 100ms)
          return Math.min(newProgress, 100);
        });
      }, 100);
      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    } else {
      setProgress(0);
    }
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/promptForSlides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, age_group: ageGroup }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const responseJson = await response.json();
      const newCreation = responseJson.creation;

      setIsDrawerOpen(false);
      onSuccess(newCreation);
    } catch (error) {
      setError('Failed to generate slides. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
  <DrawerTrigger asChild>
    <RainbowButton
      id="triggerButton"
      className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium sm:text-base"
    >
      <Plus className="mr-2 h-4 w-4" /> Create New Content
    </RainbowButton>
  </DrawerTrigger>
  <DrawerContent className="bg-gradient-to-b from-background/80 to-background dark:from-background/90 dark:to-background/70 backdrop-blur-sm border-l border-primary">
    <DrawerHeader>
      <DrawerTitle className="text-foreground">Generate Slides</DrawerTitle>
      <DrawerDescription className="text-muted-foreground">
        Enter your topic or lesson idea, and we will create a set of slides for you.
      </DrawerDescription>
    </DrawerHeader>
    <form onSubmit={handleSubmit}>
      <div className="p-4 pb-0">
        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="age-group"
              className="text-md font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Please choose the age range to optimize for:
            </label>
            <Select value={ageGroup} onValueChange={setAgeGroup}>
              <SelectTrigger id="age-group" className="bg-background/70 focus:border-primary">
                <SelectValue placeholder="Select age range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="elementary" className='color-primary'>Elementary</SelectItem>
                <SelectItem value="middle-school">Middle School</SelectItem>
                <SelectItem value="high-school">High School</SelectItem>
                <SelectItem value="college">College Level</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="prompt"
              className="text-md font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Enter your prompt:
            </label>
            <Textarea
              id="prompt"
              placeholder="e.g., Explain the water cycle for 5th grade students"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px] bg-background/70 focus:border-primary"
              required
            />
          </div>
        </div>
      </div>
      {loading && (
        <div className="px-4 pt-4">
          <Progress value={progress} className="w-full h-2" />
        </div>
      )}
      <DrawerFooter className="flex flex-col sm:flex-row gap-2">
        <DrawerClose asChild>
          <Button variant="destructive" className="w-full flex-1 sm:w-auto text-lg font-semibold">
            Cancel
          </Button>
        </DrawerClose>
        <Button
          type="submit"
          disabled={loading || prompt.trim().length === 0 || !ageGroup}
          className="w-full sm:w-auto flex-1 justify-between items-center text-lg font-semibold color-primary text-white"
        >
          {loading ? (
            <div className="flex items-center space-x-2 flex-1">
              <span className="flex-1">Generating...</span>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            </div>
          ) : (
            <span className="flex-1">Generate Slides</span>
          )}
        </Button>
      </DrawerFooter>
    </form>
  </DrawerContent>
</Drawer>






  );
};

export default CreateNewDrawer;