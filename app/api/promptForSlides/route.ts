
import { NextResponse, NextRequest } from 'next/server';
import { promptGPT, promptImage } from '../../../utils/prompt';
import { getAuth } from '@clerk/nextjs/server';
import { createCreation } from '@/utils/createCreation';


export async function POST(request: NextRequest) {
    try {
        const { prompt } = await request.json();
        const {userId} = getAuth(request);
        if (!userId) {
            NextResponse.json({ success: false, error: 'Unauthorized' });
        }
        console.log(prompt);
        const response = await promptGPT(prompt);
        console.log(response);
        let imageUrls = null;
        if (response?.content && userId) {
            const parsedResponse = JSON.parse(response.content);
            let slides = parsedResponse.slides;

            const initialImagePromises = slides.slice(0, 2).map(async (slide: any) => {
                const imageUrl = await promptImage(slide.slide_image_prompt);
                slide.slide_image_url = imageUrl;
              });

            await Promise.all(initialImagePromises);

            for (let i = 2; i < slides.length; i++) {
                slides[i].slide_image_url = null;
            }

            console.log(slides);

            const creation = await createCreation({ user_id: userId, slides });
            return NextResponse.json({ success: true, creation });

        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: error });
    }   
}