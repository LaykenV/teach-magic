"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import type { Creation } from "@/types/types"
import { CldImage, getCldImageUrl } from "next-cloudinary"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Home, ClipboardCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./theme/ThemeToggle"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion, AnimatePresence } from "framer-motion"

interface SlideViewerProps {
  creation: Creation
}

export default function SlideViewer({ creation }: SlideViewerProps) {
  const [slideIndex, setSlideIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const isScrollingRef = useRef(false)

  const slide = creation.slides[slideIndex]
  const isLastSlide = slideIndex === creation.slides.length - 1

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleNextSlide = useCallback(() => {
    const newIndex = Math.min(slideIndex + 1, creation.slides.length - 1)
    setSlideIndex(newIndex)
    if (isMobile && scrollContainerRef.current) {
      isScrollingRef.current = true
      scrollContainerRef.current.scrollTo({
        left: newIndex * scrollContainerRef.current.clientWidth,
        behavior: "smooth",
      })
      // Reset scrolling flag after animation
      setTimeout(() => {
        isScrollingRef.current = false
      }, 500)
    }
  }, [slideIndex, creation.slides.length, isMobile])

  const handlePreviousSlide = useCallback(() => {
    const newIndex = Math.max(slideIndex - 1, 0)
    setSlideIndex(newIndex)
    if (isMobile && scrollContainerRef.current) {
      isScrollingRef.current = true
      scrollContainerRef.current.scrollTo({
        left: newIndex * scrollContainerRef.current.clientWidth,
        behavior: "smooth",
      })
      // Reset scrolling flag after animation
      setTimeout(() => {
        isScrollingRef.current = false
      }, 500)
    }
  }, [slideIndex, isMobile])

  // Handle mobile scroll indicators
  const handleScroll = useCallback(() => {
    if (isMobile && scrollContainerRef.current && !isScrollingRef.current) {
      const container = scrollContainerRef.current
      const slideWidth = container.clientWidth
      const scrollLeft = container.scrollLeft
      const newIndex = Math.round(scrollLeft / slideWidth)
      if (newIndex !== slideIndex && newIndex >= 0 && newIndex < creation.slides.length) {
        setSlideIndex(newIndex)
      }
    }
  }, [slideIndex, isMobile, creation.slides.length])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (isMobile && container) {
      container.addEventListener("scroll", handleScroll, { passive: true })
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [handleScroll, isMobile])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        handlePreviousSlide()
      } else if (event.key === "ArrowRight") {
        handleNextSlide()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [handleNextSlide, handlePreviousSlide])

  // Preload all slide images on mount
  useEffect(() => {
    creation.slides.forEach((slide) => {
      if (slide.slide_image_url) {
        const img = new Image()
        const cloudUrl = getCldImageUrl({
          width: 960,
          height: 540,
          src: slide.slide_image_url,
        })
        img.src = cloudUrl
      }
    })
  }, [creation])

  const navigateToSlide = (index: number) => {
    setSlideIndex(index)
    if (isMobile && scrollContainerRef.current) {
      isScrollingRef.current = true
      scrollContainerRef.current.scrollTo({
        left: index * scrollContainerRef.current.clientWidth,
        behavior: "smooth",
      })
      // Reset scrolling flag after animation
      setTimeout(() => {
        isScrollingRef.current = false
      }, 500)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Beautiful Gradient Background */}
      <div className="absolute inset-0 slide-gradient-bg" />

      {/* Animated floating elements - hidden on mobile for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
        <div className="absolute top-20 right-20 w-80 h-80 slide-floating-orb-1" />
        <div className="absolute bottom-20 left-20 w-96 h-96 slide-floating-orb-2" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 slide-floating-orb-3" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header with Navigation */}
        <header className="flex-shrink-0 p-4 md:p-6">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            {/* Left: Navigation buttons */}
            <div className="flex items-center gap-2 md:gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/dashboard" prefetch={true}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full glass-effect smooth-hover h-9 px-3 md:h-10 md:px-4"
                      >
                        <Home className="h-4 w-4 md:mr-2" />
                        <span className="hidden sm:inline">Home</span>
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
                        className="rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 smooth-hover shadow-lg h-9 px-3 md:h-10 md:px-4"
                      >
                        <ClipboardCheck className="h-4 w-4 md:mr-2" />
                        <span className="hidden sm:inline">Quiz</span>
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
        </header>

        {/* Mobile: Horizontal scrolling slides */}
        {isMobile ? (
          <div className="flex-1 overflow-hidden">
            <div
              ref={scrollContainerRef}
              className="h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {creation.slides.map((currentSlide, index) => (
                <div key={index} className="w-full h-full flex-shrink-0 snap-center flex flex-col px-4 pb-32">
                  <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
                    {/* Slide Title */}
                    <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 bg-gradient-to-r from-foreground via-foreground/90 to-foreground bg-clip-text px-2 leading-tight">
                      {currentSlide.slide_title}
                    </h2>

                    {currentSlide.slide_type === "title" ? (
                      <div className="flex-1 flex items-center justify-center w-full">
                        {currentSlide.slide_image_url && (
                          <div className="w-full max-w-lg">
                            <CldImage
                              width={960}
                              height={540}
                              src={currentSlide.slide_image_url}
                              alt={currentSlide.slide_title || "Slide Image"}
                              className="rounded-xl sm:rounded-2xl object-cover shadow-xl w-full border border-border/20"
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center gap-4 sm:gap-6 w-full">
                        {currentSlide.slide_image_url && (
                          <div className="w-full flex-shrink-0">
                            <CldImage
                              width={960}
                              height={540}
                              src={currentSlide.slide_image_url}
                              alt={currentSlide.slide_title || "Slide Image"}
                              className="rounded-xl sm:rounded-2xl object-cover shadow-xl w-full border border-border/20"
                            />
                          </div>
                        )}

                        {currentSlide.slide_type === "content" && "slide_paragraphs" in currentSlide && (
                          <div className="space-y-3 sm:space-y-4 px-2 w-full">
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
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Desktop: Single slide with animations */
          <div className="flex-1 px-6 pb-6 overflow-hidden">
            <div className="h-full flex items-center justify-center max-w-7xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slideIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="w-full"
                >
                  <div className="h-full flex flex-col items-center justify-center">
                    {/* Slide Title */}
                    <motion.h2
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                      className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 lg:mb-8 bg-gradient-to-r from-foreground via-foreground/90 to-foreground bg-clip-text max-w-4xl"
                    >
                      {slide.slide_title}
                    </motion.h2>

                    {slide.slide_type === "title" ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="w-full flex justify-center flex-1 max-w-6xl"
                      >
                        {slide.slide_image_url && (
                          <div className="w-full lg:w-1/2 flex items-center justify-center">
                            <CldImage
                              width={960}
                              height={540}
                              src={slide.slide_image_url}
                              alt={slide.slide_title || "Slide Image"}
                              className="rounded-2xl object-cover shadow-2xl w-full border border-border/20"
                            />
                          </div>
                        )}
                      </motion.div>
                    ) : (
                      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12 w-full flex-1 max-w-6xl">
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
                              alt={slide.slide_title || "Slide Image"}
                              className="rounded-2xl object-cover shadow-2xl w-full border border-border/20"
                            />
                          </motion.div>
                        )}

                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3, duration: 0.4 }}
                          className={cn(
                            "w-full flex flex-col justify-center",
                            slide.slide_image_url ? "lg:w-1/2" : "lg:w-3/4",
                          )}
                        >
                          {slide.slide_type === "content" && "slide_paragraphs" in slide && (
                            <div className="space-y-4 lg:space-y-6">
                              {slide.slide_paragraphs.map((paragraph: string, idx: number) => (
                                <motion.p
                                  key={idx}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.4 + idx * 0.1, duration: 0.3 }}
                                  className="text-base md:text-lg lg:text-xl text-center lg:text-left leading-relaxed text-foreground/90"
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
                              className="flex justify-center lg:justify-start mt-6 lg:mt-8"
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
                            <button
                              key={index}
                              className={cn(
                                "transition-all duration-300 rounded-full cursor-pointer hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50",
                                slideIndex === index
                                  ? "w-8 h-2 bg-gradient-to-r from-primary to-secondary shadow-sm"
                                  : "w-2 h-2 bg-primary/40 hover:bg-primary/60",
                              )}
                              onClick={() => navigateToSlide(index)}
                              aria-label={`Go to slide ${index + 1}`}
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
        )}

        {/* Mobile Bottom Navigation */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 glass-effect border-t border-border/30 safe-area-pb">
            {/* Slide indicators and Quiz button row */}
            <div className="px-4 py-3 flex items-center justify-between">
              {/* Slide Counter */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1.5">
                  {creation.slides.map((_, index) => (
                    <button
                      key={index}
                      className={cn(
                        "transition-all duration-300 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50",
                        slideIndex === index
                          ? "w-6 h-1.5 bg-gradient-to-r from-primary to-secondary"
                          : "w-1.5 h-1.5 bg-primary/40 active:bg-primary/60",
                      )}
                      onClick={() => navigateToSlide(index)}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  {slideIndex + 1}/{creation.slides.length}
                </span>
              </div>

              {/* Mobile Quiz Button */}
              {isLastSlide && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <Link href={`/Quiz?id=${creation.id}`} prefetch={true}>
                    <Button
                      size="sm"
                      className="rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 ease-in-out shadow-lg text-xs h-8 px-3"
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
                      className="rounded-full hover:bg-foreground/10 transition-colors duration-300 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed h-12 w-12"
                      size="icon"
                      variant="outline"
                      aria-label="Previous Slide"
                    >
                      <ChevronLeft className="h-5 w-5" />
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
                      className="rounded-full hover:bg-foreground/10 transition-colors duration-300 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed h-12 w-12"
                      size="icon"
                      variant="outline"
                      aria-label="Next Slide"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Next Slide</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}

        {/* Desktop Navigation Buttons */}
        {!isMobile && (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handlePreviousSlide}
                    disabled={slideIndex === 0}
                    className="absolute left-4 lg:left-6 top-1/2 transform -translate-y-1/2 rounded-full glass-effect hover:glass-effect hover:border-border/60 transition-all duration-300 shadow-lg text-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="absolute right-4 lg:right-6 top-1/2 transform -translate-y-1/2 rounded-full glass-effect hover:glass-effect hover:border-border/60 transition-all duration-300 shadow-lg text-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
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
          </>
        )}
      </div>
    </div>
  )
}
