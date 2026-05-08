import { format, addDays } from "date-fns";
import { ko } from "date-fns/locale";
import { useMemo } from "react";

interface TimelineHeaderProps {
  timelineStart: Date;
  totalDays: number;
  dayWidth: number;
}

export function TimelineHeader({
  timelineStart,
  totalDays,
  dayWidth,
}: TimelineHeaderProps) {
  const dates = useMemo(() => {
    return Array.from({ length: totalDays }, (_, i) =>
      addDays(timelineStart, i),
    );
  }, [timelineStart, totalDays]);

  return (
    <div
      className="flex border-b bg-card/95 backdrop-blur-sm sticky top-0 z-20 w-full"
      style={{ width: totalDays * dayWidth }}
    >
      {dates.map((date) => (
        <div
          key={date.toISOString()}
          className="flex flex-col items-center justify-center border-r border-border/50 last:border-r-0 shrink-0"
          style={{ width: dayWidth }}
        >
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
            {format(date, "MMM", { locale: ko })}
          </span>
          <span className="text-sm font-bold">{format(date, "d")}</span>
        </div>
      ))}
    </div>
  );
}
