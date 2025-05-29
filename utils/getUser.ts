"use server"
import cache from '../lib/cache';
import { db } from '@/drizzle/db';
import { eq } from 'drizzle-orm/expressions';
import { User, usersTable } from '@/drizzle/schema';
import { UserEntry } from '@/types/types';

// Define cache duration in milliseconds (e.g., 24 hours)
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours

export async function getUser(userId: string, email: string, name: string): Promise<User> {
  const cacheKey = `user-${userId}`;

  // Attempt to retrieve from cache
  const cachedUser = cache.get(cacheKey);
  if (cachedUser) {
    console.log(`Cache hit for user key: ${cacheKey}`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedUser: User = {
        id: cachedUser.id,
        tokens: cachedUser.tokens,
        email: cachedUser.email,
        name: cachedUser.name,
        created_at: cachedUser.created_at,
        subscription_plan: cachedUser.subscription_plan,
    };

    return formattedUser;
  }

  console.log(`Cache miss for key: ${cacheKey}. Fetching from DB...`);

  // Fetch from database
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId));

  if (!user) {

    const userEntry: UserEntry = {
        id: userId,
        email: email,
        name: name,
      };

      await db.insert(usersTable).values(userEntry).onConflictDoNothing();

      const [newUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId));

      console.log(newUser);

      const formattedUser: User = {
        id: newUser.id,
        tokens: newUser.tokens,
        email: newUser.email,
        name: newUser.name,
        created_at: newUser.created_at,
        subscription_plan: newUser.subscription_plan,
    };

    // Store in cache
    cache.put(cacheKey, formattedUser, CACHE_DURATION);

    return formattedUser;
    }
  

    // Format the data
      const formattedUser: User = {
        id: user.id,
        tokens: user.tokens,
        email: user.email,
        name: user.name,
        created_at: user.created_at,
        subscription_plan: user.subscription_plan,
    };

  // Store in cache
  cache.put(cacheKey, formattedUser, CACHE_DURATION);

  return formattedUser;
}