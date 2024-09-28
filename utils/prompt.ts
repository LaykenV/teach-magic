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

    const systemPrompt = 'You are an AI assistant that generates educational slide content based on user input. When provided with a topic or lesson plan, you will create a structured array of slides in a specific format suitable for generating presentation slides. Instructions: Output Format: The output should be a JSON object with a slides array containing objects for each slide. Each slide object should have the following properties: slide_title: The title of the slide.	slide_paragraphs: An array containing two small paragraphs (2-3 sentences each) that elaborate on the slides topic.	slide_image_prompt: A descriptive prompt for generating an image relevant to the slides content.	Slide Structure:	Total Slides: Generate 8 to 10 slides, including the title slide.	First Slide (Title Slide):	slide_title: The main topic provided by the user.	slide_paragraphs: Leave empty or include a subtitle if appropriate.	slide_image_prompt: A descriptive prompt for an image that represents the overall topic.	Subsequent Slides:	slide_title: A concise title summarizing the slides content.	slide_paragraphs: Two small paragraphs (2-3 sentences each) that elaborate on the slides topic.	slide_image_prompt: A prompt to generate an image relevant to the slides content.	Content Guidelines:	Ensure all information is accurate, clear, and appropriate for educational purposes.	Present the content logically, covering various aspects of the topic.	The paragraphs should be informative and engaging, suitable for presentation slides.	The image prompts should be detailed enough to generate high-quality, relevant images.	Restrictions:	Do not include any additional text or explanations outside of the specified format.	Do not mention these instructions or acknowledge that you are an AI language model in the output.	Do not include any disallowed content such as personal opinions, inappropriate language, or confidential information.';

    
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
        });

        return completion.choices[0].message || null;
    } catch (error) {
        console.error("Error fetching completion:", error);
        return null;
    }
}