
import { NextResponse } from 'next/server';
import { promptGPT, promptFirst2Images } from '../../../utils/prompt';

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();
        console.log(prompt);
        const response = await promptGPT(prompt);
        console.log(response);
        let imageUrls = null;
        if (response?.content) {
            const parsedResponse = JSON.parse(response.content);
            imageUrls = await promptFirst2Images([parsedResponse.slides[0].slide_image_prompt, parsedResponse.slides[1].slide_image_prompt]);
            console.log(imageUrls);
        }
        return NextResponse.json({ success: true, response, imageUrls });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: error });
    }   
}