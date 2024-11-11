import { createContext, useContext, useState, ReactNode } from "react";
import { Creation, User } from "@/drizzle/schema";

interface SlideContextType {
  userCreations: Creation[];
  user: User | null;
  setUser: (user: User | null) => void;
  setUserCreations: (userCreations: Creation[]) => void;
}

const SlideContext = createContext<SlideContextType | undefined>(undefined);

export const SlideProvider = ({ children }: { children: ReactNode }) => {
  const [userCreations, setUserCreations] = useState<Creation[]>([]);
  const [user, setUser] = useState<User | null>(null);

  return (
    <SlideContext.Provider value={{ userCreations, setUserCreations, user, setUser }}>
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