import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertTestResultSchema, insertUserAnswerSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get user test results
  app.get("/api/user-results", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const userId = req.user!.id;
      const userResults = await storage.getTestResultsByUser(userId);
      
      const formattedResults = userResults.map(result => ({
        id: result.id,
        score: result.score,
        totalQuestions: result.totalQuestions,
        percentage: Math.round((result.score / result.totalQuestions) * 100),
        timeTaken: result.timeTaken,
        completedAt: result.completedAt,
      })).sort((a, b) => {
        // Sort by most recent first
        return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
      });
      
      res.json(formattedResults);
    } catch (error) {
      console.error("Error fetching user results:", error);
      res.status(500).json({ message: "Failed to fetch user test results" });
    }
  });
  // Setup authentication routes
  setupAuth(app);

  // Get questions for test
  app.get("/api/questions", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const questions = await storage.getQuestions();
      
      // Remove correct answers for security
      const sanitizedQuestions = questions.map(({ correctOption, ...rest }) => rest);
      res.json(sanitizedQuestions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  });

  // Submit test answers
  app.post("/api/submit-test", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const userId = req.user!.id;
    
    try {
      // Validate request body
      const submitSchema = z.object({
        answers: z.array(z.object({
          questionId: z.number(),
          selectedOption: z.string(),
        })),
        timeTaken: z.number(), // in seconds
      });
      
      const validatedData = submitSchema.parse(req.body);
      const { answers, timeTaken } = validatedData;
      
      // Get all questions to check correctness
      const questions = await storage.getQuestions();
      const questionsMap = new Map(
        questions.map(q => [q.id, q])
      );
      
      let score = 0;
      
      // Store individual answers
      for (const answer of answers) {
        const question = questionsMap.get(answer.questionId);
        
        if (question) {
          const isCorrect = question.correctOption === answer.selectedOption;
          if (isCorrect) score++;
          
          await storage.createUserAnswer({
            userId,
            questionId: answer.questionId,
            selectedOption: answer.selectedOption,
            isCorrect,
          });
        }
      }
      
      // Store overall test result
      const testResult = await storage.createTestResult({
        userId,
        score,
        timeTaken,
        completedAt: new Date(),
        totalQuestions: questions.length,
      });
      
      res.status(201).json({
        score,
        totalQuestions: questions.length,
        percentage: Math.round((score / questions.length) * 100),
        timeTaken,
      });
    } catch (error) {
      console.error("Error submitting test:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid submission data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to submit test" });
    }
  });

  // Get leaderboard (available to all users)
  app.get("/api/leaderboard", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const testResults = await storage.getTestResults();
      const users = new Map();
      
      // Get all users who took the test
      for (const result of testResults) {
        if (!users.has(result.userId)) {
          const user = await storage.getUser(result.userId);
          if (user) {
            // Remove password from user data
            const { password, ...userData } = user;
            users.set(result.userId, userData);
          }
        }
      }
      
      // Format leaderboard data
      const leaderboard = testResults.map(result => {
        const user = users.get(result.userId);
        return {
          id: result.id,
          user: user || { id: result.userId, username: "Unknown", email: "Unknown" },
          score: result.score,
          totalQuestions: result.totalQuestions,
          percentage: Math.round((result.score / result.totalQuestions) * 100),
          timeTaken: result.timeTaken,
          completedAt: result.completedAt,
        };
      }).sort((a, b) => {
        // Sort by score (desc), then by time taken (asc)
        if (b.score !== a.score) return b.score - a.score;
        return a.timeTaken - b.timeTaken;
      });
      
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
