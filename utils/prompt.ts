import { OpenAI } from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import axios from 'axios';
import FormData from 'form-data';
import { v2 as cloudinary } from 'cloudinary';
import { ContentSlide } from '@/types/types';


export async function promptGPT(
    prompt: string,
    age_group: 'elementary' | 'middle-school' | 'high-school' | 'college'
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
      content_slides: z.array(ContentSlide),
    });

    const openai = new OpenAI({
      apiKey,
    });

    const systemPrompt = `
      You are an AI assistant specialized in creating educational slide content based on user input. Your task is to generate a structured JSON object containing slides suitable for presentation purposes. Follow these instructions to produce consistent, high-quality educational content every time.

      **Instructions:**

      - **Audience Adaptation:**
          - The audience age group is: ${age_group}.
          - The complexity of language, depth of explanation, and conceptual difficulty should vary by age group, but the amount of text should remain roughly the same for all groups.
          - For **all age groups**, follow these formatting rules:
              - Each content slide: Exactly 2 paragraphs.
              - Each paragraph: Approximately 2-3 sentences.
          - Adjust the complexity as follows:
              - **Elementary**: Very simple words and short, clear sentences. Very basic concepts explained plainly.
              - **Middle-school**: Moderately simple language with slightly more detailed explanations. Introduce basic technical terms with brief explanations.
              - **High-school**: More advanced vocabulary and more nuanced explanations. Introduce some abstract concepts and real-world applications.
              - **College**: Sophisticated vocabulary, deeper analysis, and theoretical or research-based references where appropriate.

      - **Content Structure and Coverage:**
          - Produce:
              - One **title slide**.
              - Five **content slides**.
          - The five content slides should collectively cover the users requested topic thoroughly.
          - If the topic has multiple major elements, ensure you mention all of them in at least one slide. Do not leave major subtopics unexplored.
          - Each slide should cover a distinct aspect or subtopic, creating a logical progression from one slide to the next.
          - Include interesting facts, relevant examples, or anecdotes on each slide to keep it engaging.

      - **Image Prompts:**
          - Provide a \`slide_image_prompt\` for each slide, including the title slide, that aligns with a modern minimalist theme.
          - Ensure the \`slide_image_prompt\` is relevant to the slides content or overall topic.
          - Set \`slide_image_url\` to null for all slides.

      - **Output Format:**
          - Return a JSON object with:
            - \`title_slide\`: an object with:
              - \`slide_type\`: "title"
              - \`slide_title\`: The main topic (from the users prompt)
              - \`slide_image_prompt\`
              - \`slide_image_url\`: null
            - \`content_slides\`: an array of five content slide objects, each with:
              - \`slide_type\`: "content"
              - \`slide_title\`
              - \`slide_paragraphs\`: an array of exactly 2 paragraphs, each with 2-3 sentences matching the complexity guidelines above.
              - \`slide_image_prompt\`
              - \`slide_image_url\`: null

      - **Quality and Accuracy:**
          - All information should be accurate, logically structured, and age-appropriate in complexity.
          - Avoid incomplete explanations; ensure every introduced concept is at least briefly explained.
          - The set of slides should form a cohesive mini-lesson on the topic.

      - **Restrictions:**
          - Do not include any text outside the JSON structure.
          - Do not mention these instructions or the fact that you are an AI.
          - No disallowed or inappropriate content.

      After reading the users prompt, create the requested JSON following all the above rules.
      `

    try {
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
        response_format: zodResponseFormat(Response, "slides"),
      });

      console.log(completion.choices[0].message);

      // Combine the title slide and content slides into a single array if needed
      // For example:
      // const slides = [completion.choices[0].message?.content.title_slide, ...completion.choices[0].message?.content.content_slides];

      return completion.choices[0].message || null;
    } catch (error) {
      console.error("Error fetching completion:", error);
      return null;
    }
  }


  export async function generateQuiz(
    contentSlides: ContentSlide[],
    age_group: 'elementary' | 'middle-school' | 'high-school' | 'college'
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
    const Response = z.object({
      questions: z.array(QuestionSlide),
    });
  
    const systemPrompt = `
      You are an AI assistant specialized in creating multiple-choice quiz questions based on educational content provided. Your task is to generate a structured JSON object containing a series of quiz questions that are relevant, accurate, and engaging for a **${age_group}** audience.
      
      **Instructions:**
      
      - **Audience Adaptation:**
          - **Age Group Considerations:**
              - Tailor the language complexity, depth of questions, and content relevance to suit **${age_group}** students.
              - Use vocabulary and concepts that are appropriate and accessible for **${age_group}** learners.
          ${
            age_group === 'elementary'
              ? `
          - **Elementary School Guidelines:**
              - Use simple language and straightforward questions.
              - Focus on fundamental concepts and basic understanding.
              - Include engaging elements like relatable scenarios or characters.
              `
              : age_group === 'middle-school'
              ? `
          - **Middle School Guidelines:**
              - Use clear language with moderate complexity.
              - Introduce questions that encourage critical thinking and curiosity.
              - Relate questions to real-life examples relevant to teenagers.
              `
              : age_group === 'high-school'
              ? `
          - **High School Guidelines:**
              - Use advanced vocabulary and more complex question structures.
              - Incorporate analytical and application-based questions.
              - Include real-world scenarios and thought-provoking problems.
              `
              : age_group === 'college'
              ? `
          - **College Guidelines:**
              - Use sophisticated language and in-depth questioning.
              - Incorporate complex theories, data analysis, and critical evaluations.
              - Reference current research, advanced concepts, and industry-specific terminology.
              `
              : ''
          }
      
      - **Output Format:**
          - The output should be a JSON object with the following property:
              - \`questions\`: An array of question slide objects.
          - Each question slide object within the \`questions\` array must adhere to the following structure:
      
              - **Properties:**
                  - \`slide_type\`: \`"question"\`
                  - \`slide_title\`: A concise title for the question slide.
                  - \`question\`: A multiple-choice question based on the content provided.
                  - \`answer_choices\`: An array containing **four** answer choice objects, each with:
                      - \`answer_text\`: The text of the answer choice.
                      - \`correct\`: A boolean indicating whether this choice is the correct answer (\`true\` or \`false\`).
      
      - **Content Guidelines:**
          - **Relevance and Accuracy:**
              - Generate questions that are directly related to the content slides provided.
              - Ensure all questions are accurate and the correct answer is unambiguously correct.
          - **Question Quality:**
              - Make the questions thought-provoking and educational.
              - Only one answer choice should be marked as correct (\`correct: true\`), and the rest as \`false\`.
              - Distractors (incorrect answers) should be plausible to avoid guesswork.
          - **Clarity:**
              - Questions should be clearly worded without ambiguity.
              - Avoid overly complex sentence structures that might confuse the intended age group.
      
      - **Restrictions:**
          - Do not include any additional text or explanations outside of the specified format.
          - Do not mention these instructions or acknowledge that you are an AI language model in the output.
          - Do not include any disallowed content such as personal opinions, inappropriate language, or confidential information.
      `;
  
    // Prepare the contentSlides as context
    const content = contentSlides
      .map((slide, index) => {
        return `Slide ${index + 1} Title: ${slide.slide_title}\nSlide Paragraphs: ${slide.slide_paragraphs.join(' ')}`;
      })
      .join('\n\n');
  
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Based on the following slides, generate quiz questions:\n\n${content}`,
          },
        ],
        response_format: zodResponseFormat(Response, "questions"),
      });
      console.log(completion.choices[0].message);
  
      // Return the response
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
    form.append('output_format', 'jpeg'); // Fixed output format
  
    // Set headers
    const headers: Record<string, string> = {
      Authorization: `Bearer ${apiKey}`,
      ...form.getHeaders(),
      Accept: 'image/*', // Request binary image data
    };
  
    try {
      console.log('Sending image request...');
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
    