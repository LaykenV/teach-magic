'use client'

import React, { useEffect, useState } from 'react'
import { Creation } from '@/drizzle/schema'
import { CldImage, getCldImageUrl } from 'next-cloudinary'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Home } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SlideViewerProps {
  creation: Creation
}

export default function SlideViewer({ creation }: SlideViewerProps) {
  const [slideIndex, setSlideIndex] = useState(0)
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null)
  const [showAnswerFeedback, setShowAnswerFeedback] = useState<boolean>(false)

  const slide = creation.slides[slideIndex]
  const nextSlide = creation.slides[slideIndex + 1]
  const prevSlide = creation.slides[slideIndex - 1]

  useEffect(() => {
    setSelectedAnswerIndex(null)
    setShowAnswerFeedback(false)
  }, [slideIndex, creation])

  const handleNextSlide = () => {
    setSlideIndex((prevIndex) => Math.min(prevIndex + 1, creation.slides.length - 1))
  }

  const handlePreviousSlide = () => {
    setSlideIndex((prevIndex) => Math.max(prevIndex - 1, 0))
  }

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswerIndex(index)
    setShowAnswerFeedback(true)
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
    <div className="relative h-screen w-screen bg-black text-white overflow-hidden">
      <Link href="/dashboard" prefetch={true} className="absolute top-4 left-4 z-10">
        <Button variant="ghost" size="icon">
          <Home className="h-6 w-6" />
          <span className="sr-only">Back to Dashboard</span>
        </Button>
      </Link>

      <div className="absolute inset-0 flex items-center justify-center p-4">
        {slide ? (
          <div className="w-full max-w-6xl flex flex-col items-center justify-center gap-[4%] h-full">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">{slide.slide_title}</h2>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              {(slide.slide_type === 'title' || slide.slide_type === 'content') && slide.slide_image_url && (
                <div className="w-full md:w-1/2">
                  <CldImage
                    width={960}
                    height={540}
                    src={slide.slide_image_url}
                    alt={slide.slide_title || 'Slide Image'}
                    className="rounded-lg object-cover"
                  />
                </div>
              )}

            {(slide.slide_type === 'content' || slide.slide_type === 'question') && (

              <div className={cn("w-full", slide.slide_image_url ? "md:w-1/2" : "md:w-3/4")}>
                {slide.slide_type === 'content' && (
                  <div className="space-y-4">
                    {slide.slide_paragraphs.map((paragraph: string, idx: number) => (
                      <p key={idx} className="text-lg md:text-xl">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}

                {slide.slide_type === 'question' && (
                  <div className="space-y-4">
                    <p className="text-xl md:text-2xl font-semibold">{slide.question}</p>
                    <div className="space-y-2">
                      {slide.answer_choices.map((choice: { answer_text: string; correct: boolean }, index: number) => (
                        <Button
                        key={index}
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left",
                          showAnswerFeedback && (
                              selectedAnswerIndex === index
                              ? (choice.correct ? "bg-green-500 text-white" : "bg-red-500 text-white")
                              : (choice.correct ? "bg-green-500 text-white" : "")
                            )
                          )}
                          onClick={() => handleSelectAnswer(index)}
                          disabled={showAnswerFeedback}
                          >
                          {choice.answer_text}
                        </Button>
                      ))}
                    </div>
                    {showAnswerFeedback && selectedAnswerIndex !== null && (
                      <p className={cn(
                        "font-semibold text-center text-xl",
                        slide.answer_choices[selectedAnswerIndex].correct ? "text-green-400" : "text-red-400"
                      )}>
                        {slide.answer_choices[selectedAnswerIndex].correct
                          ? "Correct!"
                          : "Incorrect. The correct answer is highlighted."}
                      </p>
                    )}
                  </div>
                )}
              </div>
              )}
            </div>

            <div className="mt-10 text-center text-sm text-gray-400">
              Slide {slideIndex + 1} of {creation.slides.length}
            </div>
          </div>
        ) : (
          <p className="text-xl">No slide available.</p>
        )}
      </div>
        

      {/* Navigation Buttons */}
      <button
        onClick={handlePreviousSlide}
        disabled={slideIndex === 0}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 p-4 text-white opacity-50 hover:opacity-100 transition-opacity duration-200"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="h-12 w-12" />
      </button>

      <button
        onClick={handleNextSlide}
        disabled={slideIndex === creation.slides.length - 1}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 p-4 text-white opacity-50 hover:opacity-100 transition-opacity duration-200"
        aria-label="Next Slide"
      >
        <ChevronRight className="h-12 w-12" />
      </button>
    </div>
  )
}