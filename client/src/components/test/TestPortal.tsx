import { useTest } from "@/hooks/use-test";
import { useAuth } from "@/hooks/use-auth";
import QuestionDisplay from "./QuestionDisplay";
import QuestionNavigator from "./QuestionNavigator";
import Timer from "./Timer";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

export default function TestPortal() {
  const { user, logoutMutation } = useAuth();
  const { 
    questions, 
    currentQuestionIndex, 
    submitTest
  } = useTest();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };

  const handleSubmitTest = () => {
    submitTest();
    setShowSubmitConfirm(false);
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary">Scholarship Test Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {user?.username}
              </div>
              <Timer />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowLogoutConfirm(true)}
              >
                <LogOut className="h-4 w-4 mr-1" />
                Exit
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Question Section */}
              <div className="lg:w-3/4">
                {questions.length > 0 && (
                  <QuestionDisplay
                    question={questions[currentQuestionIndex]}
                    questionNumber={currentQuestionIndex + 1}
                  />
                )}
              </div>

              {/* Navigator Section */}
              <div className="lg:w-1/4">
                <QuestionNavigator 
                  questions={questions}
                  onSubmit={() => setShowSubmitConfirm(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exit Test?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to exit? Your progress will not be saved and you won't be able to resume.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Exit Test</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitConfirm} onOpenChange={setShowSubmitConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Test?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit your test? You won't be able to change your answers after submission.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmitTest}>Submit Test</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
