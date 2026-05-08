import CircleProgress from "@/components/ui/circle-process";
import { Card } from "@/components/ui/card";

interface StatsCardsProps {
  stats: {
    projects: number;
    members: number;
    todo: number;
    inProgress: number;
    review: number;
    done: number;
    total: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const generatePercentage = (count: number) => {
    if (stats.total === 0) return 0;
    return Math.round((count / stats.total) * 100);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4">
        <CircleProgress
          title="프로젝트"
          value={100}
          subTitle={`${stats.projects}개의 활성 프로젝트`}
          variant="default"
          customValue={stats.projects.toString()}
        />
      </Card>

      <Card className="p-4">
        <CircleProgress
          title="멤버"
          value={100}
          subTitle={`${stats.members}명의 팀원 참여 중`}
          variant="info"
          customValue={stats.members.toString()}
        />
      </Card>

      <Card className="p-4">
        <CircleProgress
          title="진행률"
          value={generatePercentage(stats.done)}
          subTitle={`전체 작업의 ${generatePercentage(stats.done)}% 완료`}
          variant="success"
        />
      </Card>

      <Card className="p-4">
        <CircleProgress
          title="미완료 작업"
          value={generatePercentage(
            stats.todo + stats.inProgress + stats.review,
          )}
          subTitle={`${
            stats.todo + stats.inProgress + stats.review
          }개의 작업 대기/진행 중`}
          variant="review"
        />
      </Card>
    </div>
  );
}
