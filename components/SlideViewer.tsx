import React from 'react';
import { Slide, SlideViewerProps } from '@/types/types';

const SlideViewer = ({ slides: slides }: SlideViewerProps) => {
  return (
    <div className="slide-viewer">
      {slides.map((slide, index) => (
        <div key={index} className="slide">
          <h2>{slide.slide_title}</h2>
          <p>{slide.slide_paragraphs[0]}</p>
          <p>{slide.slide_paragraphs[1]}</p>
          {slide.slide_image_prompt && (
            <img
              src={''}
              alt={slide.slide_title}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default SlideViewer;