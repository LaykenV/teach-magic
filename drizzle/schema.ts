// drizzle/schema.ts
import { pgTable, text, integer, jsonb, uuid, timestamp } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  id: text('id').notNull(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  tokens: integer('tokens').default(3),
  subscription_plan: integer('subscription_plan').default(0),
});

export const creationsTable = pgTable('creations', {
    id: uuid('id').primaryKey().default('gen_random_uuid()'), // UUID primary key
    user_id: text('user_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }), // Ensures slides are deleted if the user is deleted
    slides: jsonb('slides').notNull(), // JSONB array to store slides
    quiz: jsonb('quiz').notNull(), // JSONB array to store quiz questions
    created_at: timestamp('created_at').notNull().defaultNow(),
    age_group: text('age_group').notNull()
});


  export type User = typeof usersTable.$inferSelect;