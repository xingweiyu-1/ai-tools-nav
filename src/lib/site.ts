/** 站点级配置：部署后记得把 repo 换成你自己的仓库地址 */
export const SITE = {
  title: 'AI 工具聚合导航站',
  shortName: 'AI 工具导航',
  description:
    '一站式收录 30+ 个 AI 编程工具：终端智能体、AI 编辑器、IDE 插件与多智能体框架。支持跨模块全文模糊搜索，数据由 GitHub Actions 每日自动同步。',
  /** 替换为你的仓库地址（用于页脚 / 关于页的 GitHub 链接） */
  repo: 'https://github.com/xingweiyu-1/ai-tools-nav',
  /** 构建于哪套技术栈 */
  stack: ['Astro', 'Tailwind CSS', 'Fuse.js', 'GitHub Actions', 'Cloudflare Pages'],
} as const
