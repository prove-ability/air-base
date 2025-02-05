import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { goals, goalStatusEnum } from "@/server/db/schema";
import { and, eq, desc, asc, sql } from "drizzle-orm";

export const goalRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, "제목을 입력해주세요"),
        description: z.string().optional(),
        dueDate: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(goals).values({
        title: input.title,
        description: input.description,
        dueDate: input.dueDate,
        userId: ctx.session.user.id,
      });
    }),

  list: protectedProcedure
    .input(
      z
        .object({
          status: z.enum(goalStatusEnum.enumValues).optional(),
          sort: z.enum(["latest", "dueDate", "priority"]).optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const conditions = [eq(goals.userId, ctx.session.user.id)];

      if (input?.status) {
        conditions.push(eq(goals.status, input.status));
      }

      let orderBy = [desc(goals.createdAt)];

      if (input?.sort === "dueDate") {
        orderBy = [
          asc(sql`CASE WHEN ${goals.dueDate} IS NULL THEN 1 ELSE 0 END`),
          asc(goals.dueDate),
        ];
      } else if (input?.sort === "priority") {
        orderBy = [
          sql`CASE 
            WHEN ${goals.priority} = '긴급' THEN 1 
            WHEN ${goals.priority} = '높음' THEN 2 
            WHEN ${goals.priority} = '보통' THEN 3 
            WHEN ${goals.priority} = '낮음' THEN 4 
          END`,
          desc(goals.createdAt),
        ];
      }

      const userGoals = await ctx.db.query.goals.findMany({
        where: and(...conditions),
        orderBy,
      });
      return userGoals;
    }),
});
