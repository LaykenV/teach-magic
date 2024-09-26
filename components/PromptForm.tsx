"use client";
import { useState } from "react";

export default function PromptForm() {

  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<Response | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch("/api/promptForSlides", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const responseJson = await response.json();

    if (responseJson) {
      setResponse(responseJson.response);
      console.log(responseJson.response);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center w-full max-w-lg gap-4">
      <label htmlFor="prompt" >Prompt:</label> 
      <input
        type="text"
        id="prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="mt-2 w-full rounded-md border-2 border-gray-300 p-2 text-black"
      />
      <button type="submit">Generate Slides</button>
      {response && <p>{response}</p>}
    </form>
  );
}