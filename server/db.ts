import { and, desc, eq, gte, lt, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  aiReports,
  courses,
  dailyReviews,
  experienceEvents,
  learningRecords,
  milestones,
  profiles,
  projects,
  skills,
  tasks,
  timeEntries,
  type InsertUser,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    _db = drizzle(process.env.DATABASE_URL);
  }
  return _db;
}

function requiredDb<T>(db: T | null): T {
  if (!db) throw new Error("数据库暂不可用，请稍后再试。");
  return db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = {
    openId: user.openId,
    name: user.name ?? null,
    email: user.email ?? null,
    loginMethod: user.loginMethod ?? null,
    lastSignedIn: user.lastSignedIn ?? new Date(),
    role: user.role ?? (user.openId === ENV.ownerOpenId ? "admin" : "user"),
  };
  await db.insert(users).values(values).onDuplicateKeyUpdate({
    set: {
      name: values.name,
      email: values.email,
      loginMethod: values.loginMethod,
      lastSignedIn: values.lastSignedIn,
      role: values.role,
    },
  });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function ensureProfile(userId: number) {
  const db = requiredDb(await getDb());
  const existing = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
  if (existing[0]) return existing[0];
  await db.insert(profiles).values({ userId });
  const created = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
  return created[0]!;
}

function getInsertId(result: unknown) {
  if (Array.isArray(result)) return Number((result[0] as { insertId?: number } | undefined)?.insertId ?? 0);
  return Number((result as { insertId?: number }).insertId ?? 0);
}

export function assertUserOwnership<T extends { userId: number }>(record: T, userId: number) {
  if (record.userId !== userId) throw new Error("未找到该记录或无访问权限。");
  return record;
}

async function ownedTask(id: number, userId: number) {
  const db = requiredDb(await getDb());
  const records = await db.select().from(tasks).where(and(eq(tasks.id, id), eq(tasks.userId, userId))).limit(1);
  if (!records[0]) throw new Error("未找到该任务或无访问权限。");
  return assertUserOwnership(records[0], userId);
}

async function ownedCourse(id: number, userId: number) {
  const db = requiredDb(await getDb());
  const records = await db.select().from(courses).where(and(eq(courses.id, id), eq(courses.userId, userId))).limit(1);
  if (!records[0]) throw new Error("课程不存在或不属于当前用户。");
  return assertUserOwnership(records[0], userId);
}

async function ownedProject(id: number, userId: number) {
  const db = requiredDb(await getDb());
  const records = await db.select().from(projects).where(and(eq(projects.id, id), eq(projects.userId, userId))).limit(1);
  if (!records[0]) throw new Error("项目不存在或不属于当前用户。");
  return assertUserOwnership(records[0], userId);
}

async function ownedSkill(id: number, userId: number) {
  const db = requiredDb(await getDb());
  const records = await db.select().from(skills).where(and(eq(skills.id, id), eq(skills.userId, userId))).limit(1);
  if (!records[0]) throw new Error("技能不存在或不属于当前用户。");
  return assertUserOwnership(records[0], userId);
}

async function ownedMilestone(id: number, userId: number) {
  const db = requiredDb(await getDb());
  const records = await db.select().from(milestones).where(and(eq(milestones.id, id), eq(milestones.userId, userId))).limit(1);
  if (!records[0]) throw new Error("里程碑不存在或不属于当前用户。");
  return assertUserOwnership(records[0], userId);
}

async function ownedTimeEntry(id: number, userId: number) {
  const db = requiredDb(await getDb());
  const records = await db.select().from(timeEntries).where(and(eq(timeEntries.id, id), eq(timeEntries.userId, userId))).limit(1);
  if (!records[0]) throw new Error("计时记录不存在或不属于当前用户。");
  return assertUserOwnership(records[0], userId);
}

async function ensureOptionalOwnership(userId: number, input: { courseId?: number | null; projectId?: number | null; skillId?: number | null }) {
  if (input.courseId) await ownedCourse(input.courseId, userId);
  if (input.projectId) await ownedProject(input.projectId, userId);
  if (input.skillId) await ownedSkill(input.skillId, userId);
}

export function levelForExperience(experience: number) {
  const safeExperience = Math.max(0, experience);
  const level = Math.floor(Math.sqrt(safeExperience / 100)) + 1;
  const currentLevelBase = Math.pow(level - 1, 2) * 100;
  const nextLevelBase = Math.pow(level, 2) * 100;
  return {
    level,
    experience: safeExperience,
    currentLevelBase,
    nextLevelBase,
    progress: Math.min(100, Math.round(((safeExperience - currentLevelBase) / (nextLevelBase - currentLevelBase)) * 100)),
  };
}

async function awardExperience(userId: number, skillId: number | null, sourceType: "task" | "course" | "learning" | "project" | "review" | "manual", sourceId: number, points: number) {
  if (!skillId) return;
  const db = requiredDb(await getDb());
  const existing = await db
    .select({ id: experienceEvents.id })
    .from(experienceEvents)
    .where(and(eq(experienceEvents.userId, userId), eq(experienceEvents.skillId, skillId), eq(experienceEvents.sourceType, sourceType), eq(experienceEvents.sourceId, sourceId)))
    .limit(1);
  if (existing[0]) return;
  await db.insert(experienceEvents).values({ userId, skillId, sourceType, sourceId, points });
  await db.update(skills).set({ experience: sql`${skills.experience} + ${points}` }).where(and(eq(skills.id, skillId), eq(skills.userId, userId)));
}

export async function listTasks(userId: number) {
  const db = requiredDb(await getDb());
  return db.select().from(tasks).where(eq(tasks.userId, userId)).orderBy(desc(tasks.createdAt));
}

export async function createTask(userId: number, input: { title: string; description?: string; category?: string; tags?: string[]; priority?: "low" | "medium" | "high" | "urgent"; dueAt?: Date | null; courseId?: number | null; projectId?: number | null; skillId?: number | null }) {
  await ensureOptionalOwnership(userId, input);
  const db = requiredDb(await getDb());
  const result = await db.insert(tasks).values({
    userId,
    title: input.title,
    description: input.description || null,
    category: input.category || "Focus",
    tags: input.tags ?? [],
    priority: input.priority ?? "medium",
    dueAt: input.dueAt ?? null,
    courseId: input.courseId ?? null,
    projectId: input.projectId ?? null,
    skillId: input.skillId ?? null,
  });
  return getInsertId(result);
}

export async function updateTask(userId: number, taskId: number, input: { title?: string; description?: string | null; category?: string; tags?: string[]; priority?: "low" | "medium" | "high" | "urgent"; dueAt?: Date | null; courseId?: number | null; projectId?: number | null; skillId?: number | null; status?: "todo" | "in_progress" | "done" }) {
  const previous = await ownedTask(taskId, userId);
  await ensureOptionalOwnership(userId, input);
  const db = requiredDb(await getDb());
  const becomingDone = input.status === "done" && previous.status !== "done";
  await db.update(tasks).set({ ...input, completedAt: becomingDone ? new Date() : input.status && input.status !== "done" ? null : previous.completedAt }).where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));
  if (becomingDone) await awardExperience(userId, previous.skillId, "task", taskId, 20);
}

