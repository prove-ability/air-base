"use client";

import { TaskList } from "./tasks/task-list";
import { NewTaskForm } from "./tasks/new-task-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useParams } from "next/navigation";
import { api } from "@/trpc/react";
import { GoalCard } from "../components/goal-card";
import { format } from "date-fns";

export default function GoalPage() {
  const params = useParams<{ id: string }>();
  const goalId = parseInt(params.id);

  const { data: goal, isLoading } = api.goal.get.useQuery(goalId);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (!goal) {
    return <div>목표를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <GoalCard
          id={goal.id}
          title={goal.title}
          startDate={
            goal.startDate ? format(goal.startDate, "yyyy-MM-dd") : undefined
          }
          dueDate={goal.dueDate ? format(goal.dueDate, "yyyy-MM-dd") : "없음"}
          progress={goal.progress ?? 0}
          status={goal.status}
          priority={goal.priority}
          taskStats={goal.taskStats}
        />
      </div>

      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">태스크 목록</h2>
        <Sheet>
          <SheetTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />새 태스크
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>새 태스크 추가</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <NewTaskForm goalId={goalId} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <TaskList goalId={goalId} />
    </div>
  );
}
