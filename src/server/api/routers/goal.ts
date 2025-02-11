import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { goals, goalStatusEnum, goalPriorityEnum } from "@/server/db/schema";
import { and, eq, desc, asc, sql } from "drizzle-orm";

export const goalRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, "제목을 입력해주세요"),
        description: z.string().optional(),
        startDate: z.date().optional(),
        dueDate: z.date().optional(),
        priority: z.enum(goalPriorityEnum.enumValues).default("보통"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(goals).values({
        title: input.title,
        description: input.description,
        startDate: input.startDate,
        dueDate: input.dueDate,
        priority: input.priority,
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
        with: {
          tasks: {
            columns: {
              status: true,
            },
          },
        },
      });

      return userGoals.map((goal) => ({
        ...goal,
        taskStats: {
          total: goal.tasks.length,
          completed: goal.tasks.filter((task) => task.status === "완료").length,
        },
      }));
    }),

  get: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input: goalId }) => {
      const goal = await ctx.db.query.goals.findFirst({
        where: and(eq(goals.id, goalId), eq(goals.userId, ctx.session.user.id)),
        with: {
          tasks: {
            columns: {
              status: true,
            },
          },
        },
      });

      if (!goal) {
        throw new Error("목표를 찾을 수 없습니다.");
      }

      return {
        ...goal,
        taskStats: {
          total: goal.tasks.length,
          completed: goal.tasks.filter((task) => task.status === "완료").length,
        },
      };
    }),

  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input: goalId }) => {
      const goal = await ctx.db.query.goals.findFirst({
        where: and(eq(goals.id, goalId), eq(goals.userId, ctx.session.user.id)),
        columns: {
          title: true,
        },
      });

      if (!goal) {
        throw new Error("목표를 찾을 수 없습니다.");
      }

      await ctx.db
        .delete(goals)
        .where(
          and(eq(goals.id, goalId), eq(goals.userId, ctx.session.user.id)),
        );

      return goal;
    }),
});
