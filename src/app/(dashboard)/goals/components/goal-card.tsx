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
}

export const GoalCard: FC<GoalCardProps> = ({
  id,
  title,
  startDate,
  dueDate,
  progress,
  status,
  priority,
}) => {
  return (
    <Link href={`/goals/${id}`}>
      <Card className="transition-colors hover:bg-accent/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{title}</h3>
              <Badge variant="outline" className={priorityColors[priority]}>
                {priority}
              </Badge>
            </div>
            <div className="flex flex-col items-end gap-1 text-sm text-muted-foreground">
              {startDate && <span>시작: {startDate}</span>}
              <span>마감: {dueDate}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{status}</span>
            <Progress value={progress} className="flex-1" />
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
