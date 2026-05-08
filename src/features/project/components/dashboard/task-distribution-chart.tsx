import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { Label, PolarGrid, RadialBar, RadialBarChart } from "recharts";

interface TaskDistributionChartProps {
  counts: {
    todo: number;
    inProgress: number;
    review: number;
    done: number;
    total: number;
  };
}

const chartConfig = {
  todo: {
    label: "할 일",
    color: "#3b82f6",
  },
  inProgress: {
    label: "진행중",
    color: "#f59e0b",
  },
  review: {
    label: "검토중",
    color: "#6366f1",
  },
  done: {
    label: "완료",
    color: "#22c55e",
  },
} satisfies ChartConfig;

export default function TaskDistributionChart({
  counts,
}: TaskDistributionChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const total = counts.total ?? 0;

  const data = [
    { status: "todo", value: counts.todo, fill: "var(--color-todo)" },
    {
      status: "inProgress",
      value: counts.inProgress,
      fill: "var(--color-inProgress)",
    },
    { status: "review", value: counts.review, fill: "var(--color-review)" },
    { status: "done", value: counts.done, fill: "var(--color-done)" },
  ].reverse();

  if (!mounted) {
    return (
      <Card className="flex flex-col p-4">
        <h3 className="text-lg font-semibold mb-4">작업 분포</h3>
        <CardContent className="flex-1 pb-0 min-h-[350px] flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold">{total}</div>
            <div className="text-lg text-muted-foreground">총 작업 수</div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          <p>프로젝트 내 작업 상태별 분포</p>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col p-4 lg:h-full">
      <h3 className="text-lg font-semibold mb-4 text-center sm:text-left">
        작업 분포
      </h3>
      <CardContent className="lg:flex-1 flex items-center justify-center pb-0">
        {total > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="w-full aspect-square max-h-[350px]"
          >
            <RadialBarChart
              data={data}
              startAngle={90}
              endAngle={450}
              innerRadius={60}
              outerRadius={120}
            >
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel nameKey="status" />}
              />
              <PolarGrid gridType="circle" />
              <RadialBar dataKey="value" background cornerRadius={10} />
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {total.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 32}
                          className="fill-muted-foreground text-lg"
                        >
                          총 작업 수
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </RadialBarChart>
          </ChartContainer>
        ) : (
          <div className="mx-auto aspect-square max-h-[350px] flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-medium text-muted-foreground">
                작업이 없습니다
              </div>
              <div className="text-sm text-muted-foreground">
                새 작업을 추가해보세요
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground gap-4 flex-wrap">
        {Object.entries(chartConfig).map(([key, config]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div
              className="size-2 rounded-full"
              style={{ backgroundColor: config.color }}
            />
            <span>{config.label}</span>
          </div>
        ))}
      </CardFooter>
    </Card>
  );
}
