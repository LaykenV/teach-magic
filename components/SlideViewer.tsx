'use client'

import React, { useEffect, useState } from 'react'
import { Creation } from '@/types/types'
import { CldImage, getCldImageUrl } from 'next-cloudinary'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Home, ClipboardCheck } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ModeToggle } from './theme/ThemeToggle'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { motion, AnimatePresence } from "framer-motion"

interface SlideViewerProps {
  creation: Creation
}

export default function SlideViewer({ creation }: SlideViewerProps) {
  const [slideIndex, setSlideIndex] = useState(0)
  console.log(creation)

  const slide = creation.slides[slideIndex]
  const isLastSlide = slideIndex === creation.slides.length - 1
  
  const handleNextSlide = () => {
    setSlideIndex((prevIndex) => Math.min(prevIndex + 1, creation.slides.length - 1))
  }

  const handlePreviousSlide = () => {
    setSlideIndex((prevIndex) => Math.max(prevIndex - 1, 0))
  }

  // Preload all slide images on mount
  useEffect(() => {
    creation.slides.forEach((slide) => {
      if (slide.slide_image_url) {
        const img = new Image()
        const cloudUrl = getCldImageUrl({
          width: 960,
          height: 540,
          src: slide.slide_image_url
        })
        img.src = cloudUrl
      }
    })
  }, [creation])

  return (
    <div className="relative h-screen w-screen text-foreground overflow-hidden flex flex-col">
      <div className="flex-grow overflow-y-auto">
        <div className="flex items-center justify-center p-4 min-h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={slideIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-6xl flex flex-col items-center justify-center gap-[2%] md:gap-[4%] py-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">{slide.slide_title}</h2>

              {slide.slide_type === 'title' ? (
                <div className="w-full flex justify-center">
                  {slide.slide_image_url && (
                    <div className="w-full max-w-2xl">
                      <CldImage
                        width={960}
                        height={540}
                        src={slide.slide_image_url}
                        alt={slide.slide_title || 'Slide Image'}
                        className="rounded-lg object-cover shadow-lg w-full"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full">
                  {slide.slide_image_url && (
                    <div className="w-[95%] md:w-1/2">
                      <CldImage
                        width={960}
                        height={540}
                        src={slide.slide_image_url}
                        alt={slide.slide_title || 'Slide Image'}
                        className="rounded-lg object-cover shadow-lg w-full"
                      />
                    </div>
                  )}

                  <div className={cn("w-full", slide.slide_image_url ? "md:w-1/2" : "md:w-3/4")}>
                    {slide.slide_type === 'content' && 'slide_paragraphs' in slide && (
                      <div className="space-y-4">
                        {slide.slide_paragraphs.map((paragraph: string, idx: number) => (
                          <p key={idx} className="text-md md:text-xl text-center">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    )}

                    {isLastSlide && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.3 }}
                        className="mt-8 flex justify-center"
                      >
                        <Link href={`/Quiz?id=${creation.id}`} prefetch={true}>
                          <Button size="lg" className="rounded-full hover:bg-primary/90 transition-all duration-300 ease-in-out">
                            <ClipboardCheck className="h-5 w-5 mr-2" />
                            Take the Quiz
                          </Button>
                        </Link>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-10 text-center text-sm text-muted-foreground">
                Slide {slideIndex + 1} of {creation.slides.length}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      {/* Bottom Navigation Bar (Mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4">
        <div className="grid grid-cols-3 items-center">
          {/* Left: Dashboard and Quiz buttons */}
          <div className="flex items-center space-x-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/dashboard" prefetch={true}>
                    <Button variant="outline" size="icon" className="rounded-full hover:bg-foreground/5 transition-all duration-300 ease-in-out">
                      <Home className="h-5 w-5" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Back to Dashboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={`/Quiz?id=${creation.id}`} prefetch={true}>
                    <Button variant="default" size="icon" className="rounded-full hover:bg-primary/90 transition-all duration-300 ease-in-out">
                      <ClipboardCheck className="h-5 w-5" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Take the Quiz</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Center: Navigation buttons */}
          <div className="flex justify-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handlePreviousSlide}
                    disabled={slideIndex === 0}
                    className="rounded-full hover:bg-foreground/10 transition-all duration-300 ease-in-out"
                    size="icon"
                    variant="outline"
                    aria-label="Previous Slide"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Previous Slide</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleNextSlide}
                    disabled={slideIndex === creation.slides.length - 1}
                    className="rounded-full hover:bg-foreground/10 transition-all duration-300 ease-in-out"
                    size="icon"
                    variant="outline"
                    aria-label="Next Slide"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Next Slide</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Right: Empty space for future content */}
          <div className="flex justify-end">
            {/* This space is intentionally left empty */}
          </div>
        </div>
      </div>

      {/* Top Navigation (Desktop) */}
      <div className="hidden md:flex absolute top-4 left-4 z-10 space-x-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/dashboard" prefetch={true}>
                <Button variant="outline" size="lg" className="rounded-full bg-background/10 hover:bg-background/90 text-black hover:text-black transition-all duration-300 ease-in-out">
                  <Home className="h-5 w-5 mr-2" />
                  <span>Dashboard</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Back to Dashboard</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={`/Quiz?id=${creation.id}`} prefetch={true}>
                <Button variant="default" size="lg" className="rounded-full hover:bg-primary/90 transition-all duration-300 ease-in-out">
                  <ClipboardCheck className="h-5 w-5 mr-2" />
                  <span>Take Quiz</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Take the Quiz</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Desktop Navigation Buttons */}
      <div className="hidden md:block">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handlePreviousSlide}
                disabled={slideIndex === 0}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full hover:bg-foreground/10 transition-all duration-300 ease-in-out"
                size="icon"
                variant="outline"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Previous Slide</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleNextSlide}
                disabled={slideIndex === creation.slides.length - 1}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full hover:bg-foreground/10 transition-all duration-300 ease-in-out"
                size="icon"
                variant="outline"
                aria-label="Next Slide"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Next Slide</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
    </div>
  )
}

