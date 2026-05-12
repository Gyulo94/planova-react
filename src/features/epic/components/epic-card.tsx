import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, Edit2, Trash2, Folder, Milestone as MilestoneIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Epic } from "@/features/epic/type";

interface EpicCardProps {
  epic: Epic;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function EpicCard({ epic, onEdit, onDelete }: EpicCardProps) {
  return (
    <Card className="w-full hover:shadow-xl transition-all duration-300 border-border group relative overflow-hidden">
      <CardHeader className="w-full p-3 pb-1.5">
        <div className="w-full flex justify-between items-start mb-2 min-w-0">
          <div className="flex flex-col gap-1 min-w-0 w-full">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-violet-400 tracking-widest uppercase opacity-70 dark:opacity-100">
                EPIC-{epic.epicNumber}
              </span>
              {epic.milestone && (
                <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded text-[9px] font-bold">
                  <MilestoneIcon className="size-2.5" />
                  {epic.milestone.title}
                </div>
              )}
            </div>
            <div className="text-base group-hover:text-violet-400 transition-colors font-bold truncate overflow-hidden min-w-0">
              {epic.title}
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => onEdit(epic.id)}
            >
              <Edit2 className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"
              onClick={() => onDelete(epic.id)}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>
        <CardDescription className="text-xs text-muted-foreground truncate">
          {epic.description || "설명이 없습니다."}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-3 pt-1.5 space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1 font-medium">
            <span className="text-muted-foreground">진행률</span>
            <span className="text-violet-400">{epic.progress}%</span>
          </div>
          <Progress
            value={epic.progress}
            className="h-1 bg-violet-400/20"
            className2="bg-violet-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs bg-muted/30 p-1.5 rounded-md">
          <div className="flex items-center gap-2">
            <Calendar className="size-3 text-muted-foreground shrink-0" />
            <div className="truncate">
              <p className="text-[9px] text-muted-foreground font-bold uppercase leading-none mb-0.5">
                시작일
              </p>
              <p className="font-medium leading-none">
                {epic.startDate
                  ? format(new Date(epic.startDate), "yyyy.MM.dd")
                  : "-"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="size-3 text-muted-foreground shrink-0" />
            <div className="truncate">
              <p className="text-[9px] text-muted-foreground font-bold uppercase leading-none mb-0.5">
                마감일
              </p>
              <p className="font-medium leading-none">
                {epic.dueDate ? format(new Date(epic.dueDate), "yyyy.MM.dd") : "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-2 text-xs font-medium">
            <Folder className="size-3 text-violet-400" />
            <span>{epic.taskCount} 작업</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-1 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-emerald-600">
              {epic.completedTasks} 완료
            </span>
          </div>
        </div>
      </CardContent>
      <div className="absolute top-0 left-0 w-1 h-full bg-violet-400 opacity-50" />
    </Card>
  );
}
