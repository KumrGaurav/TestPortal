import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { CheckCircle } from "lucide-react";

interface TestCompletionModalProps {
  results: {
    score: number;
    totalQuestions: number;
    percentage: number;
    timeTaken: number;
  };
}

export default function TestCompletionModal({ results }: TestCompletionModalProps) {
  const [, navigate] = useLocation();
  
  // Format time taken in minutes and seconds
  const formatTimeTaken = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} min ${remainingSeconds} sec`;
  };

  useEffect(() => {
    // Prevent user from navigating away or refreshing after completion
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <DialogTitle className="text-center text-xl">Test Completed</DialogTitle>
          <DialogDescription className="text-center">
            Your test has been submitted successfully. Thank you for participating in the scholarship test.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-sm text-gray-500">Score</div>
              <div className="text-2xl font-bold">{results.score} / {results.totalQuestions}</div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-sm text-gray-500">Percentage</div>
              <div className="text-2xl font-bold">{results.percentage}%</div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-sm text-gray-500">Time Taken</div>
              <div className="text-2xl font-bold">{formatTimeTaken(results.timeTaken)}</div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            className="w-full" 
            onClick={() => navigate("/")}
          >
            Return to Home
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
