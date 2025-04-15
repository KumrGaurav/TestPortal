import { useTest } from "@/hooks/use-test";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionNavigatorProps {
  questions: any[];
  onSubmit: () => void;
}

export default function QuestionNavigator({ questions, onSubmit }: QuestionNavigatorProps) {
  const { 
    currentQuestionIndex, 
    setCurrentQuestionIndex, 
    userAnswers, 
    flaggedQuestions 
  } = useTest();

  const getQuestionStatus = (questionIndex: number) => {
    const questionId = questions[questionIndex].id;
    const isAnswered = userAnswers.has(questionId);
    const isFlagged = flaggedQuestions.has(questionId);
    const isCurrent = questionIndex === currentQuestionIndex;
    
    return { isAnswered, isFlagged, isCurrent };
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle>Question Navigator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-2 mb-6">
          {questions.map((_, index) => {
            const { isAnswered, isFlagged, isCurrent } = getQuestionStatus(index);
            
            let buttonClass = "border";
            if (isCurrent) buttonClass = "ring-2 ring-primary";
            if (isAnswered) buttonClass = "bg-green-100 border-green-500";
            if (isFlagged) buttonClass = "bg-amber-100 border-amber-500";
            
            return (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className={cn(
                  "h-10 w-10 p-0 font-medium",
                  buttonClass
                )}
                onClick={() => setCurrentQuestionIndex(index)}
              >
                {index + 1}
              </Button>
            );
          })}
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex items-center">
            <div className="h-4 w-4 rounded bg-white border border-gray-300"></div>
            <span className="ml-2 text-sm text-gray-600">Not answered</span>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 rounded bg-green-100 border border-green-500"></div>
            <span className="ml-2 text-sm text-gray-600">Answered</span>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 rounded bg-amber-100 border border-amber-500"></div>
            <span className="ml-2 text-sm text-gray-600">Flagged for review</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Answered: {userAnswers.size} of {questions.length}</span>
            <span>Flagged: {flaggedQuestions.size}</span>
          </div>
          
          <Button 
            className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center"
            onClick={onSubmit}
          >
            <Check className="h-5 w-5 mr-1" />
            Submit Test
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
