import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFindProjectMembers } from "@/features/project-member/query";
import { useFindLabelsByProjectId } from "@/features/project/query";
import { useParams } from "react-router-dom";
import { useDeferredValue, useEffect, useState } from "react";
import { X } from "lucide-react";
import { useKanbanFilterStore } from "@/features/task/store";
import {
  AssigneeFilterContent,
  FilterButton,
  LabelFilterContent,
  MemberAvatarStack,
  PriorityFilterContent,
} from ".";

export default function KanbanFilter() {
  const { projectId } = useParams();

  const { data: projectMembers = [] } = useFindProjectMembers(projectId);
  const { data: labels = [] } = useFindLabelsByProjectId(projectId);

  const {
    search,
    assigneeIds,
    priorities,
    labelIds,
    setSearch,
    toggleAssigneeId,
    togglePriority,
    toggleLabelId,
    reset,
  } = useKanbanFilterStore();

  const [localSearch, setLocalSearch] = useState(search);
  const deferredSearch = useDeferredValue(localSearch);

  useEffect(() => {
    setSearch(deferredSearch);
  }, [deferredSearch, setSearch]);

  const hasActiveFilters =
    !!search ||
    assigneeIds.length > 0 ||
    priorities.length > 0 ||
    labelIds.length > 0;

  return (
    <div className="flex flex-row justify-between items-center gap-4">
      {/* 왼쪽: 검색 + 필터 */}
      <div className="flex items-center gap-3">
        <Input
          placeholder="검색 (제목, #번호)"
          className="w-56"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />

        <div className="flex items-center gap-2">
          <FilterButton
            label="담당자"
            count={assigneeIds.length}
            active={assigneeIds.length > 0}
          >
            <AssigneeFilterContent
              members={projectMembers}
              selectedIds={assigneeIds}
              onToggle={toggleAssigneeId}
            />
          </FilterButton>

          <FilterButton
            label="우선순위"
            count={priorities.length}
            active={priorities.length > 0}
          >
            <PriorityFilterContent
              selected={priorities}
              onToggle={togglePriority}
            />
          </FilterButton>

          <FilterButton
            label="라벨"
            count={labelIds.length}
            active={labelIds.length > 0}
          >
            <LabelFilterContent
              labels={labels}
              selectedIds={labelIds}
              onToggle={toggleLabelId}
            />
          </FilterButton>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={reset}
              className="text-muted-foreground hover:text-foreground gap-1"
            >
              <X className="w-4 h-4" />
              초기화
            </Button>
          )}
        </div>
      </div>
      <MemberAvatarStack members={projectMembers} visibleCount={6} />
    </div>
  );
}
