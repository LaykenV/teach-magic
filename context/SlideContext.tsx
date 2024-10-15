import { createContext, useContext, useState, ReactNode } from "react";
import { Slide } from "@/types/types";
import { User } from "@/drizzle/schema";

interface SlideContextType {
  slides: Slide[] | null;
  imageUrls: string[] | null;
  user: User | null;
  setUser: (user: User | null) => void;
  setSlides: (slides: Slide[] | null) => void;
  setImageUrls: (urls: string[] | null) => void;
}

const SlideContext = createContext<SlideContextType | undefined>(undefined);

export const SlideProvider = ({ children }: { children: ReactNode }) => {
  const [slides, setSlides] = useState<Slide[] | null>(null);
  const [imageUrls, setImageUrls] = useState<string[] | null>(null);
  const [user, setUser] = useState<User | null>(null);

  return (
    <SlideContext.Provider value={{ slides, imageUrls, setSlides, setImageUrls, user, setUser }}>
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