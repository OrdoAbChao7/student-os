import { describe, expect, it } from "vitest";
import { buildSourceSnapshot } from "./routers/ai";
import { assertUserOwnership, levelForExperience } from "./db";

describe("Student OS growth logic", () => {
  it("rejects records belonging to a different signed-in user", () => {
    expect(() => assertUserOwnership({ userId: 19 }, 42)).toThrow("无访问权限");
    expect(assertUserOwnership({ userId: 42 }, 42)).toEqual({ userId: 42 });
  });

  it("derives deterministic levels and progress from accumulated experience", () => {
    expect(levelForExperience(0)).toMatchObject({ level: 1, progress: 0 });
    expect(levelForExperience(100)).toMatchObject({ level: 2, progress: 0 });
    expect(levelForExperience(175)).toMatchObject({ level: 2, progress: 25 });
  });

  it("summarizes only provided daily activity facts for the AI input", () => {
    const snapshot = buildSourceSnapshot({
      todayTasks: [{ title: "完成 API 设计", category: "项目", priority: "high" }],
      todayLearning: [{ title: "阅读文档", durationMinutes: 45, notes: "理解了认证边界" }],
      todayTime: [{ title: "深度编码", kind: "focus", durationMinutes: 90 }],
      currentProjects: [{ title: "Student OS", status: "active", progress: 40 }],
      currentSkills: [{ name: "TypeScript", experience: 120 }],
      review: { reflection: "先完成最难的一步", highlight: null, challenge: "上下文切换", tomorrowFocus: "补完测试" },
      timeMinutes: 90,
    } as never, "2026-08-18");

    expect(snapshot).toMatchObject({
      reportDate: "2026-08-18",
      totalMinutes: 90,
      completedTasks: [{ title: "完成 API 设计", category: "项目", priority: "high" }],
      learningRecords: [{ title: "阅读文档", minutes: 45, notes: "理解了认证边界" }],
      projectStates: [{ title: "Student OS", status: "active", progress: 40 }],
    });
    expect(snapshot).not.toHaveProperty("inventedActivity");
  });
});
