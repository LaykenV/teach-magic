// app/api/getCreation/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { db } from '@/drizzle/db'; // Adjust the import path based on your project structure
import { creationsTable } from '@/drizzle/schema'; // Adjust the import path based on your project structure
import { eq, and } from 'drizzle-orm/expressions';
import { Creation } from '@/drizzle/schema'; // Ensure this path is correct

interface GetCreationRequestBody {
  id: string;
}

export async function POST(request: NextRequest) {
  console.log(`[getCreation] Received POST request.`);

  // Authenticate the user
  const { userId } = getAuth(request);
  console.log(`[getCreation] Authenticated userId: ${userId}`);

  if (!userId) {
    console.log(`[getCreation] Unauthorized access attempt.`);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Parse the request body
    const body = await request.json();
    const { id } = body as GetCreationRequestBody;
    console.log(`[getCreation] Received creation id: ${id}`);

    // Validate the 'id'
    if (!id || typeof id !== 'string') {
      console.log(`[getCreation] Invalid or missing 'id' in request body.`);
      return NextResponse.json(
        { error: "Invalid or missing 'id' in request body." },
        { status: 400 }
      );
    }

    // Query the database for the creation with the given 'id' and 'user_id'
    const [creationRecord] = await db
      .select()
      .from(creationsTable)
      .where(
        and(
          eq(creationsTable.id, id),
          eq(creationsTable.user_id, userId)
        )
      );

    console.log(`[getCreation] Query result:`, creationRecord);

    if (!creationRecord) {
      console.log(`[getCreation] Creation not found for id: ${id} and userId: ${userId}`);
      return NextResponse.json({ error: 'Creation not found.' }, { status: 404 });
    }

    // Structure the creation data as per the 'Creation' interface
    const creation: Creation = {
      id: creationRecord.id,
      user_id: creationRecord.user_id,
      created_at: creationRecord.created_at,
      slides: creationRecord.slides as any[], // Ensure that 'slides' are correctly typed
    };

    console.log(`[getCreation] Returning creation data for id: ${id}`);

    // Return the creation data
    return NextResponse.json(creation, { status: 200 });
  } catch (error) {
    console.error('[getCreation] Error fetching creation:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}