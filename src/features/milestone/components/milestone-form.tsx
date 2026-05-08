import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod/v3";
import { MilestoneFormSchema } from "../schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface MilestoneFormProps {
  onSubmit: (values: z.infer<typeof MilestoneFormSchema>) => void;
  defaultValues: z.infer<typeof MilestoneFormSchema>;
  isDisabled?: boolean;
  id?: string;
}

export default function MilestoneForm({
  onSubmit,
  defaultValues,
  isDisabled,
  id,
}: MilestoneFormProps) {
  const form = useForm<z.infer<typeof MilestoneFormSchema>>({
    resolver: zodResolver(MilestoneFormSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>제목</FormLabel>
              <FormControl>
                <Input
                  placeholder="마일스톤 제목을 입력하세요"
                  {...field}
                  disabled={isDisabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>설명</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="마일스톤에 대한 설명을 입력하세요"
                  {...field}
                  disabled={isDisabled}
                  rows={3}
                />
              </FormControl>
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
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                      disabled={isDisabled}
                    >
                      {field.value ? (
                        format(field.value, "yyyy.MM.dd")
                      ) : (
                        <span>마감일 선택</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {id && (
          <FormField
            control={form.control}
            name="completed"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isDisabled}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>완료됨</FormLabel>
                </div>
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isDisabled}>
            {id ? "수정" : "생성"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
