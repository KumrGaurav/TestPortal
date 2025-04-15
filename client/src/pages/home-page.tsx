import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { LogOut, ArrowRight, Award, BookOpen, Clock, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import LeaderboardTable from "@/components/admin/LeaderboardTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

interface LeaderboardEntry {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
  };
  score: number;
  totalQuestions: number;
  percentage: number;
  timeTaken: number;
  completedAt: string;
}

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const [, navigate] = useLocation();

  // If not logged in, redirect to auth page
  if (!user) {
    navigate("/auth");
    return null;
  }

  // Fetch leaderboard data for admin users
  const { data: leaderboard, isLoading, error } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/leaderboard"],
    refetchInterval: 30000, // Refetch every 30 seconds
    enabled: user.isAdmin, // Only fetch if user is admin
  });

  const handleStartTest = () => {
    navigate("/test");
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
            {user.isAdmin 
              ? "Monitor test performance and manage scholarship candidates."
              : "Take the test to qualify for our prestigious scholarship program."
            }
          </p>
        </div>

        {user.isAdmin ? (
          // Admin View
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="bg-white">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <Users className="h-8 w-8 text-primary mb-2" />
                    <h3 className="text-lg font-medium">Total Participants</h3>
                    {isLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin mt-2" />
                    ) : (
                      <p className="text-3xl font-bold mt-2">
                        {leaderboard?.length || 0}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <Award className="h-8 w-8 text-primary mb-2" />
                    <h3 className="text-lg font-medium">Average Score</h3>
                    {isLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin mt-2" />
                    ) : (
                      <p className="text-3xl font-bold mt-2">
                        {leaderboard && leaderboard.length > 0
                          ? Math.round(
                              leaderboard.reduce((acc, entry) => acc + entry.percentage, 0) / 
                              leaderboard.length
                            )
                          : 0}%
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <Clock className="h-8 w-8 text-primary mb-2" />
                    <h3 className="text-lg font-medium">Average Time</h3>
                    {isLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin mt-2" />
                    ) : (
                      <p className="text-3xl font-bold mt-2">
                        {leaderboard && leaderboard.length > 0
                          ? Math.round(
                              leaderboard.reduce((acc, entry) => acc + entry.timeTaken, 0) / 
                              leaderboard.length / 60
                            )
                          : 0} min
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Scholarship Test Leaderboard</CardTitle>
                <CardDescription>
                  Performance leaderboard of all participants, ranked by score and time taken.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center p-12">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  </div>
                ) : error ? (
                  <div className="text-center p-4">
                    <h3 className="text-lg font-medium text-red-600">Error loading leaderboard</h3>
                    <p className="text-gray-500 mt-2">{error.message}</p>
                  </div>
                ) : !leaderboard || leaderboard.length === 0 ? (
                  <div className="text-center p-8">
                    <h3 className="text-lg font-medium text-gray-900">No test results yet</h3>
                    <p className="text-gray-500 mt-2">
                      There are no completed tests to display. Results will appear here when students submit their tests.
                    </p>
                  </div>
                ) : (
                  <LeaderboardTable data={leaderboard} />
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          // Student View
          <div className="max-w-4xl mx-auto">
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
          </div>
        )}
      </main>
    </div>
  );
}
