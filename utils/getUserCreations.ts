"use server"
import cache from '../lib/cache';
import { db } from '@/drizzle/db';
import { eq } from 'drizzle-orm/expressions';
import { creationsTable } from '@/drizzle/schema';
import { Creation } from '@/types/types';

// Define cache duration in milliseconds (e.g., 24 hours)
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours

export async function getUserCreations(userId: string): Promise<Creation[]> {
  const cacheKey = `user-creations-${userId}`;

  // Attempt to retrieve from cache
  const cachedCreations = cache.get(cacheKey);
  if (cachedCreations) {
    console.log(`Cache hit for key: ${cacheKey}`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedFromCache: Creation[] = cachedCreations.map((creation: any) => ({
        id: creation.id,
        user_id: creation.user_id,
        slides: creation.slides,
        quiz: creation.quiz,
        created_at: creation.created_at,
        age_group: creation.age_group,
      }));

      return formattedFromCache;
  }

  console.log(`Cache miss for key: ${cacheKey}. Fetching from DB...`);

  // Fetch from database
  const userCreations = await db
    .select()
    .from(creationsTable)
    .where(eq(creationsTable.user_id, userId));

  // Format the data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formattedCreations: Creation[] = userCreations.map((creation: any) => ({
    id: creation.id,
    user_id: creation.user_id,
    slides: creation.slides,
    quiz: creation.quiz,
    created_at: creation.created_at,
    age_group: creation.age_group,
  }));

  // Store in cache
  cache.put(cacheKey, formattedCreations, CACHE_DURATION);

  return formattedCreations;
}