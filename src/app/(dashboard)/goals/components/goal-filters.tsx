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
type SortOption = "latest" | "dueDate" | "priority";

export function GoalFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status");
  const currentSort = searchParams.get("sort") as SortOption | null;

  const handleStatusChange = (status: GoalStatus | "전체") => {
    const params = new URLSearchParams(searchParams);
    if (status === "전체") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    router.push(`/goals?${params.toString()}`);
  };

  const handleSortChange = (sort: SortOption) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", sort);
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
            {currentSort === "latest"
              ? "최신순"
              : currentSort === "dueDate"
                ? "마감일순"
                : currentSort === "priority"
                  ? "우선순위순"
                  : "정렬 기준"}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleSortChange("latest")}>
            최신순
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSortChange("dueDate")}>
            마감일순
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSortChange("priority")}>
            우선순위순
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
