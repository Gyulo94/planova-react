import { Card } from "@/components/ui/card";
import CircleProgress from "@/components/ui/circle-process";

type TaskCounts = {
  todo: number;
  inProgress: number;
  review: number;
  done: number;
  total: number;
};

export default function StatsCards({ taskCounts }: { taskCounts: TaskCounts }) {
  const generatePercentage = (count: number) => {
    if (taskCounts.total === 0) return 0;
    return Math.round((count / taskCounts.total) * 100);
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4 w-full">
        <CircleProgress
          title="할 일"
          value={generatePercentage(taskCounts.todo)}
          subTitle={`${taskCounts.todo}개 시작 예정`}
          variant="default"
        />
      </Card>

      <Card className="p-4">
        <CircleProgress
          title="진행중"
          value={generatePercentage(taskCounts.inProgress)}
          subTitle={`${taskCounts.inProgress}개 진행중`}
          variant="inProgress"
        />
      </Card>

      <Card className="p-4">
        <CircleProgress
          title="검토중"
          value={generatePercentage(taskCounts.review)}
          subTitle={`${taskCounts.review}개 검토중`}
          variant="review"
        />
      </Card>

      <Card className="p-4">
        <CircleProgress
          title="완료"
          value={generatePercentage(taskCounts.done)}
          subTitle={`${taskCounts.done}개 완료`}
          variant="success"
        />
      </Card>
    </div>
  );
}
