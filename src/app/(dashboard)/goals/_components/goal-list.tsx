"use client";

import { GoalCard } from "./goal-card";

// TODO: API 연동 후 실제 데이터로 교체
const MOCK_GOALS = [
  {
    id: 1,
    title: "운동 습관 만들기",
    dueDate: "2024.12.31",
    progress: 60,
    status: "진행중" as const,
  },
  {
    id: 2,
    title: "독서 목표",
    dueDate: "2024.06.30",
    progress: 20,
    status: "보류" as const,
  },
];

export function GoalList() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {MOCK_GOALS.map((goal) => (
        <GoalCard key={goal.id} {...goal} />
      ))}
    </div>
  );
}
