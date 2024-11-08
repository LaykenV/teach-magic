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
  
    // Define the slide types
    const SlideType = z.enum(["title", "content", "question", "path"]);

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

    // Path Slide Schema (unchanged)
    const PathSlide = z.object({
    slide_type: z.literal("path"),
    slide_title: z.string(),
    paths: z.array(
        z.object({
        path_title: z.string(),
        path_image_prompt: z.string(),
        })
    ).length(3),
    });

    // Create a discriminated union of slide types
    const Slide = z.discriminatedUnion("slide_type", [
    TitleSlide,
    ContentSlide,
    QuestionSlide,
    PathSlide,
    ]);

    // Define the response schema
    const Response = z.object({
    slides: z.array(Slide),
    });
  
    const openai = new OpenAI({
      apiKey,
    });

    const systemPrompt = `
        You are an AI assistant specialized in creating educational slide content based on user input. Your task is to generate a structured array of slides in JSON format suitable for presentation purposes, adhering to the specified slide types and structure.

        **Instructions:**

        - **Output Format:**
            - The output should be a JSON object with a \`slides\` array containing objects for each slide.
            - Each slide object must have a property \`slide_type\`, which can be one of the following: \`"title"\`, \`"content"\`, \`"question"\`, or \`"path"\`.
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

            4. **Path Slide (\`slide_type\`: \`"path"\`):**
                - **Properties:**
                    - \`slide_type\`: \`"path"\`
                    - \`slide_title\`: A title for the path selection slide.
                    - \`paths\`: An array containing **three** objects, each with:
                        - \`path_title\`: The title of the path or subtopic.
                        - \`path_image_prompt\`: A descriptive prompt for an image representing the path, following the **modern minimalist** theme.
                - **Notes:**
                    - Place this slide after the question slide.
                    - The paths should be relevant subtopics or directions for further exploration based on the main topic.

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
  
      return completion.choices[0].message || null;
    } catch (error) {
      console.error("Error fetching completion:", error);
      return null;
    }
  };

export async function generatePathSlides(
    pathTitle: string
  ): Promise<OpenAI.Chat.Completions.ChatCompletionMessage | null> {
    const apiKey = process.env.OPENAI_API_KEY;
  
    // Include the updated Zod schemas here
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
    
        // Path Slide Schema (unchanged)
        const PathSlide = z.object({
        slide_type: z.literal("path"),
        slide_title: z.string(),
        paths: z.array(
            z.object({
            path_title: z.string(),
            path_image_prompt: z.string(),
            })
        ).length(3),
        });
    
        // Create a discriminated union of slide types
        const Slide = z.discriminatedUnion("slide_type", [
        ContentSlide,
        QuestionSlide,
        PathSlide,
        ]);
    
        // Define the response schema
        const Response = z.object({
        slides: z.array(Slide),
        });
  
    const openai = new OpenAI({
      apiKey,
    });

    const systemPrompt = `
    You are an AI assistant specialized in creating educational slide content based on a specific subtopic. Your task is to generate a structured array of slides in JSON format suitable for presentation purposes, focusing on the topic: "${pathTitle}". Follow the specified slide types and structure.
    
    **Instructions:**
    
    - **Output Format:**
        - The output should be a JSON object with a \`slides\` array containing objects for each slide.
        - Each slide object must have a property \`slide_type\`, which can be one of the following: \`"content"\`, \`"question"\`, or \`"path"\`.
        - Depending on the \`slide_type\`, the slide object must include specific properties as defined below.
    
    - **Slide Types and Structure:**
    
        1. **Content Slides (\`slide_type\`: \`"content"\`):**
            - **Properties:**
                - \`slide_type\`: \`"content"\`
                - \`slide_title\`: A concise title summarizing the slide's content.
                - \`slide_paragraphs\`: An array containing **two** engaging paragraphs (2-3 sentences each) that elaborate on the slide's topic.
                - \`slide_image_prompt\`: A prompt to generate an image relevant to the slide's content, following the **modern minimalist** theme.
            - **Notes:**
                - Generate **three** content slides related to "${pathTitle}".
                - Ensure each slide covers a different aspect of the path topic.
    
        2. **Question Slide (\`slide_type\`: \`"question"\`):**
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
    
        3. **Path Slide (\`slide_type\`: \`"path"\`):**
            - **Properties:**
                - \`slide_type\`: \`"path"\`
                - \`slide_title\`: A title for the path selection slide.
                - \`paths\`: An array containing **three** objects, each with:
                    - \`path_title\`: The title of the new path or subtopic.
                    - \`path_image_prompt\`: A descriptive prompt for an image representing the path, following the **modern minimalist** theme.
            - **Notes:**
                - Place this slide after the question slide.
                - The paths should be relevant subtopics or directions for further exploration within "${pathTitle}".
    
    - **Content Guidelines:**
        - Ensure all information is accurate, clear, and appropriate for educational purposes.
        - Present the content logically, covering various aspects of "${pathTitle}".
        - The paragraphs should be informative and engaging, suitable for presentation slides.
        - The image prompts should be detailed enough to generate high-quality, relevant images in the **modern minimalist** theme.
    
    - **Restrictions:**
        - Do not include any additional text or explanations outside of the specified format.
        - Do not mention these instructions or acknowledge that you are an AI language model in the output.
        - Do not include any disallowed content such as personal opinions, inappropriate language, or confidential information.
    `;
  
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Please generate slides for the path topic: "${pathTitle}".`,
          },
        ],
        // Ensure the response format matches the updated Response schema
        response_format: zodResponseFormat(Response, "slides"),
      });
  
      return completion.choices[0].message || null;
    } catch (error) {
      console.error("Error fetching completion for path slides:", error);
      return null;
    }
  }

export async function promptImage(prompt: string): Promise<string | null> {
    const apiKey = process.env.OPENAI_API_KEY;
    
    const openai = new OpenAI({
        apiKey,
    });

    try {
        const completion1 = await openai.images.generate({
            model: "dall-e-2",
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