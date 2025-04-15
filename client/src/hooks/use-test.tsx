import { createContext, ReactNode, useContext, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "./use-toast";

interface Question {
  id: number;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
}

interface UserAnswer {
  questionId: number;
  selectedOption: string;
}

interface TestResults {
  score: number;
  totalQuestions: number;
  percentage: number;
  timeTaken: number;
}

interface TestContextType {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: Map<number, string>;
  flaggedQuestions: Set<number>;
  timeRemaining: number;
  isLoading: boolean;
  isSubmitting: boolean;
  testResults: TestResults | null;
  setCurrentQuestionIndex: (index: number) => void;
  setAnswer: (questionId: number, option: string) => void;
  toggleFlag: (questionId: number) => void;
  submitTest: () => void;
  startTimer: () => void;
  resetTest: () => void;
}

const TestContext = createContext<TestContextType | null>(null);

// Test duration in seconds (45 minutes)
const TEST_DURATION = 45 * 60;

export function TestProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Map<number, string>>(new Map());
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState(TEST_DURATION);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [testResults, setTestResults] = useState<TestResults | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Fetch questions
  const { 
    data: questions = [], 
    isLoading 
  } = useQuery<Question[]>({
    queryKey: ['/api/questions'],
    staleTime: Infinity, // Don't refetch during the test
  });

  // Submit test mutation
  const { 
    mutate: submitTestMutation,
    isPending: isSubmitting
  } = useMutation({
    mutationFn: async () => {
      // Calculate time taken
      const timeTaken = startTime 
        ? Math.floor((Date.now() - startTime) / 1000) 
        : TEST_DURATION - timeRemaining;
      
      // Format answers for submission
      const answers = Array.from(userAnswers.entries()).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption,
      }));
      
      const response = await apiRequest("POST", "/api/submit-test", {
        answers,
        timeTaken,
      });
      
      return response.json();
    },
    onSuccess: (data: TestResults) => {
      setTestResults(data);
      stopTimer();
      toast({
        title: "Test Submitted",
        description: `You scored ${data.score} out of ${data.totalQuestions}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Timer functions
  const startTimer = () => {
    if (timerInterval) clearInterval(timerInterval);
    setStartTime(Date.now());
    setTimeRemaining(TEST_DURATION);
    
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Auto-submit when time runs out
          submitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setTimerInterval(interval);
  };

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  // Answer management
  const setAnswer = (questionId: number, option: string) => {
    setUserAnswers(prev => {
      const updated = new Map(prev);
      updated.set(questionId, option);
      return updated;
    });
  };

  // Flag management
  const toggleFlag = (questionId: number) => {
    setFlaggedQuestions(prev => {
      const updated = new Set(prev);
      if (updated.has(questionId)) {
        updated.delete(questionId);
      } else {
        updated.add(questionId);
      }
      return updated;
    });
  };

  // Submit test
  const submitTest = () => {
    submitTestMutation();
  };

  // Reset test state
  const resetTest = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers(new Map());
    setFlaggedQuestions(new Set());
    setTimeRemaining(TEST_DURATION);
    setTestResults(null);
    stopTimer();
  };

  return (
    <TestContext.Provider
      value={{
        questions,
        currentQuestionIndex,
        userAnswers,
        flaggedQuestions,
        timeRemaining,
        isLoading,
        isSubmitting,
        testResults,
        setCurrentQuestionIndex,
        setAnswer,
        toggleFlag,
        submitTest,
        startTimer,
        resetTest,
      }}
    >
      {children}
    </TestContext.Provider>
  );
}

export function useTest() {
  const context = useContext(TestContext);
  if (!context) {
    throw new Error("useTest must be used within a TestProvider");
  }
  return context;
}
