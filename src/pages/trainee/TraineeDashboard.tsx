import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ModuleCard } from "@/components/ModuleCard";
import { ProgressBar } from "@/components/ProgressBar";
import { Award, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TraineeDashboard = () => {
  const navigate = useNavigate();
  
  // Mock data - will be replaced with actual data from backend
  const overallProgress = 45;
  const agentName = "Sarah Johnson";
  
  const modules = [
    {
      id: 1,
      title: "Module 1: Introduction to CallX",
      description: "Learn the fundamentals of our call center platform and basic procedures",
      progress: 100,
      totalLessons: 5,
      completedLessons: 5,
      isCompleted: true,
    },
    {
      id: 2,
      title: "Module 2: Call Handling Scripts",
      description: "Master the essential scripts for different customer scenarios",
      progress: 60,
      totalLessons: 8,
      completedLessons: 5,
      isCompleted: false,
    },
    {
      id: 3,
      title: "Module 3: Conflict Resolution",
      description: "Learn techniques to de-escalate difficult situations professionally",
      progress: 0,
      totalLessons: 6,
      completedLessons: 0,
      isLocked: true,
    },
    {
      id: 4,
      title: "Module 4: Product Knowledge",
      description: "Deep dive into our products and services to better assist customers",
      progress: 0,
      totalLessons: 10,
      completedLessons: 0,
      isLocked: true,
    },
    {
      id: 5,
      title: "Module 5: Final Assessment",
      description: "Complete your certification with a comprehensive practical assessment",
      progress: 0,
      totalLessons: 3,
      completedLessons: 0,
      isLocked: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-6xl">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome back, {agentName}!
          </h1>
          <p className="text-muted-foreground text-lg">
            Continue your journey to becoming a certified CallX agent
          </p>
        </div>

        {/* Main Certification Card */}
        <Card className="mb-8 border-2 border-primary">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">CallX Agent Certification</CardTitle>
                <CardDescription className="text-base">
                  Complete all modules to earn your certification
                </CardDescription>
              </div>
              <Award className="h-12 w-12 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <ProgressBar value={overallProgress} />
            <Button size="lg" className="w-full sm:w-auto" onClick={() => navigate("/trainee/module/2")}>
              <PlayCircle className="mr-2 h-5 w-5" />
              Continue Learning
            </Button>
          </CardContent>
        </Card>

        {/* Modules List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Course Curriculum
          </h2>
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              {...module}
              onClick={() => {
                if (!module.isLocked) {
                  navigate(`/trainee/module/${module.id}`);
                }
              }}
            />
          ))}
        </div>

        {/* My Certificates Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>My Certificates</CardTitle>
            <CardDescription>
              View and download your earned certifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Award className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>Complete the certification to earn your first certificate!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TraineeDashboard;
