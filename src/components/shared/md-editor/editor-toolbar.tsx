import { Editor } from "@tiptap/react";
import { AlignLeftIcon, AlignCenterIcon, AlignRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EditorToolbarProps {
  editor: Editor;
}

const alignActions = [
  {
    value: "left",
    icon: <AlignLeftIcon className="size-3.5" />,
    label: "왼쪽 정렬",
  },
  {
    value: "center",
    icon: <AlignCenterIcon className="size-3.5" />,
    label: "가운데 정렬",
  },
  {
    value: "right",
    icon: <AlignRightIcon className="size-3.5" />,
    label: "오른쪽 정렬",
  },
] as const;

export default function EditorToolbar({ editor }: EditorToolbarProps) {
  return (
    <div className="flex items-center gap-0.5 rounded-md border bg-background px-1 py-0.5 shadow-sm">
      {alignActions.map(({ value, icon, label }) => (
        <Tooltip key={value}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={[
                "h-6 w-6",
                editor.isActive({ textAlign: value })
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground",
              ].join(" ")}
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().setTextAlign(value).run();
              }}
            >
              {icon}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            {label}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
