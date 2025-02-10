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

export default function GoalPage() {
  const params = useParams<{ id: string }>();
  const goalId = parseInt(params.id);

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">태스크 관리</h1>
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
