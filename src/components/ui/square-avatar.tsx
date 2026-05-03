import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";

interface Props {
  name?: string;
  url?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function SquareAvatar({ name, url, size, className }: Props) {
  return (
    <Avatar
      className={cn(
        "size-8 shadow-md border rounded-md",
        size === "sm" && "size-6 text-xs",
        size === "md" && "size-8 text-sm",
        size === "lg" && "size-10 text-md",
        className,
      )}
    >
      <AvatarImage
        src={url || ""}
        alt={name}
        className="object-center object-cover"
      />
      <AvatarFallback className="bg-primary rounded-md">
        {name ? (
          <p className={"text-white font-medium"}>
            {name.charAt(0).toUpperCase()}
          </p>
        ) : (
          <Skeleton className="size-full" />
        )}
      </AvatarFallback>
    </Avatar>
  );
}
