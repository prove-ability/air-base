"use client";

import { useRouter } from "next/navigation";
import { NewGoalForm } from "../../components/new-goal-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function NewGoalModalPage() {
  const router = useRouter();
  return (
    <Dialog defaultOpen onOpenChange={() => router.back()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 목표 추가</DialogTitle>
          <DialogDescription>
            새로운 목표를 설정하고 진행 상황을 추적해보세요.
          </DialogDescription>
        </DialogHeader>
        <NewGoalForm />
      </DialogContent>
    </Dialog>
  );
}
