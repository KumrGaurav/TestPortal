import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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

interface LeaderboardTableProps {
  data: LeaderboardEntry[];
}

export default function LeaderboardTable({ data }: LeaderboardTableProps) {
  // Format time from seconds to min:sec
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSecs = seconds % 60;
    return `${minutes}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Get initials from username
  const getInitials = (username: string) => {
    return username
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Rank</TableHead>
            <TableHead>Participant</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Time Taken</TableHead>
            <TableHead>Accuracy</TableHead>
            <TableHead className="text-right">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((entry, index) => (
            <TableRow key={entry.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarFallback className="bg-gray-200 text-gray-700">
                      {getInitials(entry.user.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{entry.user.username}</div>
                    <div className="text-sm text-muted-foreground">
                      {entry.user.email}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>{entry.score}/{entry.totalQuestions}</div>
                <div className="text-sm text-muted-foreground">{entry.percentage}%</div>
              </TableCell>
              <TableCell>
                {formatTime(entry.timeTaken)}
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${entry.percentage}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm">{entry.percentage}%</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <a 
                  href="#" 
                  className="text-primary hover:text-indigo-800 font-medium"
                  onClick={(e) => {
                    e.preventDefault();
                    // Could show a detailed modal here in a real implementation
                    alert(`View details for user ${entry.user.username}`);
                  }}
                >
                  View details
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
