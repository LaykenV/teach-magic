"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SlideViewer from "@/components/SlideViewer";
import { useSlideContext } from "@/context/SlideContext";
import { Creation } from "@/drizzle/schema";
import { useAuth } from "@clerk/nextjs";

export default function SlideViewerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userCreations, setUserCreations } = useSlideContext();
  const { userId } = useAuth();
  const [creation, setCreation] = useState<Creation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const id = searchParams.get("id");

  useEffect(() => {
    if (!id) {
      setError("No creation ID provided.");
      setLoading(false);
      router.replace("/generate");
      return;
    }

    // Search for the creation in the context
    const existingCreation = userCreations.find((creation) => creation.id === id);

    if (existingCreation) {
      console.log('existingCreation', existingCreation);
      setCreation(existingCreation);
      setLoading(false);
    } else {
      // Fetch the creation from the API
      const fetchCreation = async () => {
        try {
          const response = await fetch("/api/getCreation", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to fetch creation.");
          }

          const fetchedCreation: Creation = await response.json();
          setCreation(fetchedCreation);
          console.log('fetchedCreation', fetchedCreation);
        } catch (err: any) {
          console.error(err);
          setError(err.message || "An unexpected error occurred.");
        } finally {
          setLoading(false);
        }
      };

      fetchCreation();
    }
  }, [id, userCreations, router]);

  useEffect(() => {
    if (error) {
      console.error(error);
      const timer = setTimeout(() => {
        router.replace("/generate");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, router]);

  useEffect(() => {
    if (creation) {
      generateImagesSequentially(creation.slides as any[]);
    }
  }, [creation]);

  const generateImagesSequentially = async (slides: any[]) => {
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      if (!slide.slide_image_url && creation) {
        try {
          const response = await fetch('/api/generateImage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              creationId: creation?.id,
              slideIndex: i,
              slideImagePrompt: slide.slide_image_prompt,
            }),
          });
  
          if (!response.ok) {
            throw new Error('Image generation failed');
          }
  
          const updatedSlide = await response.json();

          const updatedSlides = [...creation?.slides];
          updatedSlides[i] = updatedSlide;
          const updatedCreation: Creation = { ...creation, slides: updatedSlides };
          setCreation(updatedCreation);

          if (userId === creation?.user_id) {
            const updatedUserCreations = userCreations.map((c) => {
              if (c.id === creation?.id) {
                const updatedSlides = [...c.slides];
                updatedSlides[i] = updatedSlide;
                return { ...c, slides: updatedSlides };
              }
              return c;
            });
            setUserCreations(updatedUserCreations);
          }
        } catch (error) {
          console.error(`Failed to generate image for slide ${i + 1}:`, error);
          // Optionally handle retries or show error messages to the user
        }
      }
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  if (!creation) {
    return <p className="text-center mt-10">No creation found.</p>;
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Slide Viewer</h1>
      <SlideViewer creation={creation} />
    </div>
  );
}