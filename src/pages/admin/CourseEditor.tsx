import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  GripVertical,
  Edit,
  Trash2,
  Video,
  FileText,
  ClipboardList,
  Phone,
  ChevronDown,
  ChevronRight,
  Save,
} from "lucide-react";
import { QuizEditorDialog } from "@/components/admin/QuizEditorDialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";

interface Lesson {
  id: string;
  title: string;
  type: "video" | "text" | "quiz" | "simulation";
  orderIndex: number;
}

interface Module {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
  isPrerequisite: boolean;
  lessons: Lesson[];
  isExpanded: boolean;
}

export default function CourseEditor() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNewCourse = courseId === "new";

  const [courseTitle, setCourseTitle] = useState(
    isNewCourse ? "" : "CallX Agent Certification"
  );
  const [courseDescription, setCourseDescription] = useState(
    isNewCourse ? "" : "Complete onboarding program for new call center agents"
  );
  const [isActive, setIsActive] = useState(true);

  const [modules, setModules] = useState<Module[]>([
    {
      id: "1",
      title: "Module 1: Introduction to CallX",
      description: "Get started with CallX basics",
      orderIndex: 0,
      isPrerequisite: false,
      isExpanded: true,
      lessons: [
        { id: "1-1", title: "Welcome Video", type: "video", orderIndex: 0 },
        { id: "1-2", title: "Company Overview", type: "text", orderIndex: 1 },
        { id: "1-3", title: "Knowledge Check", type: "quiz", orderIndex: 2 },
      ],
    },
  ]);

  const [selectedLesson, setSelectedLesson] = useState<{
    moduleId: string;
    lesson: Lesson;
  } | null>(null);
  const [isQuizEditorOpen, setIsQuizEditorOpen] = useState(false);

  const addModule = () => {
    const newModule: Module = {
      id: `${Date.now()}`,
      title: `Module ${modules.length + 1}`,
      description: "",
      orderIndex: modules.length,
      isPrerequisite: false,
      isExpanded: true,
      lessons: [],
    };
    setModules([...modules, newModule]);
  };

  const addLesson = (moduleId: string) => {
    setModules(
      modules.map((module) => {
        if (module.id === moduleId) {
          const newLesson: Lesson = {
            id: `${moduleId}-${Date.now()}`,
            title: "New Lesson",
            type: "video",
            orderIndex: module.lessons.length,
          };
          return { ...module, lessons: [...module.lessons, newLesson] };
        }
        return module;
      })
    );
  };

  const deleteModule = (moduleId: string) => {
    setModules(modules.filter((m) => m.id !== moduleId));
  };

  const deleteLesson = (moduleId: string, lessonId: string) => {
    setModules(
      modules.map((module) => {
        if (module.id === moduleId) {
          return {
            ...module,
            lessons: module.lessons.filter((l) => l.id !== lessonId),
          };
        }
        return module;
      })
    );
  };

  const toggleModuleExpanded = (moduleId: string) => {
    setModules(
      modules.map((module) =>
        module.id === moduleId
          ? { ...module, isExpanded: !module.isExpanded }
          : module
      )
    );
  };

  const handleSaveCourse = () => {
    // TODO: Implement save to Supabase
    toast({
      title: "Course saved",
      description: "Your course has been saved successfully.",
    });
  };

  const getLessonIcon = (type: Lesson["type"]) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "text":
        return <FileText className="h-4 w-4" />;
      case "quiz":
        return <ClipboardList className="h-4 w-4" />;
      case "simulation":
        return <Phone className="h-4 w-4" />;
    }
  };

  const openQuizEditor = (moduleId: string, lesson: Lesson) => {
    setSelectedLesson({ moduleId, lesson });
    setIsQuizEditorOpen(true);
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {isNewCourse ? "Create New Course" : "Edit Course"}
            </h1>
            <p className="text-muted-foreground mt-1">
              Design your certification program structure
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/admin/courses")}>
              Cancel
            </Button>
            <Button onClick={handleSaveCourse}>
              <Save className="h-4 w-4 mr-2" />
              Save Course
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course Builder - Left Column */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title</Label>
                  <Input
                    id="title"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    placeholder="e.g., CallX Agent Certification"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    placeholder="Describe the course objectives..."
                    rows={3}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={isActive}
                    onCheckedChange={setIsActive}
                  />
                  <Label htmlFor="active">Course is active</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Course Structure</CardTitle>
                <Button onClick={addModule} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Module
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {modules.map((module) => (
                  <Collapsible
                    key={module.id}
                    open={module.isExpanded}
                    onOpenChange={() => toggleModuleExpanded(module.id)}
                  >
                    <div className="border rounded-lg">
                      <div className="flex items-center gap-2 p-3 bg-muted/50">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                        <CollapsibleTrigger className="flex-1 flex items-center gap-2 text-left">
                          {module.isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                          <span className="font-semibold">{module.title}</span>
                        </CollapsibleTrigger>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteModule(module.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <CollapsibleContent>
                        <div className="p-3 space-y-3">
                          <div className="space-y-2">
                            <Label>Module Title</Label>
                            <Input
                              value={module.title}
                              onChange={(e) => {
                                setModules(
                                  modules.map((m) =>
                                    m.id === module.id
                                      ? { ...m, title: e.target.value }
                                      : m
                                  )
                                );
                              }}
                            />
                          </div>

                          <div className="flex items-center space-x-2">
                            <Switch
                              id={`prerequisite-${module.id}`}
                              checked={module.isPrerequisite}
                              onCheckedChange={(checked) => {
                                setModules(
                                  modules.map((m) =>
                                    m.id === module.id
                                      ? { ...m, isPrerequisite: checked }
                                      : m
                                  )
                                );
                              }}
                            />
                            <Label htmlFor={`prerequisite-${module.id}`}>
                              Make prerequisite (content dripping)
                            </Label>
                          </div>

                          {/* Lessons */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <Label>Lessons</Label>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addLesson(module.id)}
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add Lesson
                              </Button>
                            </div>

                            {module.lessons.map((lesson) => (
                              <div
                                key={lesson.id}
                                className="flex items-center gap-2 p-2 bg-background border rounded"
                              >
                                <GripVertical className="h-3 w-3 text-muted-foreground" />
                                {getLessonIcon(lesson.type)}
                                <Input
                                  value={lesson.title}
                                  onChange={(e) => {
                                    setModules(
                                      modules.map((m) => {
                                        if (m.id === module.id) {
                                          return {
                                            ...m,
                                            lessons: m.lessons.map((l) =>
                                              l.id === lesson.id
                                                ? { ...l, title: e.target.value }
                                                : l
                                            ),
                                          };
                                        }
                                        return m;
                                      })
                                    );
                                  }}
                                  className="flex-1"
                                />
                                <Select
                                  value={lesson.type}
                                  onValueChange={(value) => {
                                    setModules(
                                      modules.map((m) => {
                                        if (m.id === module.id) {
                                          return {
                                            ...m,
                                            lessons: m.lessons.map((l) =>
                                              l.id === lesson.id
                                                ? { ...l, type: value as Lesson["type"] }
                                                : l
                                            ),
                                          };
                                        }
                                        return m;
                                      })
                                    );
                                  }}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="video">Video</SelectItem>
                                    <SelectItem value="text">Text</SelectItem>
                                    <SelectItem value="quiz">Quiz</SelectItem>
                                    <SelectItem value="simulation">Simulation</SelectItem>
                                  </SelectContent>
                                </Select>
                                {lesson.type === "quiz" && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => openQuizEditor(module.id, lesson)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteLesson(module.id, lesson.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                ))}

                {modules.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No modules yet. Click "Add Module" to get started.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Settings Panel - Right Column */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="text-sm text-muted-foreground">
                    {isActive ? "Active - Visible to users" : "Inactive - Hidden from users"}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Statistics</Label>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Modules:</span>
                      <span className="font-medium">{modules.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lessons:</span>
                      <span className="font-medium">
                        {modules.reduce((acc, m) => acc + m.lessons.length, 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Help</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong>Content Dripping:</strong> Enable "Make prerequisite" to lock
                  a module until the previous one is completed.
                </p>
                <p>
                  <strong>Drag to Reorder:</strong> Use the grip handle to drag and
                  reorder modules and lessons.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {selectedLesson && (
        <QuizEditorDialog
          open={isQuizEditorOpen}
          onOpenChange={setIsQuizEditorOpen}
          lessonTitle={selectedLesson.lesson.title}
        />
      )}
    </AdminLayout>
  );
}
