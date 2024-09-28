"use client";
import { useState } from "react";

export default function PromptForm() {

  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch("/api/promptForSlides", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const responseJson = await response.json();

    if (responseJson) {
      setLoading(false);
      setResponse(responseJson.response.content);
      console.log(responseJson.response);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center w-[80%] max-w-[45rem] gap-4">
      <label htmlFor="prompt" className="font-bold text-xl">
        Enter your prompt:
      </label>
      <input
        type="text"
        id="prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="mt-2 w-full rounded-md border-2 border-gray-300 p-2 text-black"
      />
      <button type="submit" className="w-full border-white border-2 rounded-md p-2 mt-4 text-white bg-black hover:bg-gray-800">
        Generate Slides
      </button>
      {loading && <p>Loading...</p>}
      {response && <p>{response}</p>}
    </form>
  );
}