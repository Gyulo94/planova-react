import { useParams } from "react-router-dom";
import { ChevronDownIcon, ChevronRightIcon, HistoryIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { useFindActivitiesByTask } from "@/features/activity/query";
import CircleAvatar from "@/components/ui/circle-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { DEFAULT_AVATAR } from "@/lib/constants";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ActivitySectionProps {
  open: boolean;
  onToggle: () => void;
}

export default function ActivitySection({
  open,
  onToggle,
}: ActivitySectionProps) {
  const { taskId } = useParams();
  const { data: activities, isLoading } = useFindActivitiesByTask(taskId);

  return (
    <div className="mt-6">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 w-full text-left"
      >
        {open ? (
          <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
        )}
        <HistoryIcon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-semibold text-foreground">활동 로그</span>
        {!isLoading && activities && (
          <span className="text-xs text-muted-foreground ml-1">
            {activities.length}
          </span>
        )}
      </button>

      {open && (
        <ScrollArea className="h-[250px] mt-4 pr-4">
          <div className="ml-6 py-2 space-y-6 relative before:absolute before:left-[11px] before:top-4 before:bottom-4 before:w-[1px] before:bg-border/40">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <Skeleton className="size-6 rounded-full shrink-0" />
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : activities?.length === 0 ? (
              <p className="text-xs text-muted-foreground pl-2">
                아직 활동 로그가 없습니다.
              </p>
            ) : (
              activities?.map((activity) => (
                <div
                  key={activity.id}
                  className="flex gap-4 items-start relative"
                >
                  <div className="relative z-10 shrink-0 mt-0.5">
                    <CircleAvatar
                      url={activity.user.image ?? DEFAULT_AVATAR}
                      name={activity.user.name ?? activity.user.email}
                      className="size-6 border-2 border-background"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-foreground">
                      <span className="font-medium">
                        {activity.user.name || activity.user.email}
                      </span>{" "}
                      <span className="text-muted-foreground">
                        {activity.description}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {formatDistanceToNow(new Date(activity.createdAt), {
                        addSuffix: true,
                        locale: ko,
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
