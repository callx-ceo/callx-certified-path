import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuizQuestion {
  id: string;
  questionText: string;
  type: "multiple_choice" | "true_false";
  answers: QuizAnswer[];
}

interface QuizAnswer {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface QuizEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lessonTitle: string;
}

export function QuizEditorDialog({
  open,
  onOpenChange,
  lessonTitle,
}: QuizEditorDialogProps) {
  const { toast } = useToast();
  const [passingGrade, setPassingGrade] = useState(80);
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: "1",
      questionText: "Sample question?",
      type: "multiple_choice",
      answers: [
        { id: "1-1", text: "Answer 1", isCorrect: true },
        { id: "1-2", text: "Answer 2", isCorrect: false },
        { id: "1-3", text: "Answer 3", isCorrect: false },
      ],
    },
  ]);

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: `${Date.now()}`,
      questionText: "New question",
      type: "multiple_choice",
      answers: [
        { id: `${Date.now()}-1`, text: "Answer 1", isCorrect: true },
        { id: `${Date.now()}-2`, text: "Answer 2", isCorrect: false },
      ],
    };
    setQuestions([...questions, newQuestion]);
  };

  const deleteQuestion = (questionId: string) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
  };

  const updateQuestion = (questionId: string, updates: Partial<QuizQuestion>) => {
    setQuestions(
      questions.map((q) => (q.id === questionId ? { ...q, ...updates } : q))
    );
  };

  const addAnswer = (questionId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          const newAnswer: QuizAnswer = {
            id: `${Date.now()}`,
            text: "New answer",
            isCorrect: false,
          };
          return { ...q, answers: [...q.answers, newAnswer] };
        }
        return q;
      })
    );
  };

  const deleteAnswer = (questionId: string, answerId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: q.answers.filter((a) => a.id !== answerId),
          };
        }
        return q;
      })
    );
  };

  const updateAnswer = (
    questionId: string,
    answerId: string,
    updates: Partial<QuizAnswer>
  ) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: q.answers.map((a) =>
              a.id === answerId ? { ...a, ...updates } : a
            ),
          };
        }
        return q;
      })
    );
  };

  const setCorrectAnswer = (questionId: string, answerId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: q.answers.map((a) => ({
              ...a,
              isCorrect: a.id === answerId,
            })),
          };
        }
        return q;
      })
    );
  };

  const handleSave = () => {
    // TODO: Save to Supabase
    toast({
      title: "Quiz saved",
      description: "Your quiz has been saved successfully.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quiz Editor: {lessonTitle}</DialogTitle>
          <DialogDescription>
            Create and manage quiz questions for this lesson
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Quiz Settings */}
          <div className="space-y-2">
            <Label htmlFor="passing-grade">Passing Grade (%)</Label>
            <Input
              id="passing-grade"
              type="number"
              min="0"
              max="100"
              value={passingGrade}
              onChange={(e) => setPassingGrade(parseInt(e.target.value))}
              className="w-32"
            />
          </div>

          {/* Questions */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-base">Questions</Label>
              <Button onClick={addQuestion} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>

            {questions.map((question, qIndex) => (
              <Card key={question.id}>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <Label>Question {qIndex + 1}</Label>
                        <Input
                          value={question.questionText}
                          onChange={(e) =>
                            updateQuestion(question.id, {
                              questionText: e.target.value,
                            })
                          }
                          placeholder="Enter your question..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Question Type</Label>
                        <Select
                          value={question.type}
                          onValueChange={(value) =>
                            updateQuestion(question.id, {
                              type: value as QuizQuestion["type"],
                            })
                          }
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="multiple_choice">
                              Multiple Choice
                            </SelectItem>
                            <SelectItem value="true_false">True/False</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Answers */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label>Answers</Label>
                          {question.type === "multiple_choice" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addAnswer(question.id)}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add Answer
                            </Button>
                          )}
                        </div>

                        <RadioGroup
                          value={question.answers.find((a) => a.isCorrect)?.id}
                          onValueChange={(value) =>
                            setCorrectAnswer(question.id, value)
                          }
                        >
                          {question.answers.map((answer) => (
                            <div
                              key={answer.id}
                              className="flex items-center gap-2"
                            >
                              <RadioGroupItem value={answer.id} />
                              <Input
                                value={answer.text}
                                onChange={(e) =>
                                  updateAnswer(question.id, answer.id, {
                                    text: e.target.value,
                                  })
                                }
                                placeholder="Answer text..."
                                className="flex-1"
                              />
                              {question.type === "multiple_choice" &&
                                question.answers.length > 2 && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      deleteAnswer(question.id, answer.id)
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                            </div>
                          ))}
                        </RadioGroup>
                        <p className="text-xs text-muted-foreground">
                          Select the correct answer by clicking the radio button
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteQuestion(question.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {questions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No questions yet. Click "Add Question" to get started.
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Quiz
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
