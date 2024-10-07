import { createContext, useContext, useState, ReactNode } from "react";
import { Slide } from "@/types/types";

interface SlideContextType {
  slides: Slide[] | null;
  imageUrls: string[] | null;
  setSlides: (slides: Slide[] | null) => void;
  setImageUrls: (urls: string[] | null) => void;
}

const SlideContext = createContext<SlideContextType | undefined>(undefined);

export const SlideProvider = ({ children }: { children: ReactNode }) => {
  const [slides, setSlides] = useState<Slide[] | null>(null);
  const [imageUrls, setImageUrls] = useState<string[] | null>(null);

  return (
    <SlideContext.Provider value={{ slides, imageUrls, setSlides, setImageUrls }}>
      {children}
    </SlideContext.Provider>
  );
};

export const useSlideContext = () => {
  const context = useContext(SlideContext);
  if (!context) {
    throw new Error("useSlideContext must be used within a SlideProvider");
  }
  return context;
};