import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeaderboardTable from "./LeaderboardTable";
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

export default function AdminDashboard() {
  const { data: leaderboard, isLoading, error } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/leaderboard"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center p-4">
            <h3 className="text-lg font-medium text-red-600">Error loading leaderboard</h3>
            <p className="text-gray-500 mt-2">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!leaderboard || leaderboard.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center p-8">
            <h3 className="text-lg font-medium text-gray-900">No test results yet</h3>
            <p className="text-gray-500 mt-2">
              There are no completed tests to display. Results will appear here when students submit their tests.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="leaderboard" className="space-y-4">
      <TabsList>
        <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        <TabsTrigger value="statistics">Statistics</TabsTrigger>
      </TabsList>
      
      <TabsContent value="leaderboard" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Scholarship Test Results</CardTitle>
            <CardDescription>
              Performance leaderboard of all participants, ranked by score and time taken.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LeaderboardTable data={leaderboard} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="statistics" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Test Statistics</CardTitle>
            <CardDescription>
              Overview of test performance metrics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Total Participants</h3>
                <p className="text-3xl font-bold">{leaderboard.length}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Average Score</h3>
                <p className="text-3xl font-bold">
                  {Math.round(
                    leaderboard.reduce((acc, entry) => acc + entry.percentage, 0) / 
                    leaderboard.length
                  )}%
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Average Time</h3>
                <p className="text-3xl font-bold">
                  {Math.round(
                    leaderboard.reduce((acc, entry) => acc + entry.timeTaken, 0) / 
                    leaderboard.length / 60
                  )} min
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
