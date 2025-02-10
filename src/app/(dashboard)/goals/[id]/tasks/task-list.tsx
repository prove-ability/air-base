"use client";

import { api } from "@/trpc/react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface TaskListProps {
  goalId: number;
}

export function TaskList({ goalId }: TaskListProps) {
  const { data: tasks, isLoading } = api.task.list.useQuery(goalId);
  const utils = api.useUtils();
  const { toast } = useToast();

  const updateStatus = api.task.updateStatus.useMutation({
    onMutate: async ({ id, status }) => {
      // 이전 데이터 백업
      const previousTasks = utils.task.list.getData(goalId);

      // 낙관적으로 캐시 업데이트
      utils.task.list.setData(goalId, (old) =>
        old?.map((task) => (task.id === id ? { ...task, status } : task)),
      );

      return { previousTasks };
    },
    onError: (err, variables, context) => {
      // 에러 발생 시 이전 상태로 롤백
      if (context?.previousTasks) {
        utils.task.list.setData(goalId, context.previousTasks);
      }
      toast({
        variant: "destructive",
        title: "상태 변경 실패",
        description: "다시 시도해주세요.",
      });
    },
    onSettled: () => {
      // 서버와 동기화
      void utils.task.list.invalidate(goalId);
      void utils.goal.list.invalidate();
    },
  });

  const deleteTask = api.task.delete.useMutation({
    onMutate: async (taskId) => {
      const previousTasks = utils.task.list.getData(goalId);

      utils.task.list.setData(goalId, (old) =>
        old?.filter((task) => task.id !== taskId),
      );

      return { previousTasks };
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        utils.task.list.setData(goalId, context.previousTasks);
      }
      toast({
        variant: "destructive",
        title: "삭제 실패",
        description: "다시 시도해주세요.",
      });
    },
    onSettled: () => {
      void utils.task.list.invalidate(goalId);
      void utils.goal.list.invalidate();
    },
  });

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (!tasks?.length) {
    return <div>등록된 태스크가 없습니다.</div>;
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2">
                <Checkbox
                  id={`task-${task.id}`}
                  checked={task.status === "완료"}
                  onCheckedChange={(checked) => {
                    updateStatus.mutate({
                      id: task.id,
                      status: checked ? "완료" : "대기",
                    });
                  }}
                  aria-label={`${task.title} 완료 여부`}
                />
                <div>
                  <CardTitle className="text-base">{task.title}</CardTitle>
                  {task.description && (
                    <CardDescription
                      id={`task-desc-${task.id}`}
                      aria-describedby={`task-desc-${task.id}`}
                    >
                      {task.description}
                    </CardDescription>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteTask.mutate(task.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          {task.dueDate && (
            <CardContent>
              <p className="text-sm text-muted-foreground">
                마감일: {format(task.dueDate, "PPP", { locale: ko })}
              </p>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
