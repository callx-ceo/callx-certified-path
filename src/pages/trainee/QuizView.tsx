import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const QuizView = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Mock quiz data
  const quiz = {
    title: "Module 2 Knowledge Check",
    passingGrade: 80,
    questions: [
      {
        question: "What is the first thing you should do when answering a customer call?",
        options: [
          "Ask for their account number",
          "Greet them professionally and introduce yourself",
          "Put them on hold to check their account",
          "Transfer them to your supervisor"
        ],
        correctAnswer: 1
      },
      {
        question: "When dealing with an angry customer, what is the most important first step?",
        options: [
          "Explain company policy",
          "Offer a discount",
          "Listen actively and show empathy",
          "End the call quickly"
        ],
        correctAnswer: 2
      },
      {
        question: "How should you handle a question you don't know the answer to?",
        options: [
          "Make up an answer",
          "Transfer immediately",
          "Acknowledge it and commit to finding the answer",
          "Tell them to call back later"
        ],
        correctAnswer: 2
      },
    ]
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
  };

  const handleSubmitAnswer = () => {
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer("");
    } else {
      // Calculate score
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (parseInt(answer) === quiz.questions[index].correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / quiz.questions.length) * 100);
  };

  const score = showResults ? calculateScore() : 0;
  const passed = score >= quiz.passingGrade;

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-4 w-fit"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Lesson
            </Button>
            <CardTitle className="text-2xl">{quiz.title}</CardTitle>
            <CardDescription className="text-base">
              Test your knowledge before moving forward
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-foreground">{quiz.questions.length}</div>
                <div className="text-sm text-muted-foreground">Questions</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-foreground">{quiz.passingGrade}%</div>
                <div className="text-sm text-muted-foreground">Required to Pass</div>
              </div>
            </div>
            <Button size="lg" className="w-full" onClick={handleStartQuiz}>
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full">
          <CardContent className="pt-12 pb-8">
            <div className="text-center space-y-6">
              {passed ? (
                <CheckCircle2 className="h-24 w-24 text-success mx-auto" />
              ) : (
                <XCircle className="h-24 w-24 text-destructive mx-auto" />
              )}
              
              <div>
                <h2 className={`text-4xl font-bold ${passed ? "text-success" : "text-destructive"}`}>
                  {passed ? "PASSED!" : "NOT PASSED"}
                </h2>
                <p className="text-2xl font-semibold mt-2">Your Score: {score}%</p>
                <p className="text-muted-foreground mt-2">
                  {passed 
                    ? "Congratulations! You can proceed to the next module."
                    : `You need ${quiz.passingGrade}% to pass. Review the material and try again.`
                  }
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                {!passed && (
                  <Button size="lg" onClick={handleStartQuiz}>
                    Retake Quiz
                  </Button>
                )}
                {passed && (
                  <Button size="lg" onClick={() => navigate("/trainee/dashboard")}>
                    Continue to Next Module
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
          </div>
          <Progress value={progress} className="mb-4" />
          <CardTitle className="text-xl">
            {quiz.questions[currentQuestion].question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
            {quiz.questions[currentQuestion].options.map((option, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted transition-colors">
                <RadioGroupItem value={String(index)} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
          
          <Button
            className="w-full"
            size="lg"
            disabled={!selectedAnswer}
            onClick={handleSubmitAnswer}
          >
            {currentQuestion < quiz.questions.length - 1 ? "Submit Answer" : "Submit Quiz"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizView;
