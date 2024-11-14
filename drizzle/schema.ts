// drizzle/schema.ts
import { pgTable, text, integer, jsonb, uuid, timestamp } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  id: text('id').notNull(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  tokens: integer('tokens').default(0),
  subscription_plan: integer('subscription_plan').default(0),
});

export const creationsTable = pgTable('creations', {
    id: uuid('id').primaryKey().default('gen_random_uuid()'), // UUID primary key
    user_id: text('user_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }), // Ensures slides are deleted if the user is deleted
    slides: jsonb('slides').notNull(), // JSONB array to store slides
    created_at: timestamp('created_at').notNull().defaultNow(),
});
  
  export type Creation = {
    id: string;
    user_id: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    slides: any[];
    created_at: Date;
  }


  export type User = typeof usersTable.$inferSelect;