"use client";

import { api } from "@/trpc/react";
import { GoalCard } from "./goal-card";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";

export function GoalList() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  const { data: goals, isLoading } = api.goal.list.useQuery(
    status ? { status: status as any } : undefined,
    {
      refetchOnWindowFocus: true,
    },
  );

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (!goals?.length) {
    if (status === "진행전") {
      return <div>진행 전인 목표가 없습니다. 새로운 목표를 추가해보세요!</div>;
    }
    if (status === "진행중") {
      return <div>진행 중인 목표가 없습니다. 목표를 시작해보세요!</div>;
    }
    if (status === "완료") {
      return <div>완료된 목표가 없습니다. 목표를 달성해보세요!</div>;
    }
    if (status === "보류") {
      return <div>보류 중인 목표가 없습니다.</div>;
    }
    return <div>목표가 없습니다. 새로운 목표를 추가해보세요!</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {goals.map((goal) => (
        <GoalCard
          key={goal.id}
          title={goal.title}
          dueDate={
            goal.dueDate ? format(goal.dueDate, "yyyy.MM.dd") : "기한 없음"
          }
          progress={goal.progress ?? 0}
          status={goal.status}
          priority={goal.priority}
        />
      ))}
    </div>
  );
}
