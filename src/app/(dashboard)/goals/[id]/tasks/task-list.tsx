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

interface TaskListProps {
  goalId: number;
}

export function TaskList({ goalId }: TaskListProps) {
  const { data: tasks, isLoading } = api.task.list.useQuery(goalId);
  const utils = api.useUtils();

  const updateStatus = api.task.updateStatus.useMutation({
    onSuccess: () => {
      void utils.task.list.invalidate(goalId);
    },
  });

  const deleteTask = api.task.delete.useMutation({
    onSuccess: () => {
      void utils.task.list.invalidate(goalId);
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
                  checked={task.status === "완료"}
                  onCheckedChange={(checked) => {
                    updateStatus.mutate({
                      id: task.id,
                      status: checked ? "완료" : "대기",
                    });
                  }}
                />
                <div>
                  <CardTitle className="text-base">{task.title}</CardTitle>
                  {task.description && (
                    <CardDescription>{task.description}</CardDescription>
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
