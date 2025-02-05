"use client";

import { api } from "@/trpc/react";
import { GoalCard } from "./goal-card";
import { format } from "date-fns";

export function GoalList() {
  const { data: goals, isLoading } = api.goal.list.useQuery();

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (!goals?.length) {
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
        />
      ))}
    </div>
  );
}
