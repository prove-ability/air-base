import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { tasks, taskStatusEnum, goals } from "@/server/db/schema";
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

      // 새 태스크가 추가되면 목표 상태를 "진행중"으로 변경
      await ctx.db
        .update(goals)
        .set({ status: "진행중" })
        .where(
          and(
            eq(goals.id, input.goalId),
            eq(goals.userId, ctx.session.user.id),
          ),
        );
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
      const task = await ctx.db.query.tasks.findFirst({
        where: and(
          eq(tasks.id, input.id),
          eq(tasks.userId, ctx.session.user.id),
        ),
        columns: {
          goalId: true,
        },
      });

      if (!task) {
        throw new Error("태스크를 찾을 수 없습니다.");
      }

      await ctx.db
        .update(tasks)
        .set({ status: input.status })
        .where(
          and(eq(tasks.id, input.id), eq(tasks.userId, ctx.session.user.id)),
        );

      // 목표의 모든 태스크를 가져와서 진행률과 상태를 계산
      const goalTasks = await ctx.db.query.tasks.findMany({
        where: and(
          eq(tasks.goalId, task.goalId),
          eq(tasks.userId, ctx.session.user.id),
        ),
        columns: {
          status: true,
        },
      });

      const totalTasks = goalTasks.length;
      const completedTasks = goalTasks.filter(
        (task) => task.status === "완료",
      ).length;
      const progress = Math.round((completedTasks / totalTasks) * 100);

      // 목표 상태 결정
      let goalStatus: typeof goals.$inferSelect.status = "진행중";
      if (progress === 100) {
        goalStatus = "완료";
      } else if (progress === 0) {
        goalStatus = "진행전";
      }

      // 목표 업데이트
      await ctx.db
        .update(goals)
        .set({
          progress,
          status: goalStatus,
        })
        .where(
          and(eq(goals.id, task.goalId), eq(goals.userId, ctx.session.user.id)),
        );
    }),

  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input: taskId }) => {
      const task = await ctx.db.query.tasks.findFirst({
        where: and(eq(tasks.id, taskId), eq(tasks.userId, ctx.session.user.id)),
        columns: {
          goalId: true,
        },
      });

      if (!task) {
        throw new Error("태스크를 찾을 수 없습니다.");
      }

      await ctx.db
        .delete(tasks)
        .where(
          and(eq(tasks.id, taskId), eq(tasks.userId, ctx.session.user.id)),
        );

      // 태스크 삭제 후 남은 태스크들의 상태를 확인
      const remainingTasks = await ctx.db.query.tasks.findMany({
        where: and(
          eq(tasks.goalId, task.goalId),
          eq(tasks.userId, ctx.session.user.id),
        ),
        columns: {
          status: true,
        },
      });

      // 남은 태스크가 없으면 목표 상태를 "진행전"으로 변경
      if (remainingTasks.length === 0) {
        await ctx.db
          .update(goals)
          .set({
            status: "진행전",
            progress: 0,
          })
          .where(
            and(
              eq(goals.id, task.goalId),
              eq(goals.userId, ctx.session.user.id),
            ),
          );
        return;
      }

      // 남은 태스크들의 진행률과 상태를 계산
      const completedTasks = remainingTasks.filter(
        (task) => task.status === "완료",
      ).length;
      const progress = Math.round(
        (completedTasks / remainingTasks.length) * 100,
      );

      let goalStatus: typeof goals.$inferSelect.status = "진행중";
      if (progress === 100) {
        goalStatus = "완료";
      } else if (progress === 0) {
        goalStatus = "진행전";
      }

      await ctx.db
        .update(goals)
        .set({
          progress,
          status: goalStatus,
        })
        .where(
          and(eq(goals.id, task.goalId), eq(goals.userId, ctx.session.user.id)),
        );
    }),
});
