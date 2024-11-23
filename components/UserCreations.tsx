'use client'

import React, { useState, useEffect } from 'react'
import { Creation } from '@/types/types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CldImage } from "next-cloudinary"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2, Plus, Trash, BookOpen, Gem } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RainbowButton } from './ui/rainbow-button'
import { Badge } from '@/components/ui/badge'
import { Progress } from './ui/progress'
import { MyDock } from './MyDock'

interface UserCreationsProps {
  userCreations: Creation[]
}

const getAgeGroup = (ageGroup: string) => {
  switch (ageGroup) {
    case 'elementary':
      return 'Elementary'
    case 'middle-school':
      return 'Middle School'
    case 'high-school':
      return 'High School'
    case 'college':
      return 'College'
    default:
      return ageGroup;
  }
}

const getAgeGroupColor = (ageGroup: string) => {
  switch (ageGroup) {
    case 'elementary':
      return 'bg-green-100 text-green-800'
    case 'middle-school':
      return 'bg-blue-100 text-blue-800'
    case 'high-school':
      return 'bg-purple-100 text-purple-800'
    case 'college':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function UserCreations({ userCreations }: UserCreationsProps) {
  const [creations, setCreations] = useState<Creation[]>(userCreations)
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [progress, setProgress] = useState(0);
  const [prompt, setPrompt] = useState("")
  const [ageGroup, setAgeGroup] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setProgress(100), 30000)
      const interval = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) {
            clearInterval(interval)
            return 100
          }
          const newProgress = oldProgress + 100 / 300 // 100% over 30 seconds (300 intervals of 100ms)
          return Math.min(newProgress, 100)
        })
      }, 100)
      return () => {
        clearTimeout(timer)
        clearInterval(interval)
      }
    } else {
      setProgress(0)
    }
  }, [loading]);

  const deleteCreation = async (id: string, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    event.stopPropagation()
    setError(null)
    setSuccess(null)

    setDeletingIds(prev => new Set(prev).add(id))

    try {
      const response = await fetch(`/api/deleteCreation?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `API error: ${response.statusText}`)
      }

      setCreations(prevCreations => prevCreations.filter(creation => creation.id !== id))
      setSuccess('Creation deleted successfully.')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error deleting creation:', error)
      setError(error.message || 'Failed to delete creation.')
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/promptForSlides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, age_group: ageGroup }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      const responseJson = await response.json()
      console.log(responseJson)
      const newCreation: Creation = responseJson.creation
      console.log(newCreation)
      
      setIsDrawerOpen(false)
      router.push(`/SlideViewer?id=${newCreation.id}`)
      
    } catch (error) {
      setError("Failed to generate slides. Please try again.")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
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
            <Card key={creation.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group">
              <Link href={`/SlideViewer?id=${creation.id}`} prefetch={true} className="block">
                <CardHeader className="p-0">
                  {creation.slides[0]?.slide_image_url ? (
                    <div className="relative aspect-video">
                      <CldImage
                        loading='eager'
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
                  <CardTitle className="text-lg font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors duration-300">
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
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={(e) => deleteCreation(creation.id, e)}
                  disabled={deletingIds.has(creation.id)}
                  className="hover:bg-destructive/90 transition-colors duration-300"
                >
                  {deletingIds.has(creation.id) ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash className="h-4 w-4" />
                  )}
                  <span className="sr-only">Delete creation</span>
                </Button>
              </CardFooter>
          </Card>
          ))}
        </div>
      )}

      <div className='flex items-center justify-center w-auto pt-20'>
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            <RainbowButton id='triggerButton' className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium sm:text-base">
              <span>Create Something New</span>
            </RainbowButton>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Generate Slides</DrawerTitle>
              <DrawerDescription>
                Enter your topic or lesson idea, and well create a set of slides for you.
              </DrawerDescription>
            </DrawerHeader>
            <form onSubmit={handleSubmit}>
              <div className="p-4 pb-0">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="age-group" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Please choose the age range to optimize for:
                    </label>
                    <Select value={ageGroup} onValueChange={setAgeGroup}>
                      <SelectTrigger id="age-group">
                        <SelectValue placeholder="Select age range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="elementary">Elementary</SelectItem>
                        <SelectItem value="middle-school">Middle School</SelectItem>
                        <SelectItem value="high-school">High School</SelectItem>
                        <SelectItem value="college">College Level</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="prompt" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Enter your prompt:
                    </label>
                    <Textarea
                      id="prompt"
                      placeholder="e.g., Explain the water cycle for 5th grade students"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-[100px]"
                      required
                    />
                  </div>
                </div>
              </div>
              {loading && (
                <div className="px-4 py-2">
                  <Progress value={progress} className="w-full h-2" />
                  <p className="text-sm text-center mt-2">Generating slides...</p>
                </div>
              )}
              <DrawerFooter className="flex flex-col sm:flex-row gap-2">
                <DrawerClose asChild>
                  <Button variant="destructive" className="w-full flex-1 sm:w-auto font-semibold">Cancel</Button>
                </DrawerClose>
                <Button 
                  type="submit" 
                  disabled={loading || prompt.trim().length === 0 || !ageGroup}
                  className="w-full sm:w-auto flex-1 justify-between items-center text-lg font-semibold"
                >
                  <span className="flex-1">Generate Slides</span>
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-5 w-5 mr-2 animated-spin" />
                      <span>Generating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <span>1</span>
                      <Gem className="h-5 w-5" />
                    </div>
                  )}
                </Button>
              </DrawerFooter>
            </form>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  )
}