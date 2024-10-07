"use client";
import { SlideProvider } from "@/context/SlideContext";

export default function Provider({ children }: { children: React.ReactNode }) {
  return <SlideProvider>{children}</SlideProvider>;
}