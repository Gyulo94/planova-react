import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Skeleton } from "./skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

interface Props {
  name: string;
  url?: string;
  size?:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl";
  className?: string;
  isTooltipEnabled?: boolean;
  onClick?: () => void;
}

export default function CircleAvatar({
  name,
  url,
  size,
  className,
  isTooltipEnabled = true,
  onClick,
}: Props) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Avatar
          className={cn(
            "size-8 shadow-md border hover:z-10",
            size === "sm" && "size-6",
            size === "md" && "size-8",
            size === "lg" && "size-10",
            size === "xl" && "size-14",
            size === "2xl" && "size-16",
            size === "3xl" && "size-20",
            size === "4xl" && "size-24",
            size === "5xl" && "size-28",
            size === "6xl" && "size-32",
            size === "7xl" && "size-36",
            className,
          )}
          onClick={onClick}
        >
          <AvatarImage
            src={url || undefined}
            alt={name}
            className="object-center object-cover"
          />
          <AvatarFallback>
            <Skeleton className="size-full rounded-full" />
          </AvatarFallback>
        </Avatar>
      </TooltipTrigger>
      {isTooltipEnabled && (
        <TooltipContent className="bg-primary">
          <p>{name.toUpperCase()}</p>
        </TooltipContent>
      )}
    </Tooltip>
  );
}
