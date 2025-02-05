"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { goalStatusEnum } from "@/server/db/schema";
import { useRouter, useSearchParams } from "next/navigation";

type GoalStatus = (typeof goalStatusEnum.enumValues)[number];

export function GoalFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status");

  const handleStatusChange = (status: GoalStatus | "전체") => {
    const params = new URLSearchParams(searchParams);
    if (status === "전체") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    router.push(`/goals?${params.toString()}`);
  };

  return (
    <div className="mb-6 flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Button
          variant={!currentStatus ? "outline" : "ghost"}
          size="sm"
          onClick={() => handleStatusChange("전체")}
        >
          전체
        </Button>
        <Button
          variant={currentStatus === "진행전" ? "outline" : "ghost"}
          size="sm"
          onClick={() => handleStatusChange("진행전")}
        >
          진행전
        </Button>
        <Button
          variant={currentStatus === "진행중" ? "outline" : "ghost"}
          size="sm"
          onClick={() => handleStatusChange("진행중")}
        >
          진행중
        </Button>
        <Button
          variant={currentStatus === "완료" ? "outline" : "ghost"}
          size="sm"
          onClick={() => handleStatusChange("완료")}
        >
          완료
        </Button>
        <Button
          variant={currentStatus === "보류" ? "outline" : "ghost"}
          size="sm"
          onClick={() => handleStatusChange("보류")}
        >
          보류
        </Button>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            정렬 기준
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>최신순</DropdownMenuItem>
          <DropdownMenuItem>마감일순</DropdownMenuItem>
          <DropdownMenuItem>우선순위순</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
