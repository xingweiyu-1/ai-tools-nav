# AI 工具聚合导航站

收录 30+ 个 AI 编程工具的静态导航站：终端智能体、AI 编辑器、IDE 插件、应用生成器与多智能体框架。
支持**跨模块全文模糊搜索**，数据由 **GitHub Actions 每日自动同步**，部署于 **Cloudflare Pages**，客户端零运行时依赖。

| 能力 | 实现 |
| --- | --- |
| 静态站点 | [Astro](https://astro.build)（纯静态输出 `dist/`） |
| 样式 | [Tailwind CSS v4](https://tailwindcss.com) |
| 客户端全文模糊搜索 | [Fuse.js](https://fusejs.io)（构建时打包进产物，无 CDN） |
| 数据自动同步 | GitHub Actions 定时调用 GitHub API |
| 部署 | Cloudflare Pages |

## 功能特性

- 🔍 **跨模块全文检索**：Fuse.js 在前端完成模糊搜索，索引覆盖工具名称、分类、标签、简介、特性与正文全文。
- 🗂️ **分类筛选**：按「智能体 / AI 编辑器 / IDE 插件 / 应用生成 / 多智能体框架 / 代码审查」筛选卡片，与搜索联动。
- 📈 **自动数据同步**：`scripts/sync-repos.mjs` 每日抓取仓库星标、描述、主题、最近推送；还能自动**发现高星 AI 仓库**候选供人工收录。
- ⚡ **零运行时依赖**：构建产物全部静态化；Fuse.js 与所有脚本由 Astro/Vite 打包为本地资源，客户端仅请求同源静态 JSON。
- ⌨️ **快捷键**：按 `/` 聚焦搜索，`↑`/`↓` 选择，`Enter` 打开，`Esc` 关闭。

## 快速开始

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # 输出 dist/
npm run preview   # 本地预览构建产物
```

> 需要 Node.js ≥ 20。

## 项目结构

```
.
├── .github/workflows/
│   └── sync-repos.yml        # 每日自动同步仓库数据 + 提交
├── scripts/
│   └── sync-repos.mjs        # GitHub API 同步脚本（可本地手动运行）
├── public/                   # 静态资源（favicon / robots.txt）
├── src/
│   ├── content/
│   │   ├── config.ts         # 内容集合 Schema
│   │   └── tools/*.md        # ★ 每个工具一个 Markdown（正文即全文检索内容）
│   ├── data/
│   │   ├── repo-stats.json   # 仓库统计（由同步脚本更新）
│   │   └── discovered.json   # 自动发现的高星候选（人工 review）
│   ├── lib/
│   │   ├── tools.ts          # 内容 + 统计合并、分类、检索索引构建
│   │   └── site.ts           # 站点级配置（标题 / 仓库地址等）
│   ├── scripts/
│   │   ├── search.ts         # Fuse.js 搜索（下拉、键盘导航）
│   │   └── category-filter.ts
│   ├── components/           # Header / Footer / ToolCard / Chips / StatsBar
│   ├── layouts/BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── 404.astro
│   │   ├── tools/[slug].astro   # 工具详情页
│   │   └── search-index.json.ts # 构建期预渲染为 /search-index.json
```

## 添加 / 修改工具

在 `src/content/tools/` 下新增一个 Markdown 文件（或编辑现有文件）：

```markdown
---
name: 工具名
category: 智能体                  # 智能体 / AI 编辑器 / IDE 插件 / 应用生成 / 多智能体框架 / 代码审查
description: 一句话简介
icon: ⚡                         # 任意 emoji
website: https://example.com
github: owner/repo               # 可选；填写后自动同步星标等数据
price: 免费增值                  # 免费 / 免费增值 / 付费 / 开源
tags: [CLI, 终端智能体]
features:
  - 特性 1
  - 特性 2
---

正文（Markdown），会纳入全文检索索引。
```

## 数据同步是如何工作的

1. **GitHub Actions**（`.github/workflows/sync-repos.yml`）每天 UTC 02:17 运行（也可在 Actions 页手动触发）；
2. `scripts/sync-repos.mjs` 扫描所有工具的 `github` 字段，抓取仓库最新统计，并自动发现新的高星候选写入 `src/data/discovered.json`；
3. 有变化则自动提交并推送 → **Cloudflare Pages 监听到 push 自动重建部署**；
4. 使用 `GITHUB_TOKEN`（仓库默认提供）避免 API 限流，无需额外配置密钥。

本地手动同步：`npm run sync`（匿名限流 60 次/小时，建议设置 `GITHUB_TOKEN` 环境变量）。

## 部署到 Cloudflare Pages

1. 把本目录推送到一个 GitHub 仓库（`git init` → `git add` → `git commit` → 关联远程）；
2. Cloudflare 控制台 → Workers & Pages → **创建 → Pages → 连接 Git 仓库**；
3. 构建设置：
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node.js version**: `20`（或更高）
4. 保存后首次部署即完成；之后每次 push（含定时同步的自动提交）都会自动重新构建。

> 上线前请做两处替换：
> - `astro.config.mjs` 中的 `site` → 你的 Pages 域名；
> - `src/lib/site.ts` 中的 `repo` → 你的仓库地址。

## 常见问题

**为什么说是「零运行时依赖」？**
构建产物只有静态文件；Fuse.js 被打包进本地 JS，字体走系统字体栈（含中文字体），搜索索引是同源静态 JSON —— 客户端不加载任何外部 CDN / 服务。

**星标数字不准？**
`src/data/repo-stats.json` 是占位快照，首次 GitHub Actions 同步后即为真实数据。

## License

MIT
