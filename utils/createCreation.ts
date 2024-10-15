import { db } from '@/drizzle/db';
import { creationsTable, Creation } from '@/drizzle/schema';
import { CreationEntry } from '@/types/types';


/**
 * Inserts a new creation into the creations table.
 *
 * @param creation - The creation data to insert.
 * @returns The inserted creation record.
 * @throws Error if the insertion fails.
 */
export async function createCreation(creation: CreationEntry): Promise<Creation> {
  try {
    const [newCreation] = await db
      .insert(creationsTable)
      .values({
        user_id: creation.user_id,
        slides: JSON.stringify(creation.slides), // Ensure slides are serialized as JSON
      })
      .returning();

    return newCreation;
  } catch (error) {
    console.error('Error inserting creation:', error);
    throw new Error('Failed to create creation.');
  }
}