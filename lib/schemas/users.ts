import { pgTable, text, timestamp, uuid, varchar, boolean, jsonb } from 'drizzle-orm/pg-core';

// Schéma de la table des utilisateurs
export const users = pgTable('users', {
  id: uuid('id').primaryKey().notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  avatarUrl: text('avatar_url'),
  isActive: boolean('is_active').default(true),
  role: varchar('role', { length: 50 }).default('user'),
  preferences: jsonb('preferences'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Schéma de la table des profils utilisateurs
export const profiles = pgTable('profiles', {
  userId: uuid('user_id').primaryKey().references(() => users.id),
  title: varchar('title', { length: 100 }),
  bio: text('bio'),
  location: varchar('location', { length: 100 }),
  website: text('website'),
  skills: jsonb('skills'),
  experience: jsonb('experience'),
  education: jsonb('education'),
  languages: jsonb('languages'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Types pour TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
