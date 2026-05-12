import { useParams } from "react-router-dom";
import { HistoryIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { useFindActivitiesByProject } from "@/features/activity/query";
import CircleAvatar from "@/components/ui/circle-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useActivitySidebarStore } from "../store";

export default function ProjectActivitySidebar() {
  const { projectId: paramsProjectId } = useParams();
  const {
    isOpen,
    onClose,
    projectId: storeProjectId,
  } = useActivitySidebarStore();

  const projectId = storeProjectId || paramsProjectId;

  const { data: activities, isLoading } = useFindActivitiesByProject(projectId);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-[350px] sm:max-w-md p-0 flex flex-col gap-0"
      >
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center gap-2">
            <HistoryIcon className="h-4 w-4 text-muted-foreground" />
            <SheetTitle className="text-base">최근 활동</SheetTitle>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 p-4 max-h-screen">
          <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-border/40">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <Skeleton className="h-6 w-6 rounded-full shrink-0" />
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-2 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : activities?.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-xs text-muted-foreground">
                  아직 활동 내역이 없습니다.
                </p>
              </div>
            ) : (
              activities?.map((activity) => (
                <div
                  key={activity.id}
                  className="flex gap-3 items-start relative"
                >
                  <div className="relative z-10 shrink-0 mt-0.5">
                    <CircleAvatar
                      url={activity.user.image ?? undefined}
                      name={activity.user.name ?? activity.user.email}
                      className="h-[22px] w-[22px] border-2 border-background"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] leading-snug text-foreground">
                      <span className="font-medium">
                        {activity.user.name || activity.user.email}
                      </span>{" "}
                      <span className="text-muted-foreground">
                        {activity.description}
                      </span>
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">
                      {formatDistanceToNow(new Date(activity.createdAt), {
                        addSuffix: true,
                        locale: ko,
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
