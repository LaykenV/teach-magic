import { OpenAI } from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";


/*export async function promptGPT(prompt: string): Promise<OpenAI.Chat.Completions.ChatCompletionMessage | null> {
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
}*/

export async function promptGPT(
    prompt: string
  ): Promise<OpenAI.Chat.Completions.ChatCompletionMessage | null> {
    const apiKey = process.env.OPENAI_API_KEY;

    // Title Slide Schema (unchanged)
    const TitleSlide = z.object({
    slide_type: z.literal("title"),
    slide_title: z.string(),
    slide_image_prompt: z.string(),
    });

    // Content Slide Schema (unchanged)
    const ContentSlide = z.object({
    slide_type: z.literal("content"),
    slide_title: z.string(),
    slide_paragraphs: z.array(z.string()).length(2),
    slide_image_prompt: z.string(),
    });

    // Updated Question Slide Schema
    const AnswerChoice = z.object({
    answer_text: z.string(),
    correct: z.boolean(),
    });

    const QuestionSlide = z.object({
    slide_type: z.literal("question"),
    slide_title: z.string(),
    question: z.string(),
    answer_choices: z.array(AnswerChoice).length(4),
    });

    // Define the response schema
    const Response = z.object({
    title_slide: TitleSlide,
    content_slides: z.array(ContentSlide),
    question_slide: QuestionSlide
    });
  
    const openai = new OpenAI({
      apiKey,
    });

    const systemPrompt = `
        You are an AI assistant specialized in creating educational slide content based on user input. Your task is to generate a structured array of slides in JSON format suitable for presentation purposes, adhering to the specified slide types and structure.

        **Instructions:**

        - **Output Format:**
            - The output should be a JSON object with a \`slides\` array containing objects for each slide.
            - Each slide object must have a property \`slide_type\`, which can be one of the following: \`"title"\`, \`"content"\`, or \`"question"\`.
            - Depending on the \`slide_type\`, the slide object must include specific properties as defined below.

        - **Slide Types and Structure:**

            1. **Title Slide (\`slide_type\`: \`"title"\`):**
                - **Properties:**
                    - \`slide_type\`: \`"title"\`
                    - \`slide_title\`: The main topic provided by the user.
                    - \`slide_image_prompt\`: A descriptive prompt for an image that represents the overall topic, adhering to the **modern minimalist** theme.
                - **Notes:**
                    - This is the first slide.
                    - No additional content is required.

            2. **Content Slides (\`slide_type\`: \`"content"\`):**
                - **Properties:**
                    - \`slide_type\`: \`"content"\`
                    - \`slide_title\`: A concise title summarizing the slide's content.
                    - \`slide_paragraphs\`: An array containing **two** engaging paragraphs (2-3 sentences each) that elaborate on the slide's topic.
                    - \`slide_image_prompt\`: A prompt to generate an image relevant to the slide's content, following the **modern minimalist** theme.
                - **Notes:**
                    - Generate **five** content slides after the title slide.
                    - Ensure each slide covers a different aspect of the main topic.

            3. **Question Slide (\`slide_type\`: \`"question"\`):**
                - **Properties:**
                    - \`slide_type\`: \`"question"\`
                    - \`slide_title\`: A title for the question slide.
                    - \`question\`: A multiple-choice question based on the content covered in the previous slides.
                    - \`answer_choices\`: An array containing **four** objects, each with:
                        - \`answer_text\`: The text of the answer choice.
                        - \`correct\`: A boolean indicating whether this choice is the correct answer (\`true\` or \`false\`).
                - **Notes:**
                    - Place this slide after the content slides.
                    - Ensure only one answer choice is marked as correct (\`correct: true\`), and the rest are false.
                    - The correct answer can be in any position in the array.
                    - Ensure the answer to the question is absolutely correct and the other options are absolutely incorrect.

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


    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: prompt,
          },
        ],
        // Adjust the response format to match the updated Response schema
        response_format: zodResponseFormat(Response, "slides"),
      });

      // do something to join the object into an array [TitleSlide, ContentSlides, QuestionSlide] and then return it
  
      return completion.choices[0].message || null;
    } catch (error) {
      console.error("Error fetching completion:", error);
      return null;
    }
  };

export async function promptImage(prompt: string): Promise<string | null> {
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

          

        if (!completion1.data[0].url) {
            return null;
        }

        return completion1.data[0].url;

    } catch (error) {
        console.error("Error fetching completion:", error);
        return null;
    }
}