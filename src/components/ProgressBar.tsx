import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  className?: string;
  showLabel?: boolean;
}

export const ProgressBar = ({ value, className, showLabel = true }: ProgressBarProps) => {
  const clampedValue = Math.min(100, Math.max(0, value));
  
  return (
    <div className={cn("w-full space-y-2", className)}>
      {showLabel && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-semibold text-foreground">{Math.round(clampedValue)}%</span>
        </div>
      )}
      <div className="h-3 w-full bg-progress-bg rounded-full overflow-hidden">
        <div
          className="h-full bg-success transition-all duration-500 ease-out"
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};
