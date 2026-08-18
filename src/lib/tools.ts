import { getCollection, type CollectionEntry } from 'astro:content'
import repoStatsJson from '../data/repo-stats.json'

export type Tool = CollectionEntry<'tools'>

/** GitHub Actions 同步到的仓库统计（key 为 owner/repo） */
export type RepoStat = {
  stars: number
  forks?: number
  description?: string
  homepage?: string
  topics?: string[]
  pushedAt?: string
  license?: string | null
  archived?: boolean
}

const REPO_STATS: Record<string, RepoStat> = repoStatsJson.repos ?? {}

// ---------------------------------------------------------------------------
// 分类元信息（含 Tailwind 字面类名，保证被正确生成）
// ---------------------------------------------------------------------------
export type CategoryMeta = {
  label: string
  chip: string
  dot: string
  iconBg: string
  ring: string
}

export const CATEGORY_META: Record<string, CategoryMeta> = {
  智能体: {
    label: '智能体',
    chip: 'bg-sky-500/10 text-sky-300 ring-sky-500/30',
    dot: 'bg-sky-400',
    iconBg: 'from-sky-500/25 to-sky-500/5',
    ring: 'hover:ring-sky-400/40',
  },
  'AI 编辑器': {
    label: 'AI 编辑器',
    chip: 'bg-violet-500/10 text-violet-300 ring-violet-500/30',
    dot: 'bg-violet-400',
    iconBg: 'from-violet-500/25 to-violet-500/5',
    ring: 'hover:ring-violet-400/40',
  },
  'IDE 插件': {
    label: 'IDE 插件',
    chip: 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/30',
    dot: 'bg-emerald-400',
    iconBg: 'from-emerald-500/25 to-emerald-500/5',
    ring: 'hover:ring-emerald-400/40',
  },
  应用生成: {
    label: '应用生成',
    chip: 'bg-amber-500/10 text-amber-300 ring-amber-500/30',
    dot: 'bg-amber-400',
    iconBg: 'from-amber-500/25 to-amber-500/5',
    ring: 'hover:ring-amber-400/40',
  },
  多智能体框架: {
    label: '多智能体框架',
    chip: 'bg-rose-500/10 text-rose-300 ring-rose-500/30',
    dot: 'bg-rose-400',
    iconBg: 'from-rose-500/25 to-rose-500/5',
    ring: 'hover:ring-rose-400/40',
  },
  代码审查: {
    label: '代码审查',
    chip: 'bg-cyan-500/10 text-cyan-300 ring-cyan-500/30',
    dot: 'bg-cyan-400',
    iconBg: 'from-cyan-500/25 to-cyan-500/5',
    ring: 'hover:ring-cyan-400/40',
  },
}

export const CATEGORY_ORDER = Object.keys(CATEGORY_META)

export function categoryMeta(category: string): CategoryMeta {
  return CATEGORY_META[category] ?? {
    label: category,
    chip: 'bg-slate-500/10 text-slate-300 ring-slate-500/30',
    dot: 'bg-slate-400',
    iconBg: 'from-slate-500/25 to-slate-500/5',
    ring: 'hover:ring-slate-400/40',
  }
}

// ---------------------------------------------------------------------------
// 工具数据（内容集合 + 同步仓库统计 合并）
// ---------------------------------------------------------------------------
export async function getAllTools(): Promise<Tool[]> {
  const tools = await getCollection('tools')
  return tools
}

/** 某工具对应的 GitHub 仓库统计（无 github 字段则返回 null） */
export function repoStatOf(tool: Tool): RepoStat | null {
  const repo = tool.data.github
  return repo ? REPO_STATS[repo.toLowerCase()] ?? null : null
}

export function starsOf(tool: Tool): number | null {
  return repoStatOf(tool)?.stars ?? null
}

export function formatNumber(n: number | null | undefined): string {
  if (n == null) return ''
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'k'
  return String(n)
}

export async function getCategories(): Promise<{ label: string; count: number }[]> {
  const tools = await getAllTools()
  const counts = new Map<string, number>()
  for (const t of tools) {
    counts.set(t.data.category, (counts.get(t.data.category) ?? 0) + 1)
  }
  return CATEGORY_ORDER.filter((c) => (counts.get(c) ?? 0) > 0).map((c) => ({
    label: c,
    count: counts.get(c) ?? 0,
  }))
}

export async function getTotalStars(): Promise<number> {
  const tools = await getAllTools()
  return tools.reduce((sum, t) => sum + (starsOf(t) ?? 0), 0)
}

export async function getOpenSourceCount(): Promise<number> {
  const tools = await getAllTools()
  return tools.filter((t) => t.data.price === '开源').length
}

// ---------------------------------------------------------------------------
// 全文检索索引（跨模块：标题 / 分类 / 标签 / 简介 / 正文 全部纳入）
// ---------------------------------------------------------------------------
export type SearchEntry = {
  slug: string
  name: string
  category: string
  icon: string
  description: string
  tags: string[]
  price: string
  website?: string
  repo?: string
  stars: number | null
  /** 全文（markdown 正文转纯文本） */
  body: string
}

/** 简单地把 markdown 转成可检索的纯文本 */
export function mdToPlain(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export async function buildSearchIndex(): Promise<SearchEntry[]> {
  const tools = await getAllTools()
  return tools.map((t) => ({
    slug: t.id,
    name: t.data.name,
    category: t.data.category,
    icon: t.data.icon,
    description: t.data.description,
    tags: t.data.tags,
    price: t.data.price,
    website: t.data.website,
    repo: t.data.github,
    stars: starsOf(t),
    // 全文 = 正文 + 特性列表，让检索覆盖到「功能描述」层级
    body: `${mdToPlain(t.body)} ${t.data.features.join(' ')}`,
  }))
}
