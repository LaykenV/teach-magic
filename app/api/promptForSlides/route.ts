import { NextResponse, NextRequest } from 'next/server';
import { promptGPT, promptImage } from '../../../utils/prompt';
import { getAuth } from '@clerk/nextjs/server';
import { createCreation } from '@/utils/createCreation';
import { Slide } from '@/types/types';

type DataFromPrompt = {
  title_slide: Slide;
  content_slides: Slide[];
  question_slide: Slide;
};

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' });
    }

    console.log(prompt);
    const response = await promptGPT(prompt);
    console.log(response);

    if (response?.content && userId) {
      const parsedResponse: DataFromPrompt = JSON.parse(response.content);
      const { title_slide, content_slides, question_slide } = parsedResponse;
       // Combine the slides into a single array
       const slides: Slide[] = [
        { ...title_slide, slide_type: 'title' },
        ...content_slides.map((slide) => ({
          ...slide,
          slide_type: 'content'
        })),
        { ...question_slide, slide_type: 'question' }
      ];

      let imageSlideCount = 0;
      const imagePromises: Promise<void>[] = [];

      for (const slide of slides) {
        if ((slide.slide_type === 'title' || slide.slide_type === 'content') && 'slide_image_prompt' in slide) {
          if (imageSlideCount < 2) {
            const imagePromise = (async () => {
              const imageUrl = await promptImage(slide.slide_image_prompt);
              slide.slide_image_url = imageUrl || null;
            })();
            imagePromises.push(imagePromise);
            imageSlideCount++;
          } else {
            slide.slide_image_url = null;
          }
        }
        // No action needed for question slides
      }

      await Promise.all(imagePromises);

      console.log(slides);

      const creation = await createCreation({ user_id: userId, slides });
      return NextResponse.json({ success: true, creation });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error });
  }
}
