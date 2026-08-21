<div align="center">
  <h1>student-os</h1>
  <a href="./README.md"><b>English</b></a> | <b>中文</b>
</div>
<br>



<!-- portfolio-authenticity:start -->
## 项目状态

**当前阶段：**个人学生规划实验。

**为什么做这个项目：**我写这个项目是为了尝试把课程、任务、里程碑和学习规划放到同一工作台，而不是维护分散在多种工具里的列表。

**适用边界：**仓库包含静态预览，但完整应用依赖服务端、数据库、登录和已配置的集成。它不是多租户教育平台，生成的规划建议需要用户判断。

关于仍需补充的验证证据和维护约定，请参阅 [PROJECT_STATUS.md](./PROJECT_STATUS.md)。
<!-- portfolio-authenticity:end -->

> 面向个人开发者与学习者的真实数据驱动成长工作台。

Student OS 将任务、专注时间、课程学习、个人项目、能力经验与每日复盘统一到同一个工作流中。它的核心原则是：**不展示虚构进度，不凭空生成 AI 结论**。所有成长指标和每日建议均来自当前登录用户保存的真实行为记录。

[![CI](https://github.com/OrdoAbChao7/student-os/actions/workflows/ci.yml/badge.svg)](https://github.com/OrdoAbChao7/student-os/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-indigo.svg)](LICENSE)

## 功能概览

| 模块 | 已实现能力 |
| --- | --- |
| 身份与隐私 | Manus OAuth 登录；所有领域数据均以 `userId` 约束和过滤。 |
| 成长工作台 | 展示今日任务、投入时间、成长指数、项目状态与 AI 报告入口。 |
| 任务系统 | 创建、编辑、完成任务；支持优先级、截止日期、分类和标签。 |
| 时间记录 | 支持手动打卡和开始/结束计时；按日、近 7 天汇总投入。 |
| 学习系统 | 维护课程、资源、学习笔记和学习记录；记录会更新课程进度。 |
| 项目空间 | 管理技术栈、里程碑和项目子任务；完成节点会推进项目进度。 |
| 能力图谱 | 自定义能力维度；任务、学习和项目节点可累积经验值，并以雷达图显示。 |
| 每日复盘 | 汇总真实完成项和投入时间，并记录亮点、挑战与明日重点。 |
| AI 报告 | 仅使用当日已保存的任务、学习、时间、项目、技能和复盘数据生成总结与明日计划。 |

## 技术栈

| 层级 | 技术 |
| --- | --- |
| 前端 | React 19、TypeScript、Vite、Tailwind CSS 4、shadcn/ui、Recharts、Wouter |
| 服务端 | Node.js、Express 4、tRPC 11、Zod |
| 数据 | MySQL / TiDB、Drizzle ORM 与 Drizzle Kit |
| 身份 | Manus OAuth |
| AI | Manus 内置 LLM 网关，采用结构化 JSON 输出 |
| 测试 | Vitest |

## 快速开始

### 前置条件

请准备 Node.js 22 或更高版本、pnpm 10 与一套可用的 MySQL/TiDB 数据库。项目在 Manus 环境中运行时会自动注入 OAuth、数据库与 AI 网关所需的系统变量；在本地开发时，需要自行提供等价配置。

### 安装与运行

```bash
git clone https://github.com/OrdoAbChao7/student-os.git
cd student-os
pnpm install --frozen-lockfile
```

将必要的环境变量写入本地 `.env` 文件后，生成并执行数据库迁移：

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
pnpm dev
```

开发服务启动后，请打开终端输出的本地地址。

### 环境变量

不要提交真实凭据。下表列出服务端实际读取的配置项。

| 变量 | 用途 | 本地开发是否需要 |
| --- | --- | --- |
| `DATABASE_URL` | MySQL/TiDB 连接串 | 是 |
| `JWT_SECRET` | 会话 Cookie 签名 | 是 |
| `VITE_APP_ID` | OAuth 应用标识 | 是 |
| `OAUTH_SERVER_URL` | OAuth 服务端地址 | 是 |
| `OWNER_OPEN_ID` | 项目所有者标识 | 可选 |
| `BUILT_IN_FORGE_API_URL` | Manus AI 网关地址 | 仅启用 AI 报告时需要 |
| `BUILT_IN_FORGE_API_KEY` | Manus AI 网关密钥 | 仅启用 AI 报告时需要 |

## 常用命令

```bash
# 启动开发服务
pnpm dev

# 类型检查
pnpm check

# 运行单元测试
pnpm test

# 构建生产包
pnpm build

# 格式化代码
pnpm format
```

## GitHub Pages 静态预览

仓库包含自动化 Pages 工作流。`main` 分支每次推送时，工作流会通过 `build:pages` 构建面向项目页的 React 静态预览，并将 `dist/pages` 中的 Vite 产物发布到 GitHub Pages。启用后默认地址为 <https://ordoabchao7.github.io/student-os/>。

> GitHub Pages 只能托管静态文件，不能运行本项目所需的 Node 服务端、OAuth 回调、tRPC API、数据库或服务端 AI 网关。因此 Pages 站点是项目展示与设计预览，而非完整可登录的 Student OS 实例。完整应用需要部署在支持 Node.js 与数据库的运行环境。

首次启用请前往仓库 **Settings → Pages → Source** 并选择 **GitHub Actions**。完整工作流设计、部署边界与自定义域名说明见 [GitHub Pages 指南](docs/github-pages.md)。

## 目录结构

```text
student-os/
├── client/                 # React 前端
│   └── src/
│       ├── components/     # 布局、业务组件与 UI 基元
│       ├── pages/          # 工作台、任务、时间、学习、项目、能力、复盘页面
│       └── lib/            # tRPC 客户端与通用工具
├── server/                 # Express / tRPC 服务端
│   ├── routers/            # 增长域与 AI 域业务过程
│   ├── _core/              # OAuth、LLM、运行时基础设施
│   └── db.ts               # 用户隔离查询、经验规则与聚合逻辑
├── drizzle/                # Drizzle schema、迁移和快照
├── shared/                 # 前后端共享常量与类型
├── docs/                   # 架构、开发和设计文档
├── .github/                # CI、Issue 表单与 PR 模板
└── package.json
```

更具体的设计与工程约定见 [架构说明](docs/architecture.md)、[开发指南](docs/development.md) 和 [贡献指南](CONTRIBUTING.md)。

## 数据与 AI 原则

Student OS 使用两层保护保证个人数据的归属边界：服务端 tRPC 过程要求已认证用户，数据库读写操作同时使用记录 ID 与 `userId` 过滤。AI 日报生成前会聚合当天真实行为；当日没有任务、学习、计时或复盘记录时，接口会拒绝生成报告，而不是制作占位内容。

## 开发与贡献

欢迎通过 Issue 讨论需求或缺陷，也欢迎提交 Pull Request。提交前请至少运行：

```bash
pnpm check
pnpm test
```

详细协作流程、迁移约定和安全说明分别位于 [CONTRIBUTING.md](CONTRIBUTING.md) 与 [SECURITY.md](SECURITY.md)。

## 许可证

本项目采用 [MIT License](LICENSE)。
