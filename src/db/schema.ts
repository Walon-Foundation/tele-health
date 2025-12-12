import { pgTable, text, timestamp, uuid, integer, boolean, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table (anonymous users with locally stored credentials)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: text('username').notNull(),
  avatar: integer('avatar').notNull(),
  ageRange: text('age_range'),
  gender: text('gender'),
  topics: jsonb('topics').$type<string[]>().notNull(),
  role: text('role').notNull().default('user'), // 'user' | 'counselor' | 'doctor'
  specialties: jsonb('specialties').$type<string[]>(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Conversations table
export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  counselorId: uuid('counselor_id').references(() => users.id, { onDelete: 'set null' }),
  topics: jsonb('topics').$type<string[]>().notNull(),
  status: text('status').notNull().default('active'), // 'active' | 'closed' | 'waiting'
  assignmentRequested: boolean('assignment_requested').notNull().default(false),
  priority: text('priority').notNull().default('normal'), // 'low' | 'normal' | 'high' | 'urgent'
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Messages table
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  senderId: uuid('sender_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  senderType: text('sender_type').notNull(), // 'user' | 'counselor'
  contentType: text('content_type').notNull(), // 'text' | 'voice'
  content: text('content').notNull(), // Text or audio URL
  voiceDuration: integer('voice_duration'), // in seconds
  isRead: boolean('is_read').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Assignment requests table
export const assignmentRequests = pgTable('assignment_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  requestedCounselorId: uuid('requested_counselor_id').references(() => users.id, { onDelete: 'set null' }),
  status: text('status').notNull().default('pending'), // 'pending' | 'accepted' | 'rejected'
  message: text('message'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  respondedAt: timestamp('responded_at'),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  conversations: many(conversations),
  counselorConversations: many(conversations),
  messages: many(messages),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  user: one(users, {
    fields: [conversations.userId],
    references: [users.id],
  }),
  counselor: one(users, {
    fields: [conversations.counselorId],
    references: [users.id],
  }),
  messages: many(messages),
  assignmentRequests: many(assignmentRequests),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}));

export const assignmentRequestsRelations = relations(assignmentRequests, ({ one }) => ({
  conversation: one(conversations, {
    fields: [assignmentRequests.conversationId],
    references: [conversations.id],
  }),
  requestedCounselor: one(users, {
    fields: [assignmentRequests.requestedCounselorId],
    references: [users.id],
  }),
}));
