<div align="center">
  <h1>student-os</h1>
  <b>English</b> | <a href="./README_zh-CN.md"><b>中文</b></a>
</div>
<br>

> A real data-driven growth workspace for individual developers and learners.

Student OS unifies tasks, focused time, course learning, personal projects, skill experience, and daily reviews into a single workflow. Its core principle is: do not display fabricated progress, and do not conjure AI conclusions out of thin air. All growth metrics and daily suggestions come from the currently signed-in user's saved real activity records.

[![CI](https://github.com/OrdoAbChao7/student-os/actions/workflows/ci.yml/badge.svg)](https://github.com/OrdoAbChao7/student-os/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-indigo.svg)](LICENSE)

## Feature Overview

| Module | Implemented Capabilities |
| --- | --- |
| Identity & Privacy | Manus OAuth login; all domain data is constrained and filtered by `userId`. |
| Growth Dashboard | Displays today's tasks, time invested, growth index, project status, and AI report entry point. |
| Task System | Create, edit, and complete tasks; supports priority, due date, categories, and tags. |
| Time Tracking | Supports manual check-in and start/stop timer; aggregates by day and the last 7 days. |
| Learning System | Maintain courses, resources, study notes, and study logs; records update course progress. |
| Project Space | Manage tech stack, milestones, and project sub-tasks; completing nodes advances project progress. |
| Skills Graph | Customizable skill dimensions; tasks, learning, and project nodes can accumulate experience points, displayed as a radar chart. |
| Daily Review | Aggregates real completions and time invested, and records highlights, challenges, and tomorrow's focus. |
| AI Reports | Uses only the day's saved tasks, learning, time, projects, skills, and review data to generate a summary and next-day plan. |

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS 4, shadcn/ui, Recharts, Wouter |
| Backend | Node.js, Express 4, tRPC 11, Zod |
| Data | MySQL / TiDB, Drizzle ORM and Drizzle Kit |
| Identity | Manus OAuth |
| AI | Manus built-in LLM gateway with structured JSON output |
| Testing | Vitest |

## Getting Started

### Prerequisites

Prepare Node.js 22 or later, pnpm 10, and a working MySQL/TiDB database. When running in a Manus environment, OAuth, database, and AI gateway system variables are injected automatically; for local development, you must provide equivalent configuration yourself.

### Install & Run

```bash
git clone https://github.com/OrdoAbChao7/student-os.git
cd student-os
pnpm install --frozen-lockfile
```

After adding the required environment variables to a local `.env` file, generate and apply database migrations:

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
pnpm dev
```

When the dev server starts, open the local URL printed in your terminal.

### Environment Variables

Do not commit real credentials. The table below lists the configuration items actually read by the server.

| Variable | Purpose | Required for local dev? |
| --- | --- | --- |
| `DATABASE_URL` | MySQL/TiDB connection string | Yes |
| `JWT_SECRET` | Session cookie signature | Yes |
| `VITE_APP_ID` | OAuth application identifier | Yes |
| `OAUTH_SERVER_URL` | OAuth server URL | Yes |
| `OWNER_OPEN_ID` | Project owner identifier | Optional |
| `BUILT_IN_FORGE_API_URL` | Manus AI gateway URL | Only required when AI Reports are enabled |
| `BUILT_IN_FORGE_API_KEY` | Manus AI gateway key | Only required when AI Reports are enabled |

## Common Commands

```bash
# Start dev server
pnpm dev

# Type checking
pnpm check

# Run unit tests
pnpm test

# Build production bundle
pnpm build

# Format code
pnpm format
```

## GitHub Pages Static Preview

The repository includes an automated Pages workflow. On every push to the `main` branch, the workflow builds a React static preview for the project page via `build:pages` and publishes the Vite artifacts in `dist/pages` to GitHub Pages. Once enabled, the default address is <https://ordoabchao7.github.io/student-os/>.

> GitHub Pages can only host static files. It cannot run the Node server, OAuth callbacks, tRPC API, database, or server-side AI gateway required by this project. Therefore, the Pages site serves as a project showcase and design preview, not a fully sign-in-capable Student OS instance. The full application must be deployed in an environment that supports Node.js and a database.

For first-time enablement, go to the repository Settings → Pages → Source and select GitHub Actions. See the [GitHub Pages Guide](docs/github-pages.md) for the full workflow design, deployment boundaries, and custom domain notes.

## Project Structure

```text
student-os/
├── client/                 # React frontend
│   └── src/
│       ├── components/     # Layout, business components, and UI primitives
│       ├── pages/          # Dashboard, Tasks, Time, Learning, Projects, Skills, Review pages
│       └── lib/            # tRPC client and shared utilities
├── server/                 # Express / tRPC backend
│   ├── routers/            # Growth domain and AI domain procedures
│   ├── _core/              # OAuth, LLM, runtime infrastructure
│   └── db.ts               # User-isolated queries, XP rules, and aggregation logic
├── drizzle/                # Drizzle schema, migrations, and snapshots
├── shared/                 # Shared constants and types for client and server
├── docs/                   # Architecture, development, and design docs
├── .github/                # CI, issue forms, and PR templates
└── package.json
```

More detailed design and engineering conventions can be found in [Architecture](docs/architecture.md), [Development Guide](docs/development.md), and [Contributing Guide](CONTRIBUTING.md).

## Data & AI Principles

Student OS uses two layers of protection to ensure personal data ownership boundaries: server-side tRPC procedures require an authenticated user, and database read/write operations filter by both the record ID and `userId`. Before generating the AI daily report, the system aggregates the day's real activities; if there are no task, learning, timer, or review records for the day, the API will refuse to generate a report instead of producing placeholder content.

## Development & Contributions

Feel free to discuss requirements or defects via Issues, and pull requests are welcome. Before submitting, at minimum run:

```bash
pnpm check
pnpm test
```

The detailed collaboration workflow, migration conventions, and security notes are in [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md).

## License

This project is licensed under the [MIT License](LICENSE).
