import {
  boolean,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const profiles = mysqlTable("profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  headline: varchar("headline", { length: 180 }),
  timezone: varchar("timezone", { length: 80 }).default("Asia/Shanghai").notNull(),
  weeklyFocusHours: int("weeklyFocusHours").default(12).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const courses = mysqlTable(
  "courses",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    skillId: int("skillId"),
    title: varchar("title", { length: 180 }).notNull(),
    description: text("description"),
    color: varchar("color", { length: 20 }).default("#6875F5").notNull(),
    progress: int("progress").default(0).notNull(),
    resourceUrl: varchar("resourceUrl", { length: 500 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [index("courses_user_idx").on(table.userId)],
);

export const projects = mysqlTable(
  "projects",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    skillId: int("skillId"),
    title: varchar("title", { length: 180 }).notNull(),
    description: text("description"),
    status: mysqlEnum("status", ["idea", "planning", "active", "paused", "completed"])
      .default("idea")
      .notNull(),
    progress: int("progress").default(0).notNull(),
    techStack: json("techStack").$type<string[]>().notNull(),
    targetAt: timestamp("targetAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [index("projects_user_idx").on(table.userId)],
);

export const milestones = mysqlTable(
  "milestones",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    projectId: int("projectId").notNull(),
    title: varchar("title", { length: 180 }).notNull(),
    status: mysqlEnum("status", ["todo", "in_progress", "done"]).default("todo").notNull(),
    dueAt: timestamp("dueAt"),
    completedAt: timestamp("completedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [index("milestones_project_user_idx").on(table.projectId, table.userId)],
);

export const skills = mysqlTable(
  "skills",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    category: varchar("category", { length: 80 }).default("General").notNull(),
    color: varchar("color", { length: 20 }).default("#6875F5").notNull(),
    experience: int("experience").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [index("skills_user_idx").on(table.userId)],
);

export const tasks = mysqlTable(
  "tasks",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    courseId: int("courseId"),
    projectId: int("projectId"),
    skillId: int("skillId"),
    title: varchar("title", { length: 240 }).notNull(),
    description: text("description"),
    category: varchar("category", { length: 80 }).default("Focus").notNull(),
    tags: json("tags").$type<string[]>().notNull(),
    priority: mysqlEnum("priority", ["low", "medium", "high", "urgent"])
      .default("medium")
      .notNull(),
    status: mysqlEnum("status", ["todo", "in_progress", "done"]).default("todo").notNull(),
    dueAt: timestamp("dueAt"),
    completedAt: timestamp("completedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [index("tasks_user_status_idx").on(table.userId, table.status), index("tasks_user_due_idx").on(table.userId, table.dueAt)],
);

export const learningRecords = mysqlTable(
  "learningRecords",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    courseId: int("courseId").notNull(),
    skillId: int("skillId"),
    title: varchar("title", { length: 200 }).notNull(),
    notes: text("notes"),
    resourceUrl: varchar("resourceUrl", { length: 500 }),
    durationMinutes: int("durationMinutes").default(0).notNull(),
    completedAt: timestamp("completedAt").defaultNow().notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [index("learning_records_user_course_idx").on(table.userId, table.courseId)],
);

export const timeEntries = mysqlTable(
  "timeEntries",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    courseId: int("courseId"),
    projectId: int("projectId"),
    title: varchar("title", { length: 180 }).notNull(),
    kind: mysqlEnum("kind", ["learning", "project", "focus", "other"]).default("focus").notNull(),
    durationMinutes: int("durationMinutes").default(0).notNull(),
    startedAt: timestamp("startedAt").notNull(),
    endedAt: timestamp("endedAt"),
    isRunning: boolean("isRunning").default(false).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [index("time_entries_user_start_idx").on(table.userId, table.startedAt)],
);

export const experienceEvents = mysqlTable(
  "experienceEvents",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    skillId: int("skillId").notNull(),
    sourceType: mysqlEnum("sourceType", ["task", "course", "learning", "project", "review", "manual"]).notNull(),
    sourceId: int("sourceId"),
    points: int("points").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [index("experience_user_skill_idx").on(table.userId, table.skillId)],
);

export const dailyReviews = mysqlTable(
  "dailyReviews",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    reviewDate: varchar("reviewDate", { length: 10 }).notNull(),
    reflection: text("reflection").notNull(),
    highlight: text("highlight"),
    challenge: text("challenge"),
    tomorrowFocus: text("tomorrowFocus"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [uniqueIndex("daily_review_user_date_uq").on(table.userId, table.reviewDate)],
);

export const aiReports = mysqlTable(
  "aiReports",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    reportDate: varchar("reportDate", { length: 10 }).notNull(),
    growthScore: int("growthScore").notNull(),
    summary: text("summary").notNull(),
    insight: text("insight").notNull(),
    tomorrowPlan: json("tomorrowPlan").$type<string[]>().notNull(),
    sourceSnapshot: json("sourceSnapshot").$type<Record<string, unknown>>().notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [uniqueIndex("ai_report_user_date_uq").on(table.userId, table.reportDate)],
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
