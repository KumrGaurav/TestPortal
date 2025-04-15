import { useTest } from "@/hooks/use-test";
import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export default function Timer() {
  const { timeRemaining, submitTest } = useTest();
  const [isWarning, setIsWarning] = useState(false);
  
  // Format the time as mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Check if time is low to show warning state
  useEffect(() => {
    setIsWarning(timeRemaining <= 300); // 5 minutes or less
    
    if (timeRemaining <= 0) {
      submitTest(); // Auto-submit when time runs out
    }
  }, [timeRemaining, submitTest]);
  
  return (
    <div className={`flex items-center ${isWarning ? 'text-red-600 animate-pulse' : 'text-gray-800'} bg-gray-100 px-4 py-2 rounded-lg font-semibold`}>
      <Clock className="h-5 w-5 mr-2" />
      <span id="time-display">{formatTime(timeRemaining)}</span>
    </div>
  );
}