export async function listCourses(userId: number) {
  const db = requiredDb(await getDb());
  return db.select().from(courses).where(eq(courses.userId, userId)).orderBy(desc(courses.updatedAt));
}

export async function createCourse(userId: number, input: { title: string; description?: string; color?: string; resourceUrl?: string; skillId?: number | null }) {
  await ensureOptionalOwnership(userId, { skillId: input.skillId });
  const db = requiredDb(await getDb());
  const result = await db.insert(courses).values({ userId, skillId: input.skillId ?? null, title: input.title, description: input.description || null, color: input.color || "#6875F5", resourceUrl: input.resourceUrl || null });
  return getInsertId(result);
}

export async function addLearningRecord(userId: number, input: { courseId: number; skillId?: number | null; title: string; notes?: string; resourceUrl?: string; durationMinutes: number; completedAt: Date }) {
  const course = await ownedCourse(input.courseId, userId);
  await ensureOptionalOwnership(userId, { skillId: input.skillId });
  const db = requiredDb(await getDb());
  const linkedSkillId = input.skillId ?? course.skillId;
  const result = await db.insert(learningRecords).values({
    userId,
    courseId: input.courseId,
    skillId: linkedSkillId,
    title: input.title,
    notes: input.notes || null,
    resourceUrl: input.resourceUrl || null,
    durationMinutes: input.durationMinutes,
    completedAt: input.completedAt,
  });
  const recordId = getInsertId(result);
  await awardExperience(userId, linkedSkillId, "learning", recordId, Math.max(10, Math.round(input.durationMinutes / 4)));
  await db.update(courses).set({ progress: sql`LEAST(100, ${courses.progress} + 5)` }).where(and(eq(courses.id, input.courseId), eq(courses.userId, userId)));
  return recordId;
}

export async function listLearningRecords(userId: number) {
  const db = requiredDb(await getDb());
  return db.select().from(learningRecords).where(eq(learningRecords.userId, userId)).orderBy(desc(learningRecords.completedAt));
}

export async function listProjects(userId: number) {
  const db = requiredDb(await getDb());
  const projectRows = await db.select().from(projects).where(eq(projects.userId, userId)).orderBy(desc(projects.updatedAt));
  const milestoneRows = await db.select().from(milestones).where(eq(milestones.userId, userId)).orderBy(desc(milestones.createdAt));
  return projectRows.map(project => ({ ...project, milestones: milestoneRows.filter(milestone => milestone.projectId === project.id) }));
}

export async function createProject(userId: number, input: { title: string; description?: string; status?: "idea" | "planning" | "active" | "paused" | "completed"; techStack: string[]; targetAt?: Date | null; skillId?: number | null }) {
  await ensureOptionalOwnership(userId, { skillId: input.skillId });
  const db = requiredDb(await getDb());
  const result = await db.insert(projects).values({ userId, skillId: input.skillId ?? null, title: input.title, description: input.description || null, status: input.status ?? "idea", techStack: input.techStack, targetAt: input.targetAt ?? null });
  return getInsertId(result);
}

export async function createMilestone(userId: number, input: { projectId: number; title: string; dueAt?: Date | null }) {
  await ownedProject(input.projectId, userId);
  const db = requiredDb(await getDb());
  const result = await db.insert(milestones).values({ userId, projectId: input.projectId, title: input.title, dueAt: input.dueAt ?? null });
  return getInsertId(result);
}

export async function updateMilestoneStatus(userId: number, milestoneId: number, status: "todo" | "in_progress" | "done") {
  const previous = await ownedMilestone(milestoneId, userId);
  const project = await ownedProject(previous.projectId, userId);
  const db = requiredDb(await getDb());
  await db.update(milestones).set({ status, completedAt: status === "done" ? new Date() : null }).where(and(eq(milestones.id, milestoneId), eq(milestones.userId, userId)));
  if (status === "done" && previous.status !== "done") {
    await db.update(projects).set({ progress: sql`LEAST(100, ${projects.progress} + 10)` }).where(and(eq(projects.id, previous.projectId), eq(projects.userId, userId)));
    await awardExperience(userId, project.skillId, "project", milestoneId, 30);
  }
}

export async function listSkills(userId: number) {
  const db = requiredDb(await getDb());
  const records = await db.select().from(skills).where(eq(skills.userId, userId)).orderBy(desc(skills.experience));
  return records.map(skill => ({ ...skill, ...levelForExperience(skill.experience) }));
}

export async function createSkill(userId: number, input: { name: string; category?: string; color?: string }) {
  const db = requiredDb(await getDb());
  const result = await db.insert(skills).values({ userId, name: input.name, category: input.category || "General", color: input.color || "#6875F5" });
  return getInsertId(result);
}

export async function listTimeEntries(userId: number) {
  const db = requiredDb(await getDb());
  return db.select().from(timeEntries).where(eq(timeEntries.userId, userId)).orderBy(desc(timeEntries.startedAt));
}

export async function createManualTimeEntry(userId: number, input: { title: string; kind: "learning" | "project" | "focus" | "other"; durationMinutes: number; startedAt: Date; courseId?: number | null; projectId?: number | null }) {
  await ensureOptionalOwnership(userId, input);
  const db = requiredDb(await getDb());
  const endedAt = new Date(input.startedAt.getTime() + input.durationMinutes * 60_000);
  const result = await db.insert(timeEntries).values({ userId, title: input.title, kind: input.kind, durationMinutes: input.durationMinutes, startedAt: input.startedAt, endedAt, courseId: input.courseId ?? null, projectId: input.projectId ?? null, isRunning: false });
  return getInsertId(result);
}

export async function startTimer(userId: number, input: { title: string; kind: "learning" | "project" | "focus" | "other"; courseId?: number | null; projectId?: number | null }) {
  await ensureOptionalOwnership(userId, input);
  const db = requiredDb(await getDb());
  await db.update(timeEntries).set({ isRunning: false, endedAt: new Date() }).where(and(eq(timeEntries.userId, userId), eq(timeEntries.isRunning, true)));
  const result = await db.insert(timeEntries).values({ userId, title: input.title, kind: input.kind, durationMinutes: 0, startedAt: new Date(), courseId: input.courseId ?? null, projectId: input.projectId ?? null, isRunning: true });
  return getInsertId(result);
}

export async function stopTimer(userId: number, entryId: number) {
  const entry = await ownedTimeEntry(entryId, userId);
  if (!entry.isRunning) return;
  const db = requiredDb(await getDb());
  const endedAt = new Date();
  const durationMinutes = Math.max(1, Math.round((endedAt.getTime() - entry.startedAt.getTime()) / 60_000));
  await db.update(timeEntries).set({ isRunning: false, endedAt, durationMinutes }).where(and(eq(timeEntries.id, entryId), eq(timeEntries.userId, userId)));
}

export function localDateKey(date = new Date()) {
  return date.toLocaleDateString("en-CA");
}

export async function getDailyReview(userId: number, reviewDate = localDateKey()) {
  const db = requiredDb(await getDb());
  const result = await db.select().from(dailyReviews).where(and(eq(dailyReviews.userId, userId), eq(dailyReviews.reviewDate, reviewDate))).limit(1);
  return result[0] ?? null;
}

export async function upsertDailyReview(userId: number, input: { reviewDate: string; reflection: string; highlight?: string; challenge?: string; tomorrowFocus?: string }) {
  const db = requiredDb(await getDb());
  await db.insert(dailyReviews).values({ userId, ...input, highlight: input.highlight || null, challenge: input.challenge || null, tomorrowFocus: input.tomorrowFocus || null }).onDuplicateKeyUpdate({
    set: { reflection: input.reflection, highlight: input.highlight || null, challenge: input.challenge || null, tomorrowFocus: input.tomorrowFocus || null },
  });
}

export async function getDailyActivity(userId: number, dayStart: Date, dayEnd: Date) {
  const db = requiredDb(await getDb());
  const [todayTasks, todayLearning, todayTime, currentProjects, currentSkills, review] = await Promise.all([
    db.select().from(tasks).where(and(eq(tasks.userId, userId), gte(tasks.completedAt, dayStart), lt(tasks.completedAt, dayEnd))),
    db.select().from(learningRecords).where(and(eq(learningRecords.userId, userId), gte(learningRecords.completedAt, dayStart), lt(learningRecords.completedAt, dayEnd))),
    db.select().from(timeEntries).where(and(eq(timeEntries.userId, userId), gte(timeEntries.startedAt, dayStart), lt(timeEntries.startedAt, dayEnd))),
    db.select().from(projects).where(eq(projects.userId, userId)),
    db.select().from(skills).where(eq(skills.userId, userId)),
    getDailyReview(userId, localDateKey(dayStart)),
  ]);
  const timeMinutes = todayTime.reduce((total, entry) => total + entry.durationMinutes, 0);
  return { todayTasks, todayLearning, todayTime, currentProjects, currentSkills, review, timeMinutes };
}

export async function getDashboard(userId: number) {
  const db = requiredDb(await getDb());
  const profile = await ensureProfile(userId);
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start.getTime() + 86_400_000);
  const [taskRows, courseRows, projectRows, skillRows, timeRows, reportRows] = await Promise.all([
    db.select().from(tasks).where(eq(tasks.userId, userId)).orderBy(desc(tasks.createdAt)),
    db.select().from(courses).where(eq(courses.userId, userId)).orderBy(desc(courses.updatedAt)),
    db.select().from(projects).where(eq(projects.userId, userId)).orderBy(desc(projects.updatedAt)),
    listSkills(userId),
    db.select().from(timeEntries).where(and(eq(timeEntries.userId, userId), gte(timeEntries.startedAt, start), lt(timeEntries.startedAt, end))),
    db.select().from(aiReports).where(and(eq(aiReports.userId, userId), eq(aiReports.reportDate, localDateKey(now)))).limit(1),
  ]);
  const todayTasks = taskRows.filter(task => !task.completedAt || (task.completedAt >= start && task.completedAt < end));
  const completedToday = taskRows.filter(task => task.completedAt && task.completedAt >= start && task.completedAt < end).length;
  const timeMinutes = timeRows.reduce((total, entry) => total + entry.durationMinutes, 0);
  const averageExperience = skillRows.length ? Math.round(skillRows.reduce((total, skill) => total + skill.progress, 0) / skillRows.length) : 0;
  return { profile, tasks: todayTasks, completedToday, taskTotal: todayTasks.length, timeMinutes, courses: courseRows, projects: projectRows, skills: skillRows, report: reportRows[0] ?? null, dateKey: localDateKey(now), growthIndex: averageExperience };
}

export async function saveAiReport(userId: number, input: { reportDate: string; growthScore: number; summary: string; insight: string; tomorrowPlan: string[]; sourceSnapshot: Record<string, unknown> }) {
  const db = requiredDb(await getDb());
  await db.insert(aiReports).values({ userId, ...input }).onDuplicateKeyUpdate({
    set: { growthScore: input.growthScore, summary: input.summary, insight: input.insight, tomorrowPlan: input.tomorrowPlan, sourceSnapshot: input.sourceSnapshot },
  });
  const result = await db.select().from(aiReports).where(and(eq(aiReports.userId, userId), eq(aiReports.reportDate, input.reportDate))).limit(1);
  return result[0]!;
}
