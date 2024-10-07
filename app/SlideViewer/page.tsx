// pages/SlideViewer.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SlideViewer from "@/components/SlideViewer";
import { useSlideContext } from "@/context/SlideContext";

export default function SlideViewerPage() {
  const router = useRouter();
  const { slides, imageUrls } = useSlideContext();

  useEffect(() => {
    if (!slides || !imageUrls) {
      // Redirect back to form if no data is available
      router.replace("/generate");
    }
  }, [slides, imageUrls, router]);

  if (!slides || !imageUrls) {
    return <p className="text-center mt-10">Redirecting...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Slide Viewer</h1>
      <SlideViewer slides={slides} imageUrls={imageUrls} />
    </div>
  );
}