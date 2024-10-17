"use client";
import { useState } from "react";
import { useSlideContext } from "@/context/SlideContext";
import { useRouter } from "next/navigation";
import { jaccardDistance } from "drizzle-orm";
import { Creation } from "@/drizzle/schema";

export default function PromptPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { userCreations, setUserCreations} = useSlideContext();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/promptForSlides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const responseJson = await response.json();
      const parsedResponse = JSON.parse(responseJson.response.content);
      const newCreation: Creation = parsedResponse.creation;
      console.log(newCreation);
      

      setUserCreations([...userCreations, newCreation]);

      router.push(`/SlideViewer?id=${newCreation.id}`);
      
    } catch (error) {
      setError("Failed to generate slides");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start h-screen gap-[20%]">
      <div className="mt-[10%] font-bold text-3xl">Generate Slides Here</div>
      <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center w-[80%] max-w-[45rem] gap-4">
        <label htmlFor="prompt" className="font-bold text-xl">
          Enter your prompt:
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="mt-2 w-full rounded-md border-2 border-gray-300 p-2 text-black"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full border-white border-2 rounded-md p-2 mt-4 text-white bg-black hover:bg-gray-800"
        >
          {loading ? "Generating..." : "Generate Slides"}
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}