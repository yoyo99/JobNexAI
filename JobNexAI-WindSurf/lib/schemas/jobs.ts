import { pgTable, text, timestamp, uuid, varchar, integer, boolean, jsonb } from 'drizzle-orm/pg-core';
import { users } from './users';

// Schéma de la table des offres d'emploi
export const jobs = pgTable('jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 200 }).notNull(),
  company: varchar('company', { length: 100 }).notNull(),
  description: text('description').notNull(),
  location: varchar('location', { length: 100 }),
  salary: varchar('salary', { length: 100 }),
  contractType: varchar('contract_type', { length: 50 }), // CDI, CDD, Freelance, Stage, etc.
  remote: boolean('remote').default(false),
  skills: jsonb('skills'),
  requirements: jsonb('requirements'),
  benefits: jsonb('benefits'),
  applicationUrl: text('application_url'),
  contactEmail: varchar('contact_email', { length: 255 }),
  postedById: uuid('posted_by_id').references(() => users.id),
  status: varchar('status', { length: 20 }).default('active'),
  views: integer('views').default(0),
  applicationsCount: integer('applications_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  expiresAt: timestamp('expires_at'),
});

// Table des candidatures
export const applications = pgTable('applications', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobId: uuid('job_id').notNull().references(() => jobs.id),
  userId: uuid('user_id').notNull().references(() => users.id),
  coverLetter: text('cover_letter'),
  resumeUrl: text('resume_url'),
  status: varchar('status', { length: 20 }).default('pending'),
  feedback: text('feedback'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Types pour TypeScript
export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;

export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
