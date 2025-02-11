"use client";

import { TaskList } from "./tasks/task-list";
import { NewTaskForm } from "./tasks/new-task-form";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { GoalCard } from "../components/goal-card";
import { format } from "date-fns";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const LoadingState = () => {
  return (
    <div className="space-y-8 animate-in fade-in-50">
      {/* 목표 카드 로딩 상태 */}
      <div className="animate-pulse">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-6 w-64 rounded bg-muted"></div>
                <div className="h-4 w-48 rounded bg-muted"></div>
              </div>
              <div className="h-8 w-24 rounded bg-muted"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-2 w-full rounded bg-muted"></div>
              </div>
              <div className="flex justify-end">
                <div className="h-4 w-32 rounded bg-muted"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 태스크 섹션 로딩 상태 */}
      <div>
        <div className="mb-8 flex items-center justify-between">
          <div className="h-8 w-32 rounded bg-muted"></div>
          <div className="h-10 w-24 rounded bg-muted"></div>
        </div>

        <div className="space-y-4">
          {Array.from<undefined, JSX.Element>({ length: 3 }, (_, i) => (
            <Card
              key={i}
              className="animate-pulse"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded bg-muted"></div>
                    <div className="space-y-2">
                      <div className="h-5 w-48 rounded bg-muted"></div>
                      <div className="h-4 w-32 rounded bg-muted"></div>
                    </div>
                  </div>
                  <div className="h-8 w-8 rounded bg-muted"></div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function GoalPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const goalId = parseInt(params.id);

  const { data: goal, isLoading } = api.goal.get.useQuery(goalId);
  const utils = api.useUtils();

  const deleteGoal = api.goal.delete.useMutation({
    onSuccess: (deletedGoal) => {
      toast({
        title: "목표가 삭제되었습니다",
        description: `"${deletedGoal.title}" 목표가 삭제되었습니다.`,
      });
      void utils.goal.list.invalidate();
      router.push("/goals");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "삭제 실패",
        description: error.message,
      });
    },
  });

  if (isLoading) {
    return <LoadingState />;
  }

  if (!goal) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
        <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">목표를 찾을 수 없습니다</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          요청하신 목표를 찾을 수 없습니다. 다시 확인해주세요.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 animate-in fade-in-50">
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                목표 삭제
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>정말 이 목표를 삭제하시겠습니까?</DialogTitle>
                <DialogDescription>
                  이 작업은 되돌릴 수 없으며, 목표와 관련된 모든 태스크가 함께
                  삭제됩니다. 삭제된 데이터는 복구할 수 없습니다.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    const closeDialog = document.getElementById(
                      "close-delete-dialog",
                    );
                    if (closeDialog instanceof HTMLButtonElement) {
                      closeDialog.click();
                    }
                  }}
                >
                  취소
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteGoal.mutate(goalId)}
                  disabled={deleteGoal.isPending}
                >
                  {deleteGoal.isPending ? "삭제 중..." : "삭제"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
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
