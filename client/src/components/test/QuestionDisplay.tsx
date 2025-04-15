import { useTest } from "@/hooks/use-test";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Flag } from "lucide-react";

interface QuestionDisplayProps {
  question: {
    id: number;
    text: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
  };
  questionNumber: number;
}

export default function QuestionDisplay({ question, questionNumber }: QuestionDisplayProps) {
  const { 
    userAnswers,
    flaggedQuestions, 
    setAnswer, 
    toggleFlag,
    questions,
    currentQuestionIndex,
    setCurrentQuestionIndex
  } = useTest();

  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  
  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const isFlagged = flaggedQuestions.has(question.id);
  const selectedOption = userAnswers.get(question.id) || "";

  return (
    <Card className="shadow-md">
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Question {questionNumber} of {questions.length}
            </h2>
            <Button
              variant={isFlagged ? "destructive" : "outline"}
              size="sm"
              onClick={() => toggleFlag(question.id)}
              className="flex items-center"
            >
              <Flag className="h-4 w-4 mr-1" />
              {isFlagged ? "Unflag" : "Flag for review"}
            </Button>
          </div>
          
          <p className="text-lg text-gray-700 mb-6">{question.text}</p>
          
          <RadioGroup
            value={selectedOption}
            onValueChange={(value) => setAnswer(question.id, value)}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
              <RadioGroupItem value="A" id={`option-a-${question.id}`} />
              <Label htmlFor={`option-a-${question.id}`} className="flex-grow cursor-pointer">
                A. {question.optionA}
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
              <RadioGroupItem value="B" id={`option-b-${question.id}`} />
              <Label htmlFor={`option-b-${question.id}`} className="flex-grow cursor-pointer">
                B. {question.optionB}
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
              <RadioGroupItem value="C" id={`option-c-${question.id}`} />
              <Label htmlFor={`option-c-${question.id}`} className="flex-grow cursor-pointer">
                C. {question.optionC}
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
              <RadioGroupItem value="D" id={`option-d-${question.id}`} />
              <Label htmlFor={`option-d-${question.id}`} className="flex-grow cursor-pointer">
                D. {question.optionD}
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={isFirstQuestion}
            className="flex items-center"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Previous
          </Button>
          
          <Button
            variant="default"
            onClick={handleNext}
            disabled={isLastQuestion}
            className="flex items-center"
          >
            Next
            <ChevronRight className="h-5 w-5 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
