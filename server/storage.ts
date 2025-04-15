import session from "express-session";
import createMemoryStore from "memorystore";
import { 
  User, InsertUser, 
  Question, InsertQuestion, 
  TestResult, InsertTestResult,
  UserAnswer, InsertUserAnswer
} from "@shared/schema";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Question methods
  getQuestions(): Promise<Question[]>;
  getQuestion(id: number): Promise<Question | undefined>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  
    // Test result methods
    createTestResult(result: InsertTestResult): Promise<TestResult>;
    getTestResults(): Promise<TestResult[]>;
    getTestResultsByUser(userId: number): Promise<TestResult[]>;
    
    // User answers methods
    createUserAnswer(answer: InsertUserAnswer): Promise<UserAnswer>;
    getUserAnswers(userId: number): Promise<UserAnswer[]>;
    
    // Session store
    sessionStore: session.Store;
  }
  
  export class MemStorage implements IStorage {
    private users: Map<number, User>;
    private questions: Map<number, Question>;
    private testResults: Map<number, TestResult>;
    private userAnswers: Map<number, UserAnswer>;
    sessionStore: session.Store;
    
    currentUserId: number;
  currentQuestionId: number;
  currentTestResultId: number;
  currentUserAnswerId: number;

  constructor() {
    this.users = new Map();
    this.questions = new Map();
    this.testResults = new Map();
    this.userAnswers = new Map();
    
    this.currentUserId = 1;
    this.currentQuestionId = 1;
    this.currentTestResultId = 1;
    this.currentUserAnswerId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Initialize with admin user
    this.createUser({
      username: "admin",
      password: "adminpassword", // This will be hashed by auth.ts
      email: "admin@example.com",
      isAdmin: true
    });
    
    // Initialize with sample questions
    this.initializeQuestions();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, isAdmin: insertUser.isAdmin ?? false };
    this.users.set(id, user);
    return user;
  }
  
  async getQuestions(): Promise<Question[]> {
    return Array.from(this.questions.values());
  }
  
  async getQuestion(id: number): Promise<Question | undefined> {
    return this.questions.get(id);
  }
  
  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const id = this.currentQuestionId++;
    const question: Question = { ...insertQuestion, id };
    this.questions.set(id, question);
    return question;
  }
  
  async createTestResult(insertTestResult: InsertTestResult): Promise<TestResult> {
    const id = this.currentTestResultId++;
    const testResult: TestResult = { ...insertTestResult, id };
    this.testResults.set(id, testResult);
    return testResult;
  }
  
  async getTestResults(): Promise<TestResult[]> {
    return Array.from(this.testResults.values());
  }
  
  async getTestResultsByUser(userId: number): Promise<TestResult[]> {
    return Array.from(this.testResults.values()).filter(
      (result) => result.userId === userId
    );
  }
  
  async createUserAnswer(insertUserAnswer: InsertUserAnswer): Promise<UserAnswer> {
    const id = this.currentUserAnswerId++;
    const userAnswer: UserAnswer = { ...insertUserAnswer, id };
    this.userAnswers.set(id, userAnswer);
    return userAnswer;
  }
  
  async getUserAnswers(userId: number): Promise<UserAnswer[]> {
    return Array.from(this.userAnswers.values()).filter(
      (answer) => answer.userId === userId
    );
  }
  
  private async initializeQuestions() {
    const sampleQuestions: InsertQuestion[] = [
      {
        text: "What is the capital city of France?",
        optionA: "Paris",
        optionB: "London",
        optionC: "Berlin",
        optionD: "Rome",
        correctOption: "A"
      },
      {
        text: "Which planet is known as the Red Planet?",
        optionA: "Venus",
        optionB: "Jupiter",
        optionC: "Mars",
        optionD: "Saturn",
        correctOption: "C"
      },
      {
        text: "What is the chemical symbol for gold?",
        optionA: "Go",
        optionB: "Gd",
        optionC: "Gl",
        optionD: "Au",
        correctOption: "D"
      },
      {
        text: "Who wrote 'Romeo and Juliet'?",
        optionA: "Charles Dickens",
        optionB: "William Shakespeare",
        optionC: "Jane Austen",
        optionD: "Mark Twain",
        correctOption: "B"
      },
      {
        text: "What is the largest ocean on Earth?",
        optionA: "Atlantic Ocean",
        optionB: "Indian Ocean",
        optionC: "Arctic Ocean",
        optionD: "Pacific Ocean",
        correctOption: "D"
      },
      {
        text: "Which element has the chemical symbol 'O'?",
        optionA: "Oxygen",
        optionB: "Osmium",
        optionC: "Oganesson",
        optionD: "Oregano",
        correctOption: "A"
      },
      {
        text: "What is the square root of 144?",
        optionA: "10",
        optionB: "12",
        optionC: "14",
        optionD: "16",
        correctOption: "B"
      },
      {
        text: "Which country is known as the Land of the Rising Sun?",
        optionA: "China",
        optionB: "Thailand",
        optionC: "Japan",
        optionD: "Korea",
        correctOption: "C"
      },
      {
        text: "Who painted the Mona Lisa?",
        optionA: "Pablo Picasso",
        optionB: "Vincent van Gogh",
        optionC: "Michelangelo",
        optionD: "Leonardo da Vinci",
        correctOption: "D"
      },
      {
        text: "What is the currency of Japan?",
        optionA: "Yuan",
        optionB: "Won",
        optionC: "Yen",
        optionD: "Ringgit",
        correctOption: "C"
      }
    ];
    
    for (const question of sampleQuestions) {
      await this.createQuestion(question);
    }
  }
}

export const storage = new MemStorage();
