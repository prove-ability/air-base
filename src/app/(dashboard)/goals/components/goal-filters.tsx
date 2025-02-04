"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export function GoalFilters() {
  return (
    <div className="mb-6 flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          전체
        </Button>
        <Button variant="ghost" size="sm">
          진행중
        </Button>
        <Button variant="ghost" size="sm">
          완료
        </Button>
        <Button variant="ghost" size="sm">
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
