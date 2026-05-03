import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

export default function Loader({ className }: Props) {
  return (
    <div
      className={cn(
        "size-6 border-2 border-white border-t-transparent rounded-full animate-spin",
        className,
      )}
    />
  );
}
