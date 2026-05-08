import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CreatableSelect } from "@/components/ui/creatable-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CircleAvatar from "@/components/ui/circle-avatar";
import { DEFAULT_AVATAR } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { TaskFormSchema } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod/v3";
import { useFindWorkspaceMembers } from "@/features/workspace-member/query";
import { Role } from "@/features/workspace-member/type";
import { useSession } from "@/features/user/query";
import { useFindLabelsByProjectId } from "@/features/project/query";
import { TaskPriorityConfig } from "../enum";
import { useFindEpics } from "@/features/epic/query";
import { useFindMilestones } from "@/features/milestone/query";
import { Epic } from "@/features/epic/type";
import { Milestone } from "@/features/milestone/type";

const TASK_PRIORITY_OPTIONS = Object.entries(TaskPriorityConfig).map(
  ([value, config]) => ({
    value,
    label: config.label,
    color: config.dotColor,
  }),
);

const TASK_STATUS_OPTIONS = [
  { value: "TODO", label: "할 일", color: "bg-blue-500" },
  { value: "IN_PROGRESS", label: "진행중", color: "bg-amber-500" },
  { value: "REVIEW", label: "검토중", color: "bg-indigo-500" },
  { value: "DONE", label: "완료", color: "bg-emerald-500" },
] as const;

interface Props {
  defaultValues?: z.infer<typeof TaskFormSchema>;
  onSubmit: (values: z.infer<typeof TaskFormSchema>) => void;
  isDisabled?: boolean;
  id?: string;
  workspaceId?: string;
  projectId?: string;
}

type ProjectLabel = {
  id: string;
  name: string;
  bgColor: string;
  textColor: string;
};

export default function TaskForm({
  defaultValues,
  onSubmit,
  isDisabled,
  id,
  workspaceId,
  projectId,
}: Props) {
  const { data: session } = useSession();
  const { data: workspaceMembers = [] } = useFindWorkspaceMembers(workspaceId);
  const { data: projectLabels = [] } = useFindLabelsByProjectId(projectId);
  const { data: epics = [] } = useFindEpics(projectId);
  const { data: milestones = [] } = useFindMilestones(projectId);

  const members = workspaceMembers.map((member) => ({
    id: member.user.id,
    name: member.user.name || "Unknown User",
    image: member.user.image || DEFAULT_AVATAR,
  }));

  const myRole = workspaceMembers.find(
    (member) => member.userId === session?.id,
  )?.role;
  const isAdmin = myRole === Role.ADMIN || myRole === Role.OWNER;

  console.log("myRole: ", myRole);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (defaultValues?.labelId) {
      const matchedLabel = (projectLabels as ProjectLabel[]).find(
        (l) => l.id === defaultValues.labelId,
      );
      if (matchedLabel) setLabel(matchedLabel.name);
    } else if (defaultValues?.labelName) {
      setLabel(defaultValues.labelName);
    }
  }, [defaultValues, projectLabels]);

  const form = useForm<z.infer<typeof TaskFormSchema>>({
    resolver: zodResolver(TaskFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  useEffect(() => {
    if (!id && !isAdmin && session?.id) {
      form.setValue("assigneeId", session.id, { shouldValidate: true });
    }
  }, [form, isAdmin, session?.id, id]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          if (form.getValues("dueDate") === undefined) {
            form.setError("dueDate", {
              type: "manual",
            });
          } else {
            const normalizedLabel = label.trim();
            const matchedLabel = (projectLabels as ProjectLabel[]).find(
              (l) => l.name.toLowerCase() === normalizedLabel.toLowerCase(),
            );

            onSubmit({
              ...values,
              epicId: values.epicId === "none" ? null : values.epicId,
              milestoneId:
                values.milestoneId === "none" ? null : values.milestoneId,
              labelId: matchedLabel?.id || undefined,
              labelName:
                !matchedLabel && normalizedLabel ? normalizedLabel : "",
            });
          }
        })}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>작업 제목</FormLabel>
              <FormControl>
                <Input placeholder="작업 제목을 입력하세요" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="assigneeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>담당자</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!isAdmin}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="담당자를 선택하세요" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent position="popper" side="bottom">
                    {members.map((member) => (
                      <SelectItem
                        key={member.id}
                        value={member.id}
                        className="h-12"
                      >
                        <div className="flex items-center gap-2">
                          <CircleAvatar
                            name={member.name}
                            url={member.image || DEFAULT_AVATAR}
                            className="size-6"
                          />
                          <span>{member.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>우선순위</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="우선순위를 선택하세요" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent position="popper" side="bottom">
                    {TASK_PRIORITY_OPTIONS.map((priority) => (
                      <SelectItem
                        key={priority.value}
                        value={priority.value}
                        className="h-12"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`size-4 rounded-full ${priority.color}`}
                          />
                          <span>{priority.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>시작일</FormLabel>
                <Popover
                  modal={true}
                  open={startDateOpen}
                  onOpenChange={setStartDateOpen}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: ko })
                        ) : (
                          <span>시작일을 선택하세요</span>
                        )}
                        <CalendarIcon className="ml-auto size-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setStartDateOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>마감일</FormLabel>
                <Popover
                  modal={true}
                  open={endDateOpen}
                  onOpenChange={setEndDateOpen}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: ko })
                        ) : (
                          <span>마감일을 선택하세요</span>
                        )}
                        <CalendarIcon className="ml-auto size-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setEndDateOpen(false);
                      }}
                      disabled={(date) => {
                        const startDate = form.getValues("startDate");
                        return startDate ? date < startDate : false;
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>작업 상태</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={defaultValues?.status === "DONE"}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="작업 상태를 선택하세요" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent position="popper" side="bottom">
                    {TASK_STATUS_OPTIONS.map((status) => (
                      <SelectItem
                        key={status.value}
                        value={status.value}
                        className="h-12"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`size-4 rounded-full ${status.color}`}
                          />
                          <span>{status.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormItem>
            <FormLabel>라벨</FormLabel>
            <CreatableSelect
              options={(projectLabels as ProjectLabel[]).map((l) => ({
                value: l.id,
                label: l.name,
                color: l.bgColor,
              }))}
              value={label}
              onChange={setLabel}
              placeholder="라벨을 검색 혹은 입력"
            />
          </FormItem>
        </div>
        <FormField
          control={form.control}
          name="epicId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>에픽</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value || "none"}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="에픽을 선택하세요" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent position="popper" side="bottom">
                  <SelectItem value="none">선택 안 함</SelectItem>
                  {epics.map((epic: Epic) => (
                    <SelectItem key={epic.id} value={epic.id} className="h-12">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-primary opacity-70">
                          EPIC-{epic.epicNumber}
                        </span>
                        <span className="line-clamp-1">{epic.title}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="milestoneId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>마일스톤</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value || "none"}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="마일스톤을 선택하세요" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent position="popper" side="bottom">
                  <SelectItem value="none">선택 안 함</SelectItem>
                  {milestones.map((milestone: Milestone) => (
                    <SelectItem
                      key={milestone.id}
                      value={milestone.id}
                      className="h-12"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-bold text-primary opacity-70">
                          {format(new Date(milestone.dueDate), "yyyy.MM.dd")}
                        </span>
                        <span>{milestone.title}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button type="submit" disabled={isDisabled}>
            {id ? "수정" : "생성"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
