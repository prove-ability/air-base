import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface GoalCardProps {
  title: string;
  dueDate: string;
  progress: number;
  status: "진행중" | "완료" | "보류";
}

export function GoalCard({ title, dueDate, progress, status }: GoalCardProps) {
  return (
    <Card className="hover:bg-accent/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <span className="text-muted-foreground text-sm">마감: {dueDate}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground text-sm">{status}</span>
          <Progress value={progress} className="flex-1" />
          <span className="text-muted-foreground text-sm">{progress}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
