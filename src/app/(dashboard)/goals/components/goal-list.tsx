"use client";

import { api } from "@/trpc/react";
import { GoalCard } from "./goal-card";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import type { FC } from "react";
import type { goalStatusEnum } from "@/server/db/schema";
import { Loader2, Target, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type GoalStatus = (typeof goalStatusEnum.enumValues)[number];
type SortOption = "dueDate" | "priority";

const EmptyState: FC<{ status: GoalStatus | null }> = ({ status }) => {
  const messages = {
    진행전: {
      icon: <Target className="h-12 w-12 animate-pulse text-primary" />,
      title: "진행 전인 목표가 없습니다",
      description: "새로운 목표를 설정하고 도전해보세요!",
    },
    진행중: {
      icon: <ListTodo className="h-12 w-12 animate-pulse text-primary" />,
      title: "진행 중인 목표가 없습니다",
      description: "목표를 시작하고 한 걸음씩 나아가보세요!",
    },
    완료: {
      icon: <Target className="h-12 w-12 animate-pulse text-primary" />,
      title: "완료된 목표가 없습니다",
      description: "첫 번째 목표 달성을 위해 노력해보세요!",
    },
    보류: {
      icon: <Target className="h-12 w-12 animate-pulse text-primary" />,
      title: "보류 중인 목표가 없습니다",
      description: "잠시 멈춰있는 목표가 없습니다",
    },
    default: {
      icon: <Target className="h-12 w-12 animate-pulse text-primary" />,
      title: "목표가 없습니다",
      description: "새로운 목표를 추가하고 시작해보세요!",
    },
  };

  const content = status ? messages[status] : messages.default;

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
      {content.icon}
      <h3 className="mt-4 text-lg font-semibold">{content.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {content.description}
      </p>
      <Button asChild className="mt-4">
        <Link href="/goals/new" scroll={false}>
          새 목표 추가
        </Link>
      </Button>
    </div>
  );
};

const LoadingState = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from<undefined, JSX.Element>({ length: 6 }, (_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-lg border p-6 shadow-sm"
          style={{
            animationDelay: `${i * 100}ms`,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 w-48 rounded bg-muted"></div>
              <div className="h-3 w-32 rounded bg-muted"></div>
            </div>
            <div className="h-6 w-6">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <div className="h-2 w-full rounded bg-muted"></div>
            <div className="h-2 w-3/4 rounded bg-muted"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const GoalList: FC = () => {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const sort = searchParams.get("sort");

  const { data: goals, isLoading } = api.goal.list.useQuery(
    status || sort
      ? {
          ...(status && { status: status as GoalStatus }),
          ...(sort && { sort: sort as SortOption }),
        }
      : undefined,
    {
      refetchOnWindowFocus: true,
    },
  );

  if (isLoading) {
    return <LoadingState />;
  }

  if (!goals?.length) {
    return <EmptyState status={status as GoalStatus} />;
  }

  return (
    <div className="grid gap-4 duration-500 animate-in fade-in-50 md:grid-cols-2 lg:grid-cols-3">
      {goals.map((goal) => (
        <GoalCard
          key={goal.id}
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
      ))}
    </div>
  );
};
