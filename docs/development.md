# 开发指南

## 文件职责

`client/src/pages/` 放置路由页面；`client/src/components/` 放置可复用界面；`server/routers/` 按领域划分 tRPC 过程；`server/db.ts` 集中数据访问、归属校验和可复用的领域规则；`drizzle/schema.ts` 是数据库 schema 的唯一源头。

## 新增功能的最小闭环

一个完整功能通常需要以下步骤：先更新 Drizzle schema（如有数据模型变化），生成并审查迁移；然后在 `server/db.ts` 添加用户隔离的数据函数，在相应 router 暴露输入经 Zod 验证的受保护过程；最后在页面中通过 `trpc.*` 查询或 mutation 使用它，并补充 Vitest 覆盖。

## 前端约定

内部工作台必须复用 `DashboardLayout`，保持侧边导航、身份入口和主题行为一致。界面使用 Tailwind token 与 shadcn/ui 基元，确保同一组件在亮暗两种主题中都可读。每个数据模块都应提供加载、空数据、成功与错误反馈。

## 测试约定

后端逻辑测试位于 `server/*.test.ts`。适合单元测试的逻辑包括经验计算、数据归属断言和 AI 报告来源快照。涉及外部数据库或 OAuth 的行为应避免使用真实用户数据；通过可控的测试上下文或抽离的纯函数验证。

## 发布前检查

在提交前运行：

```bash
pnpm check
pnpm test
pnpm build
```

不要提交环境变量、OAuth token、AI 密钥、数据库导出、浏览器会话或运行日志。
