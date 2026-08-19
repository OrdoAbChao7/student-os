# 架构说明

## 总览

Student OS 是单仓库全栈应用。浏览器端通过 tRPC 调用 Express 服务端，服务端在认证上下文中读取当前用户，使用 Drizzle 访问 MySQL/TiDB，并通过 Manus 网关调用大语言模型。业务数据保持在关系型数据库中，AI 报告只保存结构化结果与可审计的事实快照。

```text
React + Vite
      │ typed RPC
      ▼
Express + tRPC ── Manus OAuth
      │
      ├── Drizzle ORM ── MySQL / TiDB
      │
      └── LLM gateway ── AI daily report
```

## 领域边界

| 领域 | 主表 | 核心规则 |
| --- | --- | --- |
| 行动 | `tasks` | 完成关联技能的任务时创建一次经验事件。 |
| 投入 | `timeEntries` | 手动记录和计时器均以 UTC 时间戳保存。 |
| 学习 | `courses`、`learningRecords` | 学习记录提升课程进度，并将经验累积到课程默认或覆盖的技能。 |
| 项目 | `projects`、`milestones` | 完成项目里程碑推进项目进度；项目子任务复用 `tasks.projectId`。 |
| 能力 | `skills`、`experienceEvents` | `experienceEvents` 对来源去重，避免重复累计经验。 |
| 复盘 | `dailyReviews`、`aiReports` | AI 报告由当天事实快照与用户复盘生成。 |

## 用户隔离

认证通过 OAuth 上下文写入 `ctx.user`。业务 router 使用受保护过程，数据库查询使用 `id + userId` 或单独的 `userId` 条件。任何跨用户记录均不能进入聚合、更新或删除流程。

## AI 报告链路

`server/routers/ai.ts` 读取指定日期范围内已保存的任务、学习记录、时间记录、项目、技能和复盘，并构建来源快照。系统先拒绝没有真实行为数据的请求，再要求模型返回受 Zod 验证的 JSON。验证通过后，结果与来源快照写入 `aiReports`，方便后续审计和复盘。

## 迁移流程

当 schema 发生变化时，请依次执行：

```bash
pnpm drizzle-kit generate
# 审查 drizzle/ 中新生成的 SQL
pnpm drizzle-kit migrate
```

迁移文件与 snapshot 必须随代码一起提交。
