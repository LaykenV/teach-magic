// lib/getUserCreations.ts
//import cache from '../lib/cache';
import { db } from '@/drizzle/db';
import { eq } from 'drizzle-orm/expressions';
import { creationsTable } from '@/drizzle/schema';
import { Creation } from '@/types/types';

// Define cache duration in milliseconds (e.g., 24 hours)
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours

export async function getUserCreations(userId: string): Promise<Creation[]> {
  /*const cacheKey = `user-creations-${userId}`;

  // Attempt to retrieve from cache
  const cachedCreations = cache.get(cacheKey);
  if (cachedCreations) {
    console.log(`Cache hit for key: ${cacheKey}`);

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

  console.log(`Cache miss for key: ${cacheKey}. Fetching from DB...`);*/

  // Fetch from database
  const userCreations = await db
    .select()
    .from(creationsTable)
    .where(eq(creationsTable.user_id, userId));

  // Format the data
  const formattedCreations: Creation[] = userCreations.map((creation: any) => ({
    id: creation.id,
    user_id: creation.user_id,
    slides: creation.slides,
    quiz: creation.quiz,
    created_at: creation.created_at,
    age_group: creation.age_group,
  }));

  // Store in cache
  /*cache.put(cacheKey, formattedCreations, CACHE_DURATION, (key, value) => {
    console.log(`Cache entry expired for key: ${key}`);
  });*/

  return formattedCreations;
}