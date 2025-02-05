DO $$ BEGIN
 CREATE TYPE "public"."goal_priority" AS ENUM('낮음', '보통', '높음', '긴급');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "air-base_goal" ADD COLUMN "priority" "goal_priority" DEFAULT '보통' NOT NULL;