import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { LogOut, ArrowRight, Award, BookOpen, Clock } from "lucide-react";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const [, navigate] = useLocation();

  // If not logged in, redirect to auth page
  if (!user) {
    navigate("/auth");
    return null;
  }

  const handleStartTest = () => {
    navigate("/test");
  };

  const handleGoToAdmin = () => {
    navigate("/admin");
  };

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary">Scholarship Test Platform</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm font-medium">
                Welcome, {user.username}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-1" />
                Log out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
            Welcome to the Scholarship Test Platform
          </h2>
          <p className="mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4">
            Take the test to qualify for our prestigious scholarship program.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {user.isAdmin ? (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Administrator Dashboard</CardTitle>
                <CardDescription>
                  View test results and manage the scholarship test platform.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button onClick={handleGoToAdmin} className="w-full">
                  Go to Admin Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Scholarship Test</CardTitle>
                <CardDescription>
                  This test consists of multiple-choice questions designed to assess your knowledge.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-medium">Time Limit</h3>
                      <p className="text-sm text-gray-500">45 minutes to complete the test</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <BookOpen className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-medium">Questions</h3>
                      <p className="text-sm text-gray-500">10 multiple-choice questions</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Award className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-medium">Scholarship</h3>
                      <p className="text-sm text-gray-500">Top performers will qualify</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleStartTest} className="w-full">
                  Start Test
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
