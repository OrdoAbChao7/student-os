# GitHub Pages 静态预览

仓库包含 `.github/workflows/pages.yml`。该工作流会在 `main` 分支有推送或手动触发时执行：安装锁定依赖、运行 `pnpm build:pages`，将由 Vite 构建出的 `dist/pages` 客户端产物上传并部署到 GitHub Pages。

## 为什么不直接部署完整应用

GitHub Pages 只能提供静态文件，而 Student OS 的完整功能依赖 Node 服务端、Manus OAuth 回调、tRPC API、MySQL/TiDB 和服务端 AI 网关。把完整前端构建产物放到 Pages 后，这些 `/api` 路径不会存在，登录、用户隔离、数据库读写和 AI 日报都会失效。

因此，Pages 站点是项目简介与设计预览，完整应用应部署到支持 Node.js 服务端和数据库连接的环境。该边界在预览页面中也会明确展示，避免用户误将静态预览视作具备数据能力的生产实例。

## 启用方式

在仓库 **Settings → Pages → Build and deployment → Source** 中选择 **GitHub Actions**。首次推送工作流后，GitHub 将创建 `github-pages` 环境，并将部署地址显示在 `Deploy GitHub Pages Preview` 工作流的 deploy job 输出中。

默认项目页地址为：

```text
https://ordoabchao7.github.io/student-os/
```

如果设置自定义域名，请通过 GitHub Pages 设置或 GitHub API 配置域名；提交 `CNAME` 文件本身不会完成域名绑定。
