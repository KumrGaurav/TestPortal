import { useEffect } from "react";
import { useTest, TestProvider } from "@/hooks/use-test";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import TestPortal from "@/components/test/TestPortal";
import TestCompletionModal from "@/components/test/TestCompletionModal";
import { Loader2 } from "lucide-react";

// This is a wrapper component that provides the TestContext
function TestPageContent() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { 
    isLoading, 
    questions, 
    startTimer, 
    testResults 
  } = useTest();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    // Start the timer when the component mounts
    if (questions.length > 0 && !testResults) {
      startTimer();
    }
  }, [user, navigate, questions, startTimer, testResults]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading test questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">No Questions Available</h1>
        <p className="text-gray-600 mb-6">The test is currently not available or has no questions.</p>
        <button 
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TestPortal />
      {testResults && <TestCompletionModal results={testResults} />}
    </div>
  );
}

export default function TestPage() {
  return (
    <TestProvider>
      <TestPageContent />
    </TestProvider>
  );
}
