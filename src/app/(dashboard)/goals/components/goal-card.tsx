import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { goalStatusEnum } from "@/server/db/schema";

type GoalStatus = (typeof goalStatusEnum.enumValues)[number];

interface GoalCardProps {
  title: string;
  dueDate: string;
  progress: number;
  status: GoalStatus;
}

export function GoalCard({ title, dueDate, progress, status }: GoalCardProps) {
  return (
    <Card className="hover:bg-accent/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
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
}
