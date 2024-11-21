import { db } from '@/drizzle/db';
import { creationsTable, usersTable } from '@/drizzle/schema';
import { Creation } from '@/types/types';
import { CreationEntry, Slide, Quiz } from '@/types/types';
import { eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

/**
 * Inserts a new creation into the creations table and conditionally deducts 1 token from the user's tokens.
 *
 * @param creation - The creation data to insert.
 * @returns The inserted creation record.
 * @throws Error if the insertion or token deduction fails.
 */
export async function createCreation(creation: CreationEntry): Promise<Creation> {
  try {
    // 1. Insert the new creation into the creationsTable
    const [newCreation] = await db
      .insert(creationsTable)
      .values({
        user_id: creation.user_id,
        slides: JSON.stringify(creation.slides), // Serialize slides as JSON
        quiz: JSON.stringify(creation.quiz),     // Serialize quiz as JSON
        age_group: creation.age_group,
      })
      .returning();

    // 2. Fetch the user's current token count
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, creation.user_id))
      .limit(1); // Ensure only one record is fetched

    // 3. Check if the user has 1 or more tokens
    if (user && user.tokens && user.tokens > 0) {
      // 4. Deduct 1 token from the user's tokens
      const [updatedUser] = await db
        .update(usersTable)
        .set({
          tokens: sql`${usersTable.tokens} - 1`, // Subtract 1 from tokens
        })
        .where(eq(usersTable.id, creation.user_id))
        .returning();

      // 5. Verify that the token deduction was successful
      if (!updatedUser) {
        console.warn('Failed to deduct tokens from the user.');
      } else {
        console.log(`Deducted 1 token from user ID: ${creation.user_id}`);
      }
    } else {
      // Handle cases where the user has insufficient tokens
      console.log(`User ID: ${creation.user_id} has insufficient tokens. No tokens deducted.`);
    }

    // 6. Structure the creation data as per the 'Creation' interface
    const formattedCreation: Creation = {
      id: newCreation.id,
      user_id: newCreation.user_id,
      created_at: newCreation.created_at,
      slides: newCreation.slides as Slide[], // Deserialize slides
      quiz: newCreation.quiz as Quiz,       // Deserialize quiz
      age_group: newCreation.age_group,
    };

    return formattedCreation;
  } catch (error) {
    console.error('Error creating creation and deducting tokens:', error);
    throw new Error('Failed to create creation and deduct tokens.');
  }
}