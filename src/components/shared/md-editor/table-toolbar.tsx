import { Editor } from "@tiptap/react";
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  ArrowDownIcon,
  ArrowLeftIcon as ArrowLeftColIcon,
  ArrowRightIcon as ArrowRightColIcon,
  ArrowUpIcon,
  Columns2Icon,
  Rows2Icon,
  Trash2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TableToolbarProps {
  editor: Editor;
  top: number;
  left: number;
}

interface ToolbarAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

export default function TableToolbar({ editor, top, left }: TableToolbarProps) {
  const rowActions: ToolbarAction[] = [
    {
      icon: <ArrowUpIcon className="size-3.5" />,
      label: "위에 행 추가",
      onClick: () => editor.chain().focus().addRowBefore().run(),
    },
    {
      icon: <ArrowDownIcon className="size-3.5" />,
      label: "아래에 행 추가",
      onClick: () => editor.chain().focus().addRowAfter().run(),
    },
    {
      icon: <Rows2Icon className="size-3.5 text-destructive" />,
      label: "행 삭제",
      onClick: () => editor.chain().focus().deleteRow().run(),
    },
  ];

  const colActions: ToolbarAction[] = [
    {
      icon: <ArrowLeftColIcon className="size-3.5" />,
      label: "왼쪽에 열 추가",
      onClick: () => editor.chain().focus().addColumnBefore().run(),
    },
    {
      icon: <ArrowRightColIcon className="size-3.5" />,
      label: "오른쪽에 열 추가",
      onClick: () => editor.chain().focus().addColumnAfter().run(),
    },
    {
      icon: <Columns2Icon className="size-3.5 text-destructive" />,
      label: "열 삭제",
      onClick: () => editor.chain().focus().deleteColumn().run(),
    },
  ];

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

  return (
    <div
      className="absolute z-50 flex items-center gap-0.5 rounded-md border border-border bg-background shadow-md px-1 py-0.5"
      style={{ top, left }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {rowActions.map((action) => (
        <Tooltip key={action.label}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={action.onClick}
            >
              {action.icon}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            {action.label}
          </TooltipContent>
        </Tooltip>
      ))}

      <Separator orientation="vertical" className="mx-0.5 h-4" />

      {colActions.map((action) => (
        <Tooltip key={action.label}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={action.onClick}
            >
              {action.icon}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            {action.label}
          </TooltipContent>
        </Tooltip>
      ))}

      <Separator orientation="vertical" className="mx-0.5 h-4" />

      {alignActions.map(({ value, icon, label }) => (
        <Tooltip key={value}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={[
                "h-7 w-7",
                editor.isActive({ textAlign: value }) ? "bg-muted" : "",
              ].join(" ")}
              onClick={() => editor.chain().focus().setTextAlign(value).run()}
            >
              {icon}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            {label}
          </TooltipContent>
        </Tooltip>
      ))}

      <Separator orientation="vertical" className="mx-0.5 h-4" />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={() => editor.chain().focus().deleteTable().run()}
          >
            <Trash2Icon className="size-3.5 text-destructive" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          테이블 삭제
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
