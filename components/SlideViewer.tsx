import React, { useEffect, useState } from 'react';
import { Slide } from '@/types/types';
import { Creation } from '@/drizzle/schema';
import Image from "next/image";

interface SlideViewerProps {
  creation: Creation;
}

const SlideViewer: React.FC<SlideViewerProps> = ({ creation }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [slide, setSlide] = useState<Slide | null>(null);

  useEffect(() => {
    if (creation.slides && creation.slides.length > 0) {
      setSlide(creation.slides[slideIndex]);

      // Preload the next slide's image
      if (slideIndex + 1 < creation.slides.length) {
        const nextSlide = creation.slides[slideIndex + 1];
        if (nextSlide.slide_image_url) {
          const img = new window.Image();
          img.src = nextSlide.slide_image_url;
        }
      }

      // Preload the previous slide's image
      if (slideIndex > 0) {
        const prevSlide = creation.slides[slideIndex - 1];
        if (prevSlide.slide_image_url) {
          const img = new window.Image();
          img.src = prevSlide.slide_image_url;
        }
      }
    }
  }, [slideIndex, creation.slides]);

  const handleNextSlide = () => {
    setSlideIndex((prevIndex) => Math.min(prevIndex + 1, creation.slides.length - 1));
  };

  const handlePreviousSlide = () => {
    setSlideIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  return (
    <div className="slide-viewer flex flex-col items-center justify-center w-full max-w-4xl mx-auto p-4">
      {slide ? (
        <div className="slide-content flex flex-col items-center justify-center w-full bg-white shadow-md rounded-lg p-6 mb-6">
          {/* Slide Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">{slide.slide_title}</h2>

          {/* Slide Image or Placeholder */}
          {slide.slide_image_url ? (
            <Image
              src={slide.slide_image_url}
              alt={slide.slide_title}
              className="w-full h-auto max-h-96 object-contain mb-4 rounded-md"
              width={1024}
              height={1024}
            />
          ) : (
            <div className="w-full h-64 md:h-96 bg-gray-200 flex items-center justify-center mb-4 rounded-md">
              <p className="text-gray-500">Image is being generated...</p>
            </div>
          )}

          {/* Slide Paragraphs */}
          <div className="slide-paragraphs flex flex-col gap-2">
            {slide.slide_paragraphs.map((paragraph, idx) => (
              <p key={idx} className="text-lg md:text-xl text-center">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Slide Indicator */}
          <div className="slide-indicator mt-4 text-sm text-gray-600">
            Slide {slideIndex + 1} of {creation.slides.length}
          </div>
        </div>
      ) : (
        <div className="w-full flex items-center justify-center bg-gray-100 h-64 rounded-lg mb-6">
          <p className="text-gray-500">No slide available.</p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="navigation-buttons flex flex-row gap-4">
        {/* Previous Slide Button */}
        <button
          onClick={handlePreviousSlide}
          disabled={slideIndex === 0}
          className={`prev-slide px-4 py-2 rounded-md border-2 ${
            slideIndex === 0
              ? 'border-gray-300 text-gray-300 cursor-not-allowed'
              : 'border-black text-white bg-black hover:bg-gray-800'
          } transition duration-200`}
          aria-label="Previous Slide"
        >
          Previous Slide
        </button>

        {/* Next Slide Button */}
        <button
          onClick={handleNextSlide}
          disabled={slideIndex === creation.slides.length - 1}
          className={`next-slide px-4 py-2 rounded-md border-2 ${
            slideIndex === creation.slides.length - 1
              ? 'border-gray-300 text-gray-300 cursor-not-allowed'
              : 'border-black text-white bg-black hover:bg-gray-800'
          } transition duration-200`}
          aria-label="Next Slide"
        >
          Next Slide
        </button>
      </div>
    </div>
  );
};

export default SlideViewer;