import React, { useEffect, useState } from 'react';
import { Slide } from '@/types/types';

interface SlideViewerProps {
    slides: Slide[];
    imageUrls: string[] | null;
  }

const SlideViewer = ({ slides: slides, imageUrls }: SlideViewerProps) => {
    const [slideIndex, setSlideIndex] = useState(0);
    const [slide, setSlide] = useState<Slide | null>(null);

    useEffect(() => {
        if (slides && slides.length > 0) {
            setSlide(slides[slideIndex]);
        }
    }, [slideIndex, slides]);

    const handleNextSlide = () => {
        setSlideIndex((prevIndex) => prevIndex + 1);
    };

    const handlePreviousSlide = () => {
        setSlideIndex((prevIndex) => prevIndex - 1);
    };

    return (
        <div className="slide-viewer">
            {slide && (
                <div className="flex flex-col items-center justify-center w-[100%] gap-4">
                    <h2 className='text-3xl font-bold'>{slide.slide_title}</h2>
                    {slide.slide_image_prompt && imageUrls && imageUrls[slideIndex] && (
                        <img
                            src={imageUrls[slideIndex]}
                            alt={slide.slide_title}
                        />
                    )}
                    <p className='text-xl'>{slide.slide_paragraphs[0]}</p>
                    <p className='text-xl'>{slide.slide_paragraphs[1]}</p>
                </div>
            )}
            <div className="flex flex-row items-center justify-center w-[100%] gap-4">
                <button onClick={handlePreviousSlide} className="prev-slide border-white border-2 rounded-md p-2 mt-4 text-white bg-black hover:bg-gray-800">
                    Previous Slide
                </button>
                <button onClick={handleNextSlide} className="next-slide border-white border-2 rounded-md p-2 mt-4 text-white bg-black hover:bg-gray-800">
                    Next Slide
                </button>
            </div>
        </div>
    );
};

export default SlideViewer;