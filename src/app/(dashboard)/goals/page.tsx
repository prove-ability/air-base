import { GoalFilters } from "./components/goal-filters";
import { GoalList } from "./components/goal-list";
import Link from "next/link";

export const metadata = {
  title: "목표 목록",
};

export default async function GoalsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">목표 관리</h1>
        <Link
          href="/goals/new"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          scroll={false}
        >
          새 목표 추가
        </Link>
      </div>
      <GoalFilters />
      <GoalList />
    </div>
  );
}
