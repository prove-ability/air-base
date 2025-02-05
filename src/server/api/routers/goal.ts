import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { goals, goalStatusEnum } from "@/server/db/schema";
import { and, eq, desc } from "drizzle-orm";

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
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const conditions = [eq(goals.userId, ctx.session.user.id)];

      if (input?.status) {
        conditions.push(eq(goals.status, input.status));
      }

      const userGoals = await ctx.db.query.goals.findMany({
        where: and(...conditions),
        orderBy: [desc(goals.createdAt)],
      });
      return userGoals;
    }),
});
