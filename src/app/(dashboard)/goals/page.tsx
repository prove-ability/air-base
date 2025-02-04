import { auth } from "@/server/auth";
import { GoalList } from "./_components/goal-list";
import { GoalFilters } from "./_components/goal-filters";

export const metadata = {
  title: "목표 목록",
};

export default async function GoalsPage() {
  const session = await auth();

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">목표 관리</h1>
        <a
          href="/goals/new"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          새 목표 추가
        </a>
      </div>

      <GoalFilters />
      <GoalList />
    </div>
  );
}
