/**
 * 仓库数据同步脚本（由 GitHub Actions 定时调用，也可本地手动执行）。
 *
 * 做什么：
 *  1. 扫描 src/content/tools/*.md 中的 `github` 字段，收集需要追踪的仓库；
 *  2. 调用 GitHub REST API 抓取每个仓库的星标 / fork / 描述 / 主题 / 最近推送等；
 *  3. 通过 Search API 发现新的高星 AI 编程仓库，写入 src/data/discovered.json（人工 review 后可收录）；
 *  4. 更新 src/data/repo-stats.json，提交后触发 Cloudflare Pages 自动重建。
 *
 * 用法：
 *  node scripts/sync-repos.mjs            # 匿名（限流 60 次/时）
 *  GITHUB_TOKEN=xxx node scripts/sync-repos.mjs
 */
import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const TOOLS_DIR = path.join(ROOT, 'src', 'content', 'tools')
const STATS_FILE = path.join(ROOT, 'src', 'data', 'repo-stats.json')
const DISCOVERED_FILE = path.join(ROOT, 'src', 'data', 'discovered.json')

const TOKEN = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN ?? ''
const DELAY_MS = 150

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function gh(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'ai-tools-nav-sync',
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
    },
  })
  if (res.status === 404) return null
  if (res.status === 403) {
    console.warn(`[warn] 可能触发限流（剩余 ${res.headers.get('x-ratelimit-remaining')} 次），${url}`)
  }
  if (!res.ok) throw new Error(`GitHub API ${res.status} for ${url}`)
  return res.json()
}

async function main() {
  // 1) 从内容文件中收集需要追踪的仓库
  const files = (await readdir(TOOLS_DIR)).filter((f) => f.endsWith('.md'))
  const tracked = new Set()
  for (const f of files) {
    const src = await readFile(path.join(TOOLS_DIR, f), 'utf8')
    const { data } = matter(src)
    if (data.github && /^[^/]+\/[^/]+$/.test(data.github)) {
      tracked.add(data.github.toLowerCase())
    }
  }
  console.log(`追踪 ${tracked.size} 个仓库（来自 ${files.length} 个工具条目）`)

  // 2) 抓取每个仓库的最新统计
  const fresh = {}
  const skipped = []
  let i = 0
  for (const repo of tracked) {
    i++
    const data = await gh(`https://api.github.com/repos/${repo}`)
    if (!data) {
      skipped.push(repo)
      continue
    }
    fresh[repo] = {
      stars: data.stargazers_count ?? 0,
      forks: data.forks_count ?? 0,
      description: data.description ?? undefined,
      homepage: data.homepage ?? undefined,
      topics: data.topics ?? [],
      pushedAt: data.pushed_at ?? undefined,
      license: data.license?.spdx_id ?? null,
      archived: data.archived ?? false,
    }
    console.log(`[${i}/${tracked.size}] ${repo} → ★ ${fresh[repo].stars}`)
    await sleep(DELAY_MS)
  }

  // 3) 发现候选：高星 AI 编程仓库（人工 review 后收录）
  const discovered = []
  const known = new Set([...tracked, ...Object.keys(fresh)])
  const queries = [
    'topic:ai-coding+stars:>1000',
    'topic:code-assistant+stars:>1000',
    'topic:copilot+stars:>2000',
    'ai+coding+agent+in:name,description+stars:>3000',
  ]
  for (const q of queries) {
    try {
      const res = await gh(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=20`,
      )
      if (!res) continue
      for (const r of res.items ?? []) {
        const full = r.full_name.toLowerCase()
        if (known.has(full)) continue
        discovered.push({
          fullName: r.full_name,
          stars: r.stargazers_count,
          description: r.description,
          htmlUrl: r.html_url,
          topics: (r.topics ?? []).slice(0, 5),
          pushedAt: r.pushed_at,
        })
        known.add(full)
      }
      await sleep(DELAY_MS)
    } catch (err) {
      console.warn(`[warn] 搜索失败：${q} → ${err.message}`)
    }
  }
  discovered.sort((a, b) => b.stars - a.stars)

  // 4) 写回统计
  await writeFile(
    STATS_FILE,
    JSON.stringify(
      {
        updatedAt: new Date().toISOString(),
        note: '该文件由 .github/workflows/sync-repos.yml 定时调用 scripts/sync-repos.mjs 自动更新（数据来自 GitHub REST API）。',
        repos: fresh,
      },
      null,
      2,
    ) + '\n',
  )

  if (discovered.length > 0) {
    await writeFile(
      DISCOVERED_FILE,
      JSON.stringify(
        {
          updatedAt: new Date().toISOString(),
          note: '自动发现的高星 AI 编程仓库候选。人工 review 后，把条目加入 src/content/tools/ 并设置 github 字段即可收录。',
          candidates: discovered,
        },
        null,
        2,
      ) + '\n',
    )
  }

  console.log(
    `\n完成：更新 ${Object.keys(fresh).length} 个仓库；跳过 ${skipped.length} 个（${skipped.join(', ')}）；发现候选 ${discovered.length} 个。`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
