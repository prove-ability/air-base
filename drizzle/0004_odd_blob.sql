ALTER TABLE "air-base_goal" RENAME COLUMN "goal_status" TO "status";--> statement-breakpoint
ALTER TABLE "air-base_goal" ALTER COLUMN "status" SET DEFAULT '진행전';--> statement-breakpoint
ALTER TABLE "air-base_task" ALTER COLUMN "status" SET NOT NULL;