# Cloudflare Pages 部署指南（ai-tools-nav）

> 记录 2026-08-18 实际操作的完整流程，包括新版界面的入口坑。

## ⚠️ 关键坑：新版界面入口变了

新版 Cloudflare 把 **Worker 和 Pages 合并成了同一个 "Create application" 入口**，所以找不到单独的 "Create Pages" 按钮。

在合并入口里：

- ❌ **"Continue with GitHub"** → 现在创建的是 **Worker**（下一步显示 "Configure your Worker project"，没有"构建输出目录"配置）—— 不要走这条
- ✅ 真正的 Pages 入口在弹窗里的一行小链接：**"Looking to deploy Pages? Get started"**

## 第一步：找到 Pages 专属入口

**方法 A（点界面）：**

1. 打开 **Workers & Pages**：`dash.cloudflare.com` → 左侧 **Workers & Pages**
2. 点右上角 **Create application**
3. 在弹窗里点 **"Looking to deploy Pages? Get started"**

**方法 B（直接输网址）：**

```
https://dash.cloudflare.com/<账号ID>/workers-and-pages/create/pages
```

进入后选 **Import an existing Git repository** → 点 **Get started**（或直接访问 `https://dash.cloudflare.com/<账号ID>/pages/new/provider/github`）。

## 第二步：连接 GitHub 仓库

页面顶部有三步流程：**1 Select repository → 2 Set up builds and deployments → 3 Deploy site**

1. 确认 GitHub 账号是 `xingweiyu-1`
2. **点击仓库那一行 `ai-tools-nav` 选中它**（必须点那一行，否则 **Begin setup** 按钮是灰色禁用的）
3. 点 **Begin setup**

## 第三步：构建配置

| 配置项 | 填写值 |
| --- | --- |
| Project name | `ai-tools-nav` |
| Production branch | `master` |
| Framework preset | **Astro**（选完自动带出下面两项） |
| Build command | `npm run build` |
| Build output directory | `dist` |

页面提示部署地址：`https://ai-tools-nav-c7i.pages.dev`

## 第四步：部署

点 **Save and Deploy** → 等 1~2 分钟构建完成 → 访问 **https://ai-tools-nav-c7i.pages.dev**

之后每次 push 到 `master`（含 GitHub Actions 每天自动同步数据的提交）都会自动重新构建部署。

## 注意事项

1. 部署域名不是 `ai-tools-nav.pages.dev`（该子域名已被占用，Cloudflare 自动加了 `-c7i` 后缀）。`astro.config.mjs` 的 `site` 已同步改为 `https://ai-tools-nav-c7i.pages.dev`；以后绑定自定义域名后记得再改回来。
2. 之前误建过名为 `ai-tools-nav` 的 Worker（不影响 Pages），不需要可去 **Workers & Pages → Workers** 删除。
3. 数据自动同步：`.github/workflows/sync-repos.yml` 每天 UTC 02:17 更新工具数据并自动提交 → 自动触发 Pages 重新部署。
