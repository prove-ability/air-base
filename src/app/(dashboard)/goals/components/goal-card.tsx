import type { goalStatusEnum, goalPriorityEnum } from "@/server/db/schema";
import type { FC } from "react";
import Link from "next/link";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

type GoalStatus = (typeof goalStatusEnum.enumValues)[number];
type GoalPriority = (typeof goalPriorityEnum.enumValues)[number];

const priorityColors = {
  긴급: "text-rose-600 dark:text-rose-500",
  높음: "text-red-500 dark:text-red-400",
  보통: "text-yellow-500 dark:text-yellow-400",
  낮음: "text-blue-500 dark:text-blue-400",
} as const;

interface GoalCardProps {
  id: number;
  title: string;
  startDate?: string;
  dueDate: string;
  progress: number;
  status: GoalStatus;
  priority: GoalPriority;
  taskStats: {
    total: number;
    completed: number;
  };
}

export const GoalCard: FC<GoalCardProps> = ({
  id,
  title,
  startDate,
  dueDate,
  progress,
  status,
  priority,
  taskStats,
}) => {
  return (
    <Link href={`/goals/${id}`}>
      <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-primary/10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold transition-colors group-hover:text-primary">
                {title}
              </h3>
              <Badge
                variant="outline"
                className={`${priorityColors[priority]} transition-all duration-300 group-hover:scale-105`}
              >
                {priority}
              </Badge>
            </div>
            <div className="flex flex-col items-end gap-1 text-sm text-muted-foreground">
              {startDate && (
                <span className="transition-colors group-hover:text-primary">
                  시작: {startDate}
                </span>
              )}
              <span className="transition-colors group-hover:text-primary">
                마감: {dueDate}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground transition-colors group-hover:text-primary">
                {status}
              </span>
              <Progress
                value={progress}
                className="flex-1 transition-all duration-300 group-hover:bg-primary/20"
                indicatorClassName="transition-all duration-300 group-hover:bg-primary"
              />
              <span className="text-sm text-muted-foreground transition-colors group-hover:text-primary">
                {progress}%
              </span>
            </div>
            <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
              <span className="transition-colors group-hover:text-primary">
                태스크:
              </span>
              <span className="transition-colors group-hover:text-primary">
                {taskStats.completed}/{taskStats.total}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
