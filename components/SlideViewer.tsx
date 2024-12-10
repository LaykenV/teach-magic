'use client'

import React, { useEffect, useState } from 'react'
import { Creation } from '@/types/types'
import { CldImage, getCldImageUrl } from 'next-cloudinary'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Home, CheckSquare } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ModeToggle } from './theme/ThemeToggle'

interface SlideViewerProps {
  creation: Creation
}

export default function SlideViewer({ creation }: SlideViewerProps) {
  const [slideIndex, setSlideIndex] = useState(0)
  console.log(creation)

  const slide = creation.slides[slideIndex]
  const nextSlide = creation.slides[slideIndex + 1]
  const prevSlide = creation.slides[slideIndex - 1]
  
  const handleNextSlide = () => {
    setSlideIndex((prevIndex) => Math.min(prevIndex + 1, creation.slides.length - 1))
  }

  const handlePreviousSlide = () => {
    setSlideIndex((prevIndex) => Math.max(prevIndex - 1, 0))
  }

  useEffect(() => {
    const preloadImage = (url: string) => {
      const img = new Image()
      const cloudUrl = getCldImageUrl({
        width: 960,
        height: 540,
        src: url
      })
      img.src = cloudUrl
    }

    if (nextSlide?.slide_image_url) {
      preloadImage(nextSlide.slide_image_url)
    }

    if (prevSlide?.slide_image_url) {
      preloadImage(prevSlide.slide_image_url)
    }
  }, [slideIndex, creation, nextSlide?.slide_image_url, prevSlide?.slide_image_url])

  return (
    <div className="relative h-screen w-screen text-foreground overflow-hidden">
      <div className="absolute top-4 left-4 z-10 flex space-x-2">
        <Link href="/dashboard" prefetch={true}>
          <Button variant="outline" size="icon" className="rounded-full hover:bg-foreground/10">
            <Home className="h-4 w-4" />
            <span className="sr-only">Back to Dashboard</span>
          </Button>
        </Link>
        <Link href={`/Quiz?id=${creation.id}`} prefetch={true}>
          <Button variant="outline" size="icon" className="rounded-full hover:bg-foreground/10">
            <CheckSquare className="h-4 w-4" />
            <span className="sr-only">Take quiz</span>
          </Button>
        </Link>
      </div>

      <div className="absolute inset-0 flex items-center justify-center p-2">
        {slide ? (
          <div className="w-full max-w-6xl flex flex-col items-center justify-center gap-[2%] md:gap-[4%] h-full">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">{slide.slide_title}</h2>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              {(slide.slide_type === 'title' || slide.slide_type === 'content') && slide.slide_image_url && (
                <div className="w-[70%] md:w-1/2">
                  <CldImage
                    width={960}
                    height={540}
                    src={slide.slide_image_url}
                    alt={slide.slide_title || 'Slide Image'}
                    className="rounded-lg object-cover"
                  />
                </div>
              )}

              {slide.slide_type === 'content' && 'slide_paragraphs' in slide && (
                <div className={cn("w-full", slide.slide_image_url ? "md:w-1/2" : "md:w-3/4")}>
                  {slide.slide_type === 'content' && (
                    <div className="space-y-4">
                      {slide.slide_paragraphs.map((paragraph: string, idx: number) => (
                        <p key={idx} className="text-md md:text-xl text-center">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-10 text-center text-sm text-muted-foreground">
              Slide {slideIndex + 1} of {creation.slides.length}
            </div>
          </div>
        ) : (
          <p className="text-xl">No slide available.</p>
        )}
      </div>
        
      {/* Navigation Buttons */}
      <Button
        onClick={handlePreviousSlide}
        disabled={slideIndex === 0}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full hover:bg-foreground/10"
        size="icon"
        variant="outline"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        onClick={handleNextSlide}
        disabled={slideIndex === creation.slides.length - 1}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full hover:bg-foreground/10"
        size="icon"
        variant="outline"
        aria-label="Next Slide"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <ModeToggle />
    </div>
  )
}

