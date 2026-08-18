import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

// 每个工具 = 一个 markdown 文件（src/content/tools/<slug>.md）。
// 正文用于全文检索（跨模块），frontmatter 为结构化的元数据。
const tools = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tools' }),
  schema: z.object({
    name: z.string(),
    category: z.string(),
    description: z.string(),
    icon: z.string().default('🧰'),
    // 官网
    website: z.string().url().optional(),
    // GitHub 仓库（owner/repo），存在则该工具可被 GitHub Actions 自动同步星标等数据
    github: z.string().optional(),
    // 定价：免费 / 免费增值 / 付费 / 开源
    price: z.enum(['免费', '免费增值', '付费', '开源']).default('免费'),
    tags: z.array(z.string()).default([]),
    features: z.array(z.string()).default([]),
    // YAML 会把裸日期解析为 Date，统一 coerce 成字符串
    publishedAt: z.coerce.string().optional(),
  }),
})

export const collections = { tools }
