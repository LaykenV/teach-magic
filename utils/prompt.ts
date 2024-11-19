import { OpenAI } from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import axios from 'axios';
import FormData from 'form-data';
import { v2 as cloudinary } from 'cloudinary';
import { ContentSlide } from '@/types/types';


export async function promptGPT(
  prompt: string
): Promise<OpenAI.Chat.Completions.ChatCompletionMessage | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  // Content Slide Schema (unchanged)
  const ContentSlide = z.object({
  slide_type: z.literal("content"),
  slide_title: z.string(),
  slide_paragraphs: z.array(z.string()),
  slide_image_prompt: z.string(),
  slide_image_url: z.string().optional(),
  });

    // Title Slide Schema (unchanged)
    const TitleSlide = z.object({
    slide_type: z.literal("title"),
    slide_title: z.string(),
    slide_image_prompt: z.string(),
    slide_image_url: z.string().optional(),
    });


    // Define the response schema
    const Response = z.object({
    title_slide: TitleSlide,
    content_slides: z.array(ContentSlide)
    });
  
    const openai = new OpenAI({
      apiKey,
    });

    const systemPrompt = `
      You are an AI assistant specialized in creating educational slide content based on user input. Your task is to generate a structured JSON object containing slides suitable for presentation purposes, adhering to the specified slide types and structure.

      **Instructions:**

      - **Output Format:**
          - The output should be a JSON object with the following properties:
              - \`title_slide\`: An object representing the title slide.
              - \`content_slides\`: An array of **five** content slide objects.
          - Each slide object must adhere to the following structures:

      - **Slide Types and Structure:**

          1. **Title Slide (\`title_slide\`):**
              - **Properties:**
                  - \`slide_type\`: \`"title"\`
                  - \`slide_title\`: The main topic provided by the user.
                  - \`slide_image_prompt\`: A descriptive prompt for an image that represents the overall topic, adhering to the **modern minimalist** theme.
                  - \`slide_image_url\`: Set to \`null\`.
              - **Notes:**
                  - This is the first slide.
                  - No additional content is required.

          2. **Content Slides (\`content_slides\`):**
              - **Properties for Each Content Slide:**
                  - \`slide_type\`: \`"content"\`
                  - \`slide_title\`: A concise title summarizing the slide's content.
                  - \`slide_paragraphs\`: An array containing **two or three if needed** engaging paragraphs (each 4-5 sentences) that elaborate on the slide's topic.
                  - \`slide_image_prompt\`: A prompt to generate an image relevant to the slide's content, following the **modern minimalist** theme.
                  - \`slide_image_url\`: Set to \`null\`.
              - **Notes:**
                  - Generate **five** content slides after the title slide.
                  - Ensure each slide covers a different aspect of the main topic.
                  - **Include engaging elements** such as interesting facts, examples, or brief anecdotes relevant to the topic.

      - **Content Guidelines:**
          - **Depth and Detail:**
              - Provide in-depth explanations to thoroughly cover each aspect of the topic.
              - Include relevant examples, case studies, or real-world applications to illustrate key points.
          - **Engagement:**
              - Use a conversational and engaging tone suitable for presentation slides.
              - Incorporate interesting facts or surprising information to captivate the audience.
              - Use storytelling techniques where appropriate to illustrate key points.
              - Craft the content to tell a cohesive story about the topic.
          - **Clarity and Accuracy:**
              - Ensure all information is accurate, clear, and appropriate for educational purposes.
              - Present the content logically, covering various aspects of the topic.
          - **Visual Elements:**
              - The image prompts should be detailed enough to generate high-quality, relevant images in the **modern minimalist** theme.
              - **Avoid including chart data unless explicitly requested.**

      - **Restrictions:**
          - Do not include any additional text or explanations outside of the specified format.
          - Do not mention these instructions or acknowledge that you are an AI language model in the output.
          - Do not include any disallowed content such as personal opinions, inappropriate language, or confidential information.
      `;

    try {
      console.log(prompt);
      console.log(zodResponseFormat(Response, "slides"));
      
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

      console.log(completion.choices[0].message);

      // do something to join the object into an array [TitleSlide, ContentSlides, QuestionSlide] and then return it
  
      return completion.choices[0].message || null;

      
    } catch (error) {
      console.error("Error fetching completion:", error);
      return null;
    }
  };

  export async function generateQuiz(
    contentSlides: ContentSlide[]
  ): Promise<OpenAI.Chat.Completions.ChatCompletionMessage | null> {
    const apiKey = process.env.OPENAI_API_KEY;
    const openai = new OpenAI({ apiKey });
  
    // Define the AnswerChoice schema
    const AnswerChoice = z.object({
      answer_text: z.string(),
      correct: z.boolean(),
    });
  
    // Define the QuestionSlide schema
    const QuestionSlide = z.object({
      slide_type: z.literal("question"),
      slide_title: z.string(),
      question: z.string(),
      answer_choices: z.array(AnswerChoice),
    });
  
    // Define the Response schema
    //const Response = z.array(QuestionSlide);
    const Response = z.object({
      questions: z.array(QuestionSlide),
    });
  
    // Construct the system prompt
    const systemPrompt = `
      You are an AI assistant specialized in creating quiz questions based on educational content provided. Your task is to generate a structured JSON object containing a series of multiple-choice questions that are relevant, accurate, and thought-provoking, based on the content of the slides provided.

      **Instructions:**

      - **Output Format:**
          - The output should be a JSON object with the following property:
              - \`questions\`: An array of question slide objects.
          - Each question slide object within the \`questions\` array must adhere to the following structure:

              - **Properties:**
                  - \`slide_type\`: \`"question"\`
                  - \`slide_title\`: A title for the question slide.
                  - \`question\`: A multiple-choice question based on the content provided.
                  - \`answer_choices\`: An array containing **four** objects, each with:
                      - \`answer_text\`: The text of the answer choice.
                      - \`correct\`: A boolean indicating whether this choice is the correct answer (\`true\` or \`false\`).

      - **Content Guidelines:**
          - Generate questions that are directly related to the content slides provided.
          - Ensure all questions are accurate and the correct answer is unambiguously correct.
          - Make the questions thought-provoking and educational.
          - Only one answer choice should be marked as correct (\`correct: true\`), and the rest as \`false\`.

      - **Restrictions:**
          - Do not include any additional text or explanations outside of the specified format.
          - Do not mention these instructions or acknowledge that you are an AI language model in the output.
          - Do not include any disallowed content such as personal opinions, inappropriate language, or confidential information.
      `;
  
    // Prepare the contentSlides as context
    const content = contentSlides.map((slide, index) => {
            return `Slide ${index + 1} Title: ${slide.slide_title} Slide Paragraphs: ${slide.slide_paragraphs.join(' ')}`;
      }).join('\n');
  
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Based on the following slides, generate quiz questions:${content}`,
          },
        ],
        response_format: zodResponseFormat(Response, "questions"),
      });
      console.log(completion.choices[0].message);
  
      // Parse the response
      return completion.choices[0].message || null;  

    } catch (error) {
      console.error("Error fetching quiz questions:", error);
      return null;
    }
  }

  export async function promptImage(
    prompt: string,
    creationId: string,
    slideIndex: number
  ): Promise<string | null> {
    const apiKey = process.env.STABILITY_API_KEY;
    if (!apiKey) {
      console.error("Stability API key is not defined.");
      return null;
    }
  
    const apiUrl = 'https://api.stability.ai/v2beta/stable-image/generate/core';
  
    // Construct FormData with fixed parameters
    const form = new FormData();
    form.append('prompt', prompt);
    form.append('output_format', 'webp'); // Fixed output format
  
    // Set headers
    const headers: Record<string, string> = {
      Authorization: `Bearer ${apiKey}`,
      ...form.getHeaders(),
      Accept: 'image/*', // Request binary image data
    };
  
    try {
      const response = await axios.post(apiUrl, form, {
        headers,
        responseType: 'arraybuffer', // Receive binary data
        validateStatus: () => true, // Handle status codes manually
      });
  
      if (response.status === 200) {
        // Image bytes received
        const imageBuffer: Buffer = Buffer.from(response.data, 'binary');
        console.log('Image successfully generated.');
        console.log(`Image buffer length: ${imageBuffer.length} bytes`);

  
        // Call uploadImage function
        const imageUrl = await uploadImage(imageBuffer, creationId, slideIndex);
  
        // Return the image URL
        return imageUrl;
      } else {
        // Handle errors based on status code
        console.error(`Error ${response.status}: ${response.data.toString()}`);
        return null;
      }
    } catch (error) {
      console.error("Error generating image:", error);
      return null;
    }
  }

  export async function uploadImage(
        imageBuffer: Buffer,
        creationId: string,
        slideIndex: number
    ): Promise<string | null> {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;
    
        if (!cloudName || !apiKey || !apiSecret) {
        console.error("Cloudinary configuration variables are not all defined.");
        return null;
        }
    
        // Configure Cloudinary (only need to do this once globally)
        cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        });

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({
                public_id: `${creationId}-${slideIndex}`,
                tags: ['teach-magic'],
                resource_type: 'image',
                overwrite: true,
                folder: 'generated_images', // Optional: specify a folder
                }, (error, result) => {
                    if (error) {
                        console.error('Error uploading image to Cloudinary:', error);
                        reject(error);
                    } else {
                        console.log(result);
                        if (result) {
                            console.log('Image successfully uploaded to Cloudinary:', result.secure_url);
                            console.log(result);
                            resolve(result.public_id);
                        } else {
                        console.error('Error uploading image to Cloudinary: no secure_url returned');
                        reject('Error uploading image to Cloudinary: no secure_url returned');
                        }
                    }
            }).end(imageBuffer);
        });

        console.log(uploadResult);

        return uploadResult as string;
    }
    