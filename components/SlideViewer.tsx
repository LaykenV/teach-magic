'use client'

import React, { useEffect, useState, useCallback, useRef } from 'react'
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
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  console.log(creation)

  const slide = creation.slides[slideIndex]
  const isLastSlide = slideIndex === creation.slides.length - 1
  
  const handleNextSlide = useCallback(() => {
    const newIndex = Math.min(slideIndex + 1, creation.slides.length - 1)
    setSlideIndex(newIndex)
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: newIndex * scrollContainerRef.current.clientWidth,
        behavior: 'smooth'
      })
    }
  }, [slideIndex, creation.slides.length])

  const handlePreviousSlide = useCallback(() => {
    const newIndex = Math.max(slideIndex - 1, 0)
    setSlideIndex(newIndex)
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: newIndex * scrollContainerRef.current.clientWidth,
        behavior: 'smooth'
      })
    }
  }, [slideIndex])

  // Handle mobile scroll indicators
  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const slideWidth = container.clientWidth
      const scrollLeft = container.scrollLeft
      const newIndex = Math.round(scrollLeft / slideWidth)
      if (newIndex !== slideIndex) {
        setSlideIndex(newIndex)
      }
    }
  }, [slideIndex])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        handlePreviousSlide()
      } else if (event.key === 'ArrowRight') {
        handleNextSlide()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleNextSlide, handlePreviousSlide])

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
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Beautiful Gradient Background */}
      <div className="absolute inset-0 slide-gradient-bg" />
      
      {/* Animated floating elements with new CSS classes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-80 h-80 slide-floating-orb-1" />
        <div className="absolute bottom-20 left-20 w-96 h-96 slide-floating-orb-2" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 slide-floating-orb-3" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header with Navigation */}
        <div className="flex-shrink-0 px-4 py-4 md:px-6 md:py-6">
          <div className="flex items-center justify-between">
            {/* Left: Navigation buttons */}
            <div className="flex items-center space-x-2 md:space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/dashboard" prefetch={true}>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="rounded-full glass-effect smooth-hover"
                      >
                        <Home className="h-4 w-4 mr-2" />
                        <span>Home</span>
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
                      <Button 
                        size="sm"
                        className="rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 smooth-hover shadow-lg"
                      >
                        <ClipboardCheck className="h-4 w-4 mr-2" />
                        <span>Quiz</span>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Take the Quiz</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Right: Theme toggle */}
            <ModeToggle />
          </div>
        </div>

        {/* Mobile: Horizontal scrolling slides */}
        <div className="md:hidden flex-1 overflow-hidden">
          <div 
            ref={scrollContainerRef}
            className="h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {creation.slides.map((currentSlide, index) => (
              <div 
                key={index}
                className="w-full h-full flex-shrink-0 snap-center flex flex-col items-center justify-center px-4 pb-24"
              >
                <div className="w-full max-w-4xl mx-auto h-full flex flex-col items-center justify-center">
                  {/* Slide Title */}
                  <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 bg-gradient-to-r from-foreground via-foreground/90 to-foreground bg-clip-text px-2">
                    {currentSlide.slide_title}
                  </h2>

                  {currentSlide.slide_type === 'title' ? (
                    <div className="w-full flex justify-center flex-1">
                      {currentSlide.slide_image_url && (
                        <div className="w-full max-w-2xl flex items-center">
                          <CldImage
                            width={960}
                            height={540}
                            src={currentSlide.slide_image_url}
                            alt={currentSlide.slide_title || 'Slide Image'}
                            className="rounded-2xl object-cover shadow-2xl w-full border border-border/20"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-4 w-full flex-1">
                      {currentSlide.slide_image_url && (
                        <div className="w-full flex-shrink-0">
                          <CldImage
                            width={960}
                            height={540}
                            src={currentSlide.slide_image_url}
                            alt={currentSlide.slide_title || 'Slide Image'}
                            className="rounded-2xl object-cover shadow-2xl w-full border border-border/20"
                          />
                        </div>
                      )}

                      <div className="w-full flex flex-col justify-center">
                        {currentSlide.slide_type === 'content' && 'slide_paragraphs' in currentSlide && (
                          <div className="space-y-3 px-2">
                            {currentSlide.slide_paragraphs.map((paragraph: string, idx: number) => (
                              <p 
                                key={idx}
                                className="text-sm sm:text-base text-center leading-relaxed text-foreground/90"
                              >
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: Single slide with animations */}
        <div className="hidden md:block flex-1 px-6 pb-6 overflow-hidden">
          <div className="h-full flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={slideIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full max-w-6xl mx-auto"
              >
                <div className="h-full flex flex-col items-center justify-center">
                  {/* Slide Title */}
                  <motion.h2 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 lg:mb-8 bg-gradient-to-r from-foreground via-foreground/90 to-foreground bg-clip-text"
                  >
                    {slide.slide_title}
                  </motion.h2>

                  {slide.slide_type === 'title' ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                      className="w-full flex justify-center flex-1"
                    >
                      {slide.slide_image_url && (
                        <div className="w-full max-w-2xl flex items-center">
                          <CldImage
                            width={960}
                            height={540}
                            src={slide.slide_image_url}
                            alt={slide.slide_title || 'Slide Image'}
                            className="rounded-2xl object-cover shadow-2xl w-full border border-border/20"
                          />
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12 w-full flex-1">
                      {slide.slide_image_url && (
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2, duration: 0.4 }}
                          className="w-full lg:w-1/2 flex-shrink-0"
                        >
                          <CldImage
                            width={960}
                            height={540}
                            src={slide.slide_image_url}
                            alt={slide.slide_title || 'Slide Image'}
                            className="rounded-2xl object-cover shadow-2xl w-full border border-border/20"
                          />
                        </motion.div>
                      )}

                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                        className={cn("w-full flex flex-col justify-center", slide.slide_image_url ? "lg:w-1/2" : "lg:w-3/4")}
                      >
                        {slide.slide_type === 'content' && 'slide_paragraphs' in slide && (
                          <div className="space-y-4 lg:space-y-6">
                            {slide.slide_paragraphs.map((paragraph: string, idx: number) => (
                              <motion.p 
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + idx * 0.1, duration: 0.3 }}
                                className="text-base md:text-lg lg:text-xl text-center leading-relaxed text-foreground/90"
                              >
                                {paragraph}
                              </motion.p>
                            ))}
                          </div>
                        )}

                        {/* Desktop Quiz Button */}
                        {isLastSlide && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.4 }}
                            className="flex justify-center mt-6 lg:mt-8"
                          >
                            <Link href={`/Quiz?id=${creation.id}`} prefetch={true}>
                              <Button 
                                size="lg" 
                                className="rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl"
                              >
                                <ClipboardCheck className="h-5 w-5 mr-2" />
                                Take the Quiz
                              </Button>
                            </Link>
                          </motion.div>
                        )}
                      </motion.div>
                    </div>
                  )}

                  {/* Desktop Slide Counter */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                    className="mt-8 text-center"
                  >
                    <div className="inline-flex items-center space-x-3 glass-effect px-6 py-3 rounded-full shadow-lg">
                      <div className="flex items-center space-x-2">
                        {creation.slides.map((_, index) => (
                          <div 
                            key={index} 
                            className={cn(
                              "transition-all duration-300 rounded-full cursor-pointer hover:scale-110",
                              slideIndex === index 
                                ? "w-8 h-2 bg-gradient-to-r from-primary to-secondary shadow-sm" 
                                : "w-2 h-2 bg-primary/40 hover:bg-primary/60"
                            )}
                            onClick={() => setSlideIndex(index)}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {slideIndex + 1} of {creation.slides.length}
                      </span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Bottom Section with Slide Indicators and Quiz Button */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 glass-effect border-t border-border/30">
          {/* Slide indicators and Quiz button row */}
          <div className={cn(
            "px-4 py-3",
            isLastSlide ? "flex items-center justify-between" : "flex justify-center"
          )}>
            {/* Slide Counter */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className={cn(isLastSlide ? "flex-1" : "w-full")}
            >
              <div className={cn(
                "flex items-center",
                isLastSlide ? "space-x-2" : "justify-center space-x-3"
              )}>
                <div className={cn(
                  "flex items-center",
                  isLastSlide ? "space-x-1" : "space-x-2"
                )}>
                  {creation.slides.map((_, index) => (
                    <div 
                      key={index} 
                      className={cn(
                        "transition-all duration-300 rounded-full cursor-pointer",
                        slideIndex === index 
                          ? isLastSlide 
                            ? "w-6 h-1.5 bg-gradient-to-r from-primary to-secondary" 
                            : "w-8 h-2 bg-gradient-to-r from-primary to-secondary"
                          : isLastSlide
                            ? "w-1.5 h-1.5 bg-primary/40"
                            : "w-2 h-2 bg-primary/40"
                      )}
                      onClick={() => {
                        setSlideIndex(index)
                        if (scrollContainerRef.current) {
                          scrollContainerRef.current.scrollTo({
                            left: index * scrollContainerRef.current.clientWidth,
                            behavior: 'smooth'
                          })
                        }
                      }}
                    />
                  ))}
                </div>
                <span className={cn(
                  "text-muted-foreground",
                  isLastSlide ? "text-xs ml-2" : "text-sm"
                )}>
                  {slideIndex + 1}/{creation.slides.length}
                </span>
              </div>
            </motion.div>

            {/* Mobile Quiz Button */}
            {isLastSlide && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="ml-4"
              >
                <Link href={`/Quiz?id=${creation.id}`} prefetch={true}>
                  <Button 
                    size="sm"
                    className="rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 ease-in-out shadow-lg text-xs"
                  >
                    <ClipboardCheck className="h-3 w-3 mr-1.5" />
                    Take Quiz
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>

          {/* Navigation buttons row */}
          <div className="px-4 pb-4 flex justify-center space-x-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handlePreviousSlide}
                    disabled={slideIndex === 0}
                    className="rounded-full hover:bg-foreground/10 transition-colors duration-300 active:scale-95 shadow-lg"
                    size="lg"
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
                    className="rounded-full hover:bg-foreground/10 transition-colors duration-300 active:scale-95 shadow-lg"
                    size="lg"
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
        </div>

        {/* Desktop Navigation Buttons */}
        <div className="hidden md:block">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handlePreviousSlide}
                  disabled={slideIndex === 0}
                  className="absolute left-4 lg:left-6 top-1/2 transform -translate-y-1/2 rounded-full glass-effect hover:glass-effect hover:border-border/60 transition-all duration-300 shadow-lg text-foreground hover:text-foreground"
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
                  className="absolute right-4 lg:right-6 top-1/2 transform -translate-y-1/2 rounded-full glass-effect hover:glass-effect hover:border-border/60 transition-all duration-300 shadow-lg text-foreground hover:text-foreground"
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
      </div>
    </div>
  )
}


