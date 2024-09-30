import { NextResponse } from 'next/server';
import { promptGPT, promptFirstImage } from '../../../utils/prompt';

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();
        console.log(prompt);
        const response = await promptGPT(prompt);
        console.log(response);
        let imageUrl = null;
        if (response?.content) {
            const parsedResponse = JSON.parse(response.content);
            imageUrl = await promptFirstImage(parsedResponse.slides[0].slide_image_prompt);
            console.log(imageUrl);
        }
        return NextResponse.json({ success: true, response, imageUrl });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: error });
    }
}