// app/api/generateImage/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { db } from '@/drizzle/db'; // Adjust the import path based on your project structure
import { creationsTable } from '@/drizzle/schema'; // Adjust the import path based on your project structure
import { eq, and } from 'drizzle-orm/expressions';
import { promptImage } from '@/utils/prompt'; // Ensure this path is correct
import { Slide } from '@/types/types';

export async function POST(request: NextRequest) {
  console.log(`[generateImage] Received POST request.`);

  // Authenticate the user
  const { userId } = getAuth(request);
  console.log(`[generateImage] Authenticated userId: ${userId}`);

  if (!userId) {
    console.log(`[generateImage] Unauthorized access attempt.`);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Parse the request body
    const body = await request.json();
    const { creationId, slideIndex, slideImagePrompt } = body;

    console.log(`[generateImage] Received creationId: ${creationId}, slideIndex: ${slideIndex}`);

    // Validate the request data
    if (!creationId || typeof creationId !== 'string') {
      console.log(`[generateImage] Invalid or missing 'creationId' in request body.`);
      return NextResponse.json({ error: 'Invalid or missing "creationId".' }, { status: 400 });
    }

    if (slideIndex === undefined || typeof slideIndex !== 'number') {
      console.log(`[generateImage] Invalid or missing 'slideIndex' in request body.`);
      return NextResponse.json({ error: 'Invalid or missing "slideIndex".' }, { status: 400 });
    }

    if (!slideImagePrompt || typeof slideImagePrompt !== 'string') {
      console.log(`[generateImage] Invalid or missing 'slideImagePrompt' in request body.`);
      return NextResponse.json({ error: 'Invalid or missing "slideImagePrompt".' }, { status: 400 });
    }

    // Query the database for the creation with the given 'creationId' and 'user_id'
    const [creationRecord] = await db
      .select()
      .from(creationsTable)
      .where(
        and(
          eq(creationsTable.id, creationId),
          eq(creationsTable.user_id, userId)
        )
      );

    console.log(`[generateImage] Query result:`, creationRecord);

    if (!creationRecord) {
      console.log(`[generateImage] Creation not found for id: ${creationId} and userId: ${userId}`);
      return NextResponse.json({ error: 'Creation not found.' }, { status: 404 });
    }

    // Clone and update the slides array
    const updatedSlides = [...(creationRecord.slides as Slide[])];

    // Generate the image
    const imageUrl = await promptImage(slideImagePrompt);
    console.log(`[generateImage] Generated image URL: ${imageUrl}`);

    // Update the specific slide
    if (updatedSlides[slideIndex] && 'slide_image_url' in updatedSlides[slideIndex]) {
      updatedSlides[slideIndex].slide_image_url = imageUrl;
    } else {
      console.log(`[generateImage] Slide index ${slideIndex} out of bounds.`);
      return NextResponse.json({ error: 'Slide index out of bounds.' }, { status: 400 });
    }

    // Update the database with the new slides array
    await db
      .update(creationsTable)
      .set({ slides: updatedSlides })
      .where(eq(creationsTable.id, creationId));

    console.log(`[generateImage] Updated slides in the database.`);

    // Return the updated slide
    return NextResponse.json(updatedSlides[slideIndex], { status: 200 });
  } catch (error) {
    console.error('[generateImage] Error generating image:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}