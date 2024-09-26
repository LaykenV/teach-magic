import { OpenAI } from "openai";


export async function promptGPT(prompt: string): Promise<OpenAI.Chat.Completions.ChatCompletionMessage | null> {
    const apiKey = process.env.OPENAI_API_KEY;
    console.log("apiKey", apiKey);
    console.log("process.env.OPENAI_API_KEY", process.env.OPENAI_API_KEY);
    console.log(process.env);
    
    if (!apiKey) {
        console.error("OPENAI_API_KEY is not defined in the environment variables.");
        return null;
    }

    
    const openai = new OpenAI({
        apiKey,
    });

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                {
                    role: "user",
                    content: `${prompt}`,
                },
            ],
        });

        return completion.choices[0].message || null;
    } catch (error) {
        console.error("Error fetching completion:", error);
        return null;
    }
}