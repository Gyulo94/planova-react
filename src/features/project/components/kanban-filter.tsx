import { Button } from "@/components/ui/button";
import CircleAvatar from "@/components/ui/circle-avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusIcon } from "lucide-react";

export default function KanbanFilter() {
  return (
    <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
      <div className="flex gap-2">
        <Input placeholder="검색" className="w-full max-w-xs" />
        <div className="flex -space-x-3">
          <CircleAvatar
            name="ddd"
            url="https://cdn.imweb.me/upload/S20220518fbea59f8e9828/77d99edcb5dbf.jpg"
            isTooltipEnabled={true}
          />
          <CircleAvatar
            name="ddd"
            url="https://image.utoimage.com/preview/cp872722/2022/12/202212008462_500.jpg"
            isTooltipEnabled={true}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Select>
          <SelectTrigger className="w-full lg:w-auto">
            <SelectValue placeholder="담당자" />
          </SelectTrigger>
          <SelectContent position="popper" side="bottom">
            <SelectItem value="assignee">담당자</SelectItem>
            <SelectItem value="priority">우선순위</SelectItem>
            <SelectItem value="dueDate">마감일</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-full lg:w-auto">
            <SelectValue placeholder="우선순위" />
          </SelectTrigger>
          <SelectContent position="popper" side="bottom">
            <SelectItem value="LOW">낮음</SelectItem>
            <SelectItem value="MEDIUM">보통</SelectItem>
            <SelectItem value="HIGH">높음</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-full lg:w-auto">
            <SelectValue placeholder="레이블" />
          </SelectTrigger>
          <SelectContent position="popper" side="bottom">
            <SelectItem value="LOW">낮음</SelectItem>
            <SelectItem value="MEDIUM">보통</SelectItem>
            <SelectItem value="HIGH">높음</SelectItem>
          </SelectContent>
        </Select>

        <Button
          size={"sm"}
          className="w-full lg:w-auto"
          onClick={() => {
            // setProjects(workspace.projects || []);
            // onOpen(projectId, workspaceId);
          }}
        >
          <PlusIcon className="size-4 mr-2" />새 작업
        </Button>
      </div>
    </div>
  );
}
