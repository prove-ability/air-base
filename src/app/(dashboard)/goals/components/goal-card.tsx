import type { goalStatusEnum, goalPriorityEnum } from "@/server/db/schema";
import type { FC } from "react";

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
  title: string;
  dueDate: string;
  progress: number;
  status: GoalStatus;
  priority: GoalPriority;
}

export const GoalCard: FC<GoalCardProps> = ({
  title,
  dueDate,
  progress,
  status,
  priority,
}) => {
  return (
    <Card className="hover:bg-accent/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{title}</h3>
            <Badge variant="outline" className={priorityColors[priority]}>
              {priority}
            </Badge>
          </div>
          <span className="text-sm text-muted-foreground">마감: {dueDate}</span>
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
  );
};
