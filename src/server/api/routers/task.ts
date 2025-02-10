import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { tasks, taskStatusEnum } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

export const taskRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, "제목을 입력해주세요"),
        description: z.string().optional(),
        dueDate: z.date().optional(),
        goalId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(tasks).values({
        title: input.title,
        description: input.description,
        dueDate: input.dueDate,
        goalId: input.goalId,
        userId: ctx.session.user.id,
      });
    }),

  list: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input: goalId }) => {
      const taskList = await ctx.db.query.tasks.findMany({
        where: and(
          eq(tasks.userId, ctx.session.user.id),
          eq(tasks.goalId, goalId),
        ),
        orderBy: (tasks, { desc }) => [desc(tasks.createdAt)],
      });
      return taskList;
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(taskStatusEnum.enumValues),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(tasks)
        .set({ status: input.status })
        .where(
          and(eq(tasks.id, input.id), eq(tasks.userId, ctx.session.user.id)),
        );
    }),

  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input: taskId }) => {
      await ctx.db
        .delete(tasks)
        .where(
          and(eq(tasks.id, taskId), eq(tasks.userId, ctx.session.user.id)),
        );
    }),
});
