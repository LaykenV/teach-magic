import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { db } from '@/drizzle/db'; // Adjust the import path based on your project structure
import { creationsTable } from '@/drizzle/schema'; // Adjust the import path based on your project structure
import { eq, and } from 'drizzle-orm/expressions';
import { v2 as cloudinary } from 'cloudinary';
import { Slide } from '@/types/types';
import cache from '@/lib/cache';


export async function DELETE(request: NextRequest) {
  console.log(`[deleteCreation] Received DELETE request.`);

  // Authenticate the user
  const { userId } = getAuth(request);
  console.log(`[deleteCreation] Authenticated userId: ${userId}`);

  if (!userId) {
    console.log(`[deleteCreation] Unauthorized access attempt.`);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id: string | null = searchParams.get('id');
    // Parse the request body
    //const body = await request.json();
    //const { id } = body as DeleteCreationRequestBody;
    console.log(`[deleteCreation] Received creation id: ${id}`);

    // Validate the 'id'
    if (!id || typeof id !== 'string') {
      console.log(`[deleteCreation] Invalid or missing 'id' in request body.`);
      return NextResponse.json(
        { error: "Invalid or missing 'id' in request body." },
        { status: 400 }
      );
    }

    // Attempt to delete the creation with the given 'id' and 'user_id'
    const deleteResult = await db
      .delete(creationsTable)
      .where(
        and(
          eq(creationsTable.id, id),
          eq(creationsTable.user_id, userId)
        )
      ).returning();

    console.log(`[deleteCreation] Delete result:`, deleteResult);

    if (deleteResult.length === 0) {
      console.log(`[deleteCreation] No creation found to delete for id: ${id} and userId: ${userId}`);
      return NextResponse.json({ error: 'Creation not found or already deleted.' }, { status: 404 });
    }

    console.log(`[deleteCreation] Successfully deleted creation with id: ${id}`);

    const imgUrls: string[] = [];
    const slides: Slide[] = deleteResult[0].slides as [];
    slides.forEach(element => {
      if ('slide_image_url' in element && element.slide_image_url && element.slide_image_url !== null) {
        imgUrls.push(element.slide_image_url);
      }
    });

    // delete images??
    cloudinary.api.delete_resources(imgUrls, {resource_type: 'image'}).then(result => console.log(result));

    // invalidate user creations cache
    const cacheKey = `user-creations-${userId}`;
    cache.del(cacheKey);

    // Return a success response
    return NextResponse.json({ message: 'Creation deleted successfully.' }, { status: 200 });
  } catch (error) {
    console.error('[deleteCreation] Error deleting creation:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}