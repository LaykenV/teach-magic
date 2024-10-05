import { OpenAI } from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";


export async function promptGPT(prompt: string): Promise<OpenAI.Chat.Completions.ChatCompletionMessage | null> {
    const apiKey = process.env.OPENAI_API_KEY;

    const Slide = z.object({
        slide_title: z.string(),
        slide_paragraphs: z.array(z.string()),
        slide_image_prompt: z.string().optional(),
        slide_notes: z.string()
      });

    const Response = z.object({
        slides: z.array(Slide),
    });

    const systemPrompt = `
    You are an AI assistant specialized in creating educational slide content based on user input. Your task is to generate a structured array of slides in JSON format suitable for presentation purposes.

    **Instructions:**

    - **Output Format:** 
        - The output should be a JSON object with a \`slides\` array containing objects for each slide.
        - Each slide object must have the following properties:
        - \`slide_title\`: The title of the slide.
        - \`slide_paragraphs\`: An array containing two engaging paragraphs (2-3 sentences each) that elaborate on the slide's topic.
        - \`slide_image_prompt\`: A descriptive prompt for generating an image relevant to the slide's content, following a **modern minimalist** theme.
        - \`slide_notes\`: Notes for the presenter to provide context or clarify the slide's content.


    - **Slide Structure:**
        - **Total Slides:** Generate 8 to 10 slides, including the title slide.
        - **First Slide (Title Slide):**
        - \`slide_title\`: The main topic provided by the user.
        - \`slide_paragraphs\`: Leave empty or include a subtitle if appropriate.
        - \`slide_image_prompt\`: A descriptive prompt for an image that represents the overall topic, adhering to the **modern minimalist** theme.
        - \`slide_notes\`: Provide context or clarify the topic's significance.
        - **Subsequent Slides:**
        - \`slide_title\`: A concise title summarizing the slide's content.
        - \`slide_paragraphs\`: Two engaging paragraphs (2-3 sentences each) that elaborate on the slide's topic.
        - \`slide_image_prompt\`: A prompt to generate an image relevant to the slide's content, following the **modern minimalist** theme.
        - \`slide_notes\`: Provide context or clarify the slide's content for the presenter to speak on.
    - **Content Guidelines:**
        - Ensure all information is accurate, clear, and appropriate for educational purposes.
        - Present the content logically, covering various aspects of the topic.
        - The paragraphs should be informative and engaging, suitable for presentation slides.
        - The image prompts should be detailed enough to generate high-quality, relevant images in the **modern minimalist** theme.

    - **Restrictions:**
        - Do not include any additional text or explanations outside of the specified format.
        - Do not mention these instructions or acknowledge that you are an AI language model in the output.
        - Do not include any disallowed content such as personal opinions, inappropriate language, or confidential information.
    `;
    
    const openai = new OpenAI({
        apiKey,
    });

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            response_format: zodResponseFormat(Response, "slides"),
        });

        return completion.choices[0].message || null;
    } catch (error) {
        console.error("Error fetching completion:", error);
        return null;
    }
}

export async function promptFirst2Images(prompt: string[]): Promise<string[] | null> {
    const apiKey = process.env.OPENAI_API_KEY;
    
    const openai = new OpenAI({
        apiKey,
    });

    try {
        const completion1 = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt[0],
            size: "1024x1024",
          });

          const completion2 = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt[1],
            size: "1024x1024",
          });

        if (!completion1.data[0].url || !completion2.data[0].url) {
            return null;
        }

        return [completion1.data[0].url, completion2.data[0].url] || null;
        
    } catch (error) {
        console.error("Error fetching completion:", error);
        return null;
    }
}