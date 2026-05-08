import { cn } from "@/lib/utils";
import { Progress } from "../ui/progress";

interface CircleProgressProps {
  title: string;
  value: number;
  subTitle: string;
  variant: "default" | "success" | "review" | "inProgress" | "info";
  customValue?: string;
}

const variantStyles = {
  default: {
    text: "text-blue-600",
    color: "[&_[data-slot=progress-indicator]]:!bg-blue-300",
  },
  success: {
    text: "text-green-600",
    color: "[&_[data-slot=progress-indicator]]:!bg-green-300",
  },
  review: {
    text: "text-indigo-600",
    color: "[&_[data-slot=progress-indicator]]:!bg-indigo-300",
  },
  inProgress: {
    text: "text-amber-600",
    color: "[&_[data-slot=progress-indicator]]:!bg-amber-300",
  },
  info: {
    text: "text-cyan-600",
    color: "[&_[data-slot=progress-indicator]]:!bg-cyan-300",
  },
};

export default function CircleProgress({
  title,
  value,
  subTitle,
  variant,
  customValue,
}: CircleProgressProps) {
  const { text, color } = variantStyles[variant];

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">
        {title}
      </h3>
      <div className="w-20 h-full">
        <div className="relative">
          <Progress
            value={value}
            className={cn("size-20 rotate-[-90deg]", color)}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={cn("text-xl font-semibold", text)}>
              {customValue ? customValue : `${Math.round(value || 0)}%`}
            </span>
          </div>
        </div>
      </div>
      <p className="text-center text-sm text-muted-foreground mt-2">
        {subTitle}
      </p>
    </div>
  );
}
