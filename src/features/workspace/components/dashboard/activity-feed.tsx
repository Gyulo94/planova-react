import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { LayoutDashboardIcon } from "lucide-react";
import CircleAvatar from "@/components/ui/circle-avatar";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Activity } from "@/features/activity/type";
import { DEFAULT_AVATAR } from "@/lib/constants";

interface ActivityFeedProps {
  activities?: Activity[];
  isLoading: boolean;
  workspaceId: string;
}

export default function ActivityFeed({
  activities,
  isLoading,
}: ActivityFeedProps) {
  return (
    <Card className="p-0 border-none bg-transparent shadow-none gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold tracking-tight">워크스페이스 활동</h3>
      </div>

      <Card className="rounded-xl overflow-hidden shadow-sm border-border/40">
        <CardContent>
          <ScrollArea className="h-[500px]">
            <div className="p-5 space-y-4 relative before:absolute before:left-[31px] before:top-6 before:bottom-6 before:w-[1px] before:bg-border/40">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <Skeleton className="h-[22px] w-[22px] rounded-full shrink-0" />
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-2 w-1/4" />
                    </div>
                  </div>
                ))
              ) : !activities || activities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                  <LayoutDashboardIcon className="size-8 mb-2 opacity-20" />
                  <p className="text-sm">최근 활동이 없습니다.</p>
                </div>
              ) : (
                activities.slice(0, 15).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex gap-3 items-start relative group"
                  >
                    <div className="relative z-10 shrink-0 mt-0.5">
                      <CircleAvatar
                        url={activity.user.image ?? DEFAULT_AVATAR}
                        name={activity.user.name ?? activity.user.email}
                        className="size-6 border-2 border-background shadow-sm"
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
                        {activity.createdAt
                          ? formatDistanceToNow(new Date(activity.createdAt), {
                              addSuffix: true,
                              locale: ko,
                            })
                          : "날짜 정보 없음"}
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
