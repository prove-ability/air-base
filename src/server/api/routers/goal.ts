import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { goals } from "@/server/db/schema";
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

  list: protectedProcedure.query(async ({ ctx }) => {
    const userGoals = await ctx.db.query.goals.findMany({
      where: eq(goals.userId, ctx.session.user.id),
      orderBy: [desc(goals.createdAt)],
    });
    return userGoals;
  }),
});
