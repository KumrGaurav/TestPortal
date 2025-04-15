import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  isAdmin: boolean("is_admin").default(false).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  isAdmin: true,
});

// Questions schema
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  optionA: text("option_a").notNull(),
  optionB: text("option_b").notNull(),
  optionC: text("option_c").notNull(),
  optionD: text("option_d").notNull(),
  correctOption: text("correct_option").notNull(),
});

export const insertQuestionSchema = createInsertSchema(questions).pick({
  text: true,
  optionA: true,
  optionB: true,
  optionC: true,
  optionD: true,
  correctOption: true,
});

// Test results schema
export const testResults = pgTable("test_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  score: integer("score").notNull(),
  timeTaken: integer("time_taken").notNull(), // in seconds
  completedAt: timestamp("completed_at").notNull(),
  totalQuestions: integer("total_questions").notNull(),
});

export const insertTestResultSchema = createInsertSchema(testResults).pick({
  userId: true,
  score: true,
  timeTaken: true,
  completedAt: true,
  totalQuestions: true,
});

// User answers schema for tracking individual question responses
export const userAnswers = pgTable("user_answers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  questionId: integer("question_id").notNull(),
  selectedOption: text("selected_option").notNull(),
  isCorrect: boolean("is_correct").notNull(),
});

export const insertUserAnswerSchema = createInsertSchema(userAnswers).pick({
  userId: true,
  questionId: true,
  selectedOption: true,
  isCorrect: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Question = typeof questions.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;

export type TestResult = typeof testResults.$inferSelect;
export type InsertTestResult = z.infer<typeof insertTestResultSchema>;

export type UserAnswer = typeof userAnswers.$inferSelect;
export type InsertUserAnswer = z.infer<typeof insertUserAnswerSchema>;
