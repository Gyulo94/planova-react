import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import CircleAvatar from "@/components/ui/circle-avatar";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Activity } from "@/features/activity/type";
import { DEFAULT_AVATAR } from "@/lib/constants";

interface ActivityLogProps {
  activities?: Activity[];
  isLoading: boolean;
}

export default function ActivityLog({
  activities,
  isLoading,
}: ActivityLogProps) {
  return (
    <Card className="p-4 gap-0">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">활동 로그</h3>
      </div>

      <Card className="p-0 rounded-xl border-none shadow-none overflow-hidden">
        <CardContent className="p-0">
          <ScrollArea className="h-[500px] px-4">
            <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-border/40">
              {isLoading ? (
                Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <Skeleton className="size-6 rounded-full shrink-0" />
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-2 w-1/4" />
                    </div>
                  </div>
                ))
              ) : !activities || activities.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-12">
                  활동 로그가 없습니다.
                </p>
              ) : (
                activities.slice(0).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex gap-3 items-start relative"
                  >
                    <div className="relative z-10 shrink-0 mt-0.5">
                      <CircleAvatar
                        url={activity.user.image ?? DEFAULT_AVATAR}
                        name={activity.user.name ?? activity.user.email}
                        className="size-[22px] border-2 border-background"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-snug">
                        <span className="font-medium">
                          {activity.user.name || activity.user.email}
                        </span>{" "}
                        <span className="text-muted-foreground">
                          {activity.description}
                        </span>
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">
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
        </CardContent>
      </Card>
    </Card>
  );
}
