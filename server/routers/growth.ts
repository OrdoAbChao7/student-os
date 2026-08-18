import { z } from "zod";
import {
  addLearningRecord,
  createCourse,
  createManualTimeEntry,
  createMilestone,
  createProject,
  createSkill,
  createTask,
  getDashboard,
  getDailyReview,
  listCourses,
  listLearningRecords,
  listProjects,
  listSkills,
  listTasks,
  listTimeEntries,
  startTimer,
  stopTimer,
  updateMilestoneStatus,
  updateTask,
  upsertDailyReview,
} from "../db";
import { protectedProcedure, router } from "../_core/trpc";

const optionalId = z.number().int().positive().nullable().optional();
const taskStatus = z.enum(["todo", "in_progress", "done"]);
const priority = z.enum(["low", "medium", "high", "urgent"]);

export const growthRouter = router({
  dashboard: protectedProcedure.query(({ ctx }) => getDashboard(ctx.user.id)),
  tasks: router({
    list: protectedProcedure.query(({ ctx }) => listTasks(ctx.user.id)),
    create: protectedProcedure.input(z.object({ title: z.string().trim().min(1).max(240), description: z.string().max(4000).optional(), category: z.string().trim().max(80).optional(), tags: z.array(z.string().trim().min(1).max(32)).max(8).optional(), priority: priority.optional(), dueAt: z.number().int().nullable().optional(), courseId: optionalId, projectId: optionalId, skillId: optionalId })).mutation(({ ctx, input }) => createTask(ctx.user.id, { ...input, dueAt: input.dueAt ? new Date(input.dueAt) : null })),
    update: protectedProcedure.input(z.object({ id: z.number().int().positive(), title: z.string().trim().min(1).max(240).optional(), description: z.string().max(4000).nullable().optional(), category: z.string().trim().max(80).optional(), tags: z.array(z.string().trim().min(1).max(32)).max(8).optional(), priority: priority.optional(), dueAt: z.number().int().nullable().optional(), courseId: optionalId, projectId: optionalId, skillId: optionalId, status: taskStatus.optional() })).mutation(({ ctx, input }) => { const { id, dueAt, ...data } = input; return updateTask(ctx.user.id, id, { ...data, dueAt: dueAt === undefined ? undefined : dueAt ? new Date(dueAt) : null }); }),
  }),
  courses: router({
    list: protectedProcedure.query(({ ctx }) => listCourses(ctx.user.id)),
    create: protectedProcedure.input(z.object({ title: z.string().trim().min(1).max(180), description: z.string().max(4000).optional(), color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(), resourceUrl: z.string().url().max(500).optional(), skillId: optionalId })).mutation(({ ctx, input }) => createCourse(ctx.user.id, input)),
    learning: protectedProcedure.query(({ ctx }) => listLearningRecords(ctx.user.id)),
    addLearning: protectedProcedure.input(z.object({ courseId: z.number().int().positive(), skillId: optionalId, title: z.string().trim().min(1).max(200), notes: z.string().max(5000).optional(), resourceUrl: z.string().url().max(500).optional(), durationMinutes: z.number().int().min(1).max(1440), completedAt: z.number().int() })).mutation(({ ctx, input }) => addLearningRecord(ctx.user.id, { ...input, completedAt: new Date(input.completedAt) })),
  }),
  projects: router({
    list: protectedProcedure.query(({ ctx }) => listProjects(ctx.user.id)),
    create: protectedProcedure.input(z.object({ title: z.string().trim().min(1).max(180), description: z.string().max(4000).optional(), status: z.enum(["idea", "planning", "active", "paused", "completed"]).optional(), techStack: z.array(z.string().trim().min(1).max(40)).max(12), targetAt: z.number().int().nullable().optional(), skillId: optionalId })).mutation(({ ctx, input }) => createProject(ctx.user.id, { ...input, targetAt: input.targetAt ? new Date(input.targetAt) : null })),
    addMilestone: protectedProcedure.input(z.object({ projectId: z.number().int().positive(), title: z.string().trim().min(1).max(180), dueAt: z.number().int().nullable().optional() })).mutation(({ ctx, input }) => createMilestone(ctx.user.id, { ...input, dueAt: input.dueAt ? new Date(input.dueAt) : null })),
    updateMilestone: protectedProcedure.input(z.object({ id: z.number().int().positive(), status: taskStatus })).mutation(({ ctx, input }) => updateMilestoneStatus(ctx.user.id, input.id, input.status)),
  }),
  skills: router({
    list: protectedProcedure.query(({ ctx }) => listSkills(ctx.user.id)),
    create: protectedProcedure.input(z.object({ name: z.string().trim().min(1).max(100), category: z.string().trim().max(80).optional(), color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional() })).mutation(({ ctx, input }) => createSkill(ctx.user.id, input)),
  }),
  time: router({
    list: protectedProcedure.query(({ ctx }) => listTimeEntries(ctx.user.id)),
    createManual: protectedProcedure.input(z.object({ title: z.string().trim().min(1).max(180), kind: z.enum(["learning", "project", "focus", "other"]), durationMinutes: z.number().int().min(1).max(1440), startedAt: z.number().int(), courseId: optionalId, projectId: optionalId })).mutation(({ ctx, input }) => createManualTimeEntry(ctx.user.id, { ...input, startedAt: new Date(input.startedAt) })),
    start: protectedProcedure.input(z.object({ title: z.string().trim().min(1).max(180), kind: z.enum(["learning", "project", "focus", "other"]), courseId: optionalId, projectId: optionalId })).mutation(({ ctx, input }) => startTimer(ctx.user.id, input)),
    stop: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ ctx, input }) => stopTimer(ctx.user.id, input.id)),
  }),
  review: router({
    today: protectedProcedure.query(({ ctx }) => getDailyReview(ctx.user.id)),
    save: protectedProcedure.input(z.object({ reviewDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), reflection: z.string().trim().min(1).max(5000), highlight: z.string().max(1200).optional(), challenge: z.string().max(1200).optional(), tomorrowFocus: z.string().max(1200).optional() })).mutation(({ ctx, input }) => upsertDailyReview(ctx.user.id, input)),
  }),
});
