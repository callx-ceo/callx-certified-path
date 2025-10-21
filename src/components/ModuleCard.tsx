import { Check, Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "./ProgressBar";
import { cn } from "@/lib/utils";

interface ModuleCardProps {
  title: string;
  description: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  isLocked?: boolean;
  isCompleted?: boolean;
  onClick?: () => void;
}

export const ModuleCard = ({
  title,
  description,
  progress,
  totalLessons,
  completedLessons,
  isLocked = false,
  isCompleted = false,
  onClick,
}: ModuleCardProps) => {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        isLocked && "opacity-60 cursor-not-allowed",
        isCompleted && "border-success"
      )}
      onClick={!isLocked ? onClick : undefined}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {title}
              {isCompleted && (
                <div className="p-1 bg-success rounded-full">
                  <Check className="h-4 w-4 text-success-foreground" />
                </div>
              )}
              {isLocked && (
                <Lock className="h-4 w-4 text-locked" />
              )}
            </CardTitle>
            <CardDescription className="mt-2">{description}</CardDescription>
          </div>
          <Badge variant={isCompleted ? "default" : "secondary"} className={cn(isCompleted && "bg-success")}>
            {completedLessons}/{totalLessons} Lessons
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ProgressBar value={progress} showLabel={false} />
      </CardContent>
    </Card>
  );
};
