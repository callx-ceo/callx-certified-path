import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, Lock, PlayCircle, FileText, HelpCircle, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const ModuleView = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [selectedLesson, setSelectedLesson] = useState(1);

  // Mock module data
  const module = {
    id: Number(moduleId),
    title: "Module 2: Call Handling Scripts",
    lessons: [
      { id: 1, title: "Introduction to Call Scripts", type: "video", completed: true },
      { id: 2, title: "Greeting Customers Professionally", type: "video", completed: true },
      { id: 3, title: "Active Listening Techniques", type: "text", completed: true },
      { id: 4, title: "Knowledge Check", type: "quiz", completed: true },
      { id: 5, title: "Handling Angry Customers", type: "video", completed: false },
      { id: 6, title: "Call Scripts Reference Guide", type: "text", completed: false },
      { id: 7, title: "Practice: Customer Service Call", type: "simulation", completed: false },
      { id: 8, title: "Module 2 Final Quiz", type: "quiz", completed: false },
    ],
  };

  const currentLesson = module.lessons.find(l => l.id === selectedLesson);

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video": return <PlayCircle className="h-4 w-4" />;
      case "text": return <FileText className="h-4 w-4" />;
      case "quiz": return <HelpCircle className="h-4 w-4" />;
      case "simulation": return <Phone className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-6 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/trainee/dashboard")}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="text-sm text-muted-foreground">
            My Learning &gt; CallX Agent Certification &gt; {module.title}
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar - Course Navigation */}
        <div className="w-80 border-r bg-card min-h-screen">
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-4">{module.title}</h2>
            <div className="space-y-2">
              {module.lessons.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => setSelectedLesson(lesson.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3",
                    selectedLesson === lesson.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  <div className={cn(
                    "flex-shrink-0",
                    selectedLesson === lesson.id ? "text-primary-foreground" : "text-muted-foreground"
                  )}>
                    {lesson.completed ? (
                      <div className="p-1 bg-success rounded-full">
                        <Check className="h-3 w-3 text-success-foreground" />
                      </div>
                    ) : (
                      getLessonIcon(lesson.type)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{lesson.title}</div>
                    <div className={cn(
                      "text-xs capitalize",
                      selectedLesson === lesson.id ? "text-primary-foreground/80" : "text-muted-foreground"
                    )}>
                      {lesson.type}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Lesson Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">{currentLesson?.title}</h1>
                <Badge>{currentLesson?.type}</Badge>
              </div>
            </div>

            {/* Lesson Content */}
            <Card>
              <CardContent className="p-8">
                {currentLesson?.type === "video" && (
                  <div className="space-y-6">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <PlayCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">Video Player</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          (Video playback will be implemented with backend)
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Downloads</h3>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <FileText className="mr-2 h-4 w-4" />
                          Call_Script_Template.pdf
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <FileText className="mr-2 h-4 w-4" />
                          Compliance_Guidelines.pdf
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {currentLesson?.type === "text" && (
                  <div className="prose max-w-none">
                    <p className="text-foreground">
                      This is a text-based lesson. The actual content would be rendered here with proper formatting.
                    </p>
                    <p className="text-muted-foreground mt-4">
                      Text lessons will include rich formatting, images, and downloadable resources.
                    </p>
                  </div>
                )}

                {currentLesson?.type === "quiz" && (
                  <div className="text-center py-12">
                    <HelpCircle className="h-16 w-16 mx-auto mb-4 text-primary" />
                    <h2 className="text-2xl font-semibold mb-4">Knowledge Check</h2>
                    <p className="text-muted-foreground mb-6">10 Questions • 80% Required to Pass</p>
                    <Button size="lg" onClick={() => navigate(`/trainee/quiz/${currentLesson.id}`)}>
                      Start Quiz
                    </Button>
                  </div>
                )}

                {currentLesson?.type === "simulation" && (
                  <div className="text-center py-12">
                    <Phone className="h-16 w-16 mx-auto mb-4 text-primary" />
                    <h2 className="text-2xl font-semibold mb-4">AI Call Simulation</h2>
                    <p className="text-muted-foreground mb-6">
                      Practice your skills in a realistic call scenario with our AI-powered customer
                    </p>
                    <Button size="lg" onClick={() => navigate(`/trainee/simulation/${currentLesson.id}`)}>
                      Start Simulation
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                disabled={selectedLesson === 1}
                onClick={() => setSelectedLesson(selectedLesson - 1)}
              >
                Previous Lesson
              </Button>
              <Button
                onClick={() => {
                  if (selectedLesson < module.lessons.length) {
                    setSelectedLesson(selectedLesson + 1);
                  }
                }}
              >
                {currentLesson?.completed ? "Next Lesson" : "Mark as Complete & Continue"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleView;
