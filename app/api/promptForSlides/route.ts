import { NextResponse, NextRequest } from 'next/server';
import { generateQuiz, promptGPT, promptImage } from '../../../utils/prompt';
import { getAuth } from '@clerk/nextjs/server';
import { createCreation } from '@/utils/createCreation';
import { Slide, ContentSlide, Quiz, Creation } from '@/types/types';
import { db } from '@/drizzle/db';
import { creationsTable } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

type DataFromPrompt = {
  title_slide: Slide;
  content_slides: Slide[];
};

type DataFromQuiz = {
  questions: Quiz;
};

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming JSON request
    const { prompt } = await request.json();
    const { userId } = getAuth(request);

    // Check if the user is authenticated
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    console.log(`Received prompt: ${prompt}`);

    // Generate content using GPT
    const response = await promptGPT(prompt);
    console.log(`GPT Response: ${JSON.stringify(response)}`);

    

    // Ensure the response contains content
    if (response?.content && userId) {
      // Parse the GPT response
      const parsedResponse: DataFromPrompt = JSON.parse(response.content);
      const { title_slide, content_slides } = parsedResponse;
      const quizPrompt = content_slides as ContentSlide[];

      const quizResponse = await generateQuiz(quizPrompt);
      if (quizResponse?.content) {
        console.log(`Quiz Response: ${JSON.stringify(quizResponse)}`);
      
      const parsedQuizResponse: DataFromQuiz = JSON.parse(quizResponse.content);
      console.log(parsedQuizResponse);
      const { questions } = parsedQuizResponse;

      // Combine the slides into a single array with appropriate slide types
      const slides: Slide[] = [
        { ...title_slide, slide_type: 'title' },
        ...content_slides.map((slide) => ({
          ...slide,
          slide_type: 'content'
        })),
      ];

      // Create a new creation record in the database
      const creation = await createCreation({ user_id: userId, slides, quiz: questions });

      // Prepare promises for image generation and uploading
      const imagePromises: Promise<void>[] = [];

      // Iterate over slides with their indices
      slides.forEach((slide, index) => {
        // Check if the slide is of type 'title' or 'content' and has a slide_image_prompt
        if ((slide.slide_type === 'title' || slide.slide_type === 'content') && 'slide_image_prompt' in slide) {
          const imagePromise = (async () => {
            try {
              // Generate and upload the image, passing the slide index
              const imageUrl = await promptImage(slide.slide_image_prompt, creation.id, index);
              // Assign the returned image URL to the slide
              slide.slide_image_url = imageUrl || null;
            } catch (error) {
              console.error(`Error processing image for slide ${index + 1}:`, error);
              // Optionally, set a default image URL or handle the error as needed
              slide.slide_image_url = null;
            }
          })();
          imagePromises.push(imagePromise);
        }
        // No action needed for 'question' slides
      });

      // Await all image generation and upload promises
      await Promise.all(imagePromises);

      // Log the updated slides with image URLs
      console.log(`Updated slides with image URLs: ${JSON.stringify(slides)}`);

      // Update the creation record in the database with the new slides
      await db.update(creationsTable)
        .set({ slides })
        .where(eq(creationsTable.id, creation.id));

      // Fetch the updated creation record (optional)
      const updatedCreation = await db.select().from(creationsTable).where(eq(creationsTable.id, creation.id)).limit(1).then(res => res[0]);

      const formattedCreation: Creation = {
        id: updatedCreation.id,
        user_id: updatedCreation.user_id,
        created_at: updatedCreation.created_at,
        slides: updatedCreation.slides as Slide[], // Ensure that 'slides' are correctly typed
        quiz: updatedCreation.quiz as Quiz, // Ensure that 'quiz' are correctly typed
    };

      console.log(`Final creation record: ${JSON.stringify(updatedCreation)}`);
      console.log(formattedCreation);

      // Return the updated creation record as a successful response
      return NextResponse.json({ success: true, creation: formattedCreation }, { status: 200 });
    }} else {
      // Handle cases where the GPT response does not contain content
      console.error('Invalid GPT response: Missing content');
      return NextResponse.json({ success: false, error: 'Invalid response from GPT' }, { status: 400 });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    // Return a generic error message to the client
    return NextResponse.json({ success: false, error: 'An unexpected error occurred.' }, { status: 500 });
  }
}