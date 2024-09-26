import { NextResponse } from 'next/server';
import { promptGPT } from '../../../utils/prompt';

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();
        console.log(prompt);
        const response = await promptGPT(prompt);
        console.log(response);
        return NextResponse.json({ success: true, response });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: error });
    }
}