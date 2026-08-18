// 搜索脚本：加载构建期生成的全文索引，用 Fuse.js 做跨模块模糊搜索。
// 纯前端实现，无任何运行时外部依赖（Fuse 由构建打包进产物）。
import Fuse from 'fuse.js'

type Entry = {
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
  body: string
}

const MAX_RESULTS = 8

const input = document.getElementById('search-input') as HTMLInputElement | null
const resultsBox = document.getElementById('search-results') as HTMLElement | null
const grid = document.getElementById('tool-grid') as HTMLElement | null
const countEl = document.getElementById('tool-count') as HTMLElement | null

let fuse: Fuse<Entry> | null = null
let loading = false
let items: Entry[] = []
let activeIndex = -1

function fmt(n: number | null): string {
  if (n == null) return ''
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'k'
  return String(n)
}

function escapeHtml(s: string): string {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

async function loadFuse(): Promise<void> {
  if (fuse || loading) return
  loading = true
  try {
    const res = await fetch('/search-index.json', { headers: { Accept: 'application/json' } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    items = (await res.json()) as Entry[]
    fuse = new Fuse<Entry>(items, {
      keys: [
        { name: 'name', weight: 0.4 },
        { name: 'category', weight: 0.12 },
        { name: 'tags', weight: 0.15 },
        { name: 'description', weight: 0.2 },
        { name: 'body', weight: 0.13 },
      ],
      includeScore: true,
      threshold: 0.42,
      ignoreLocation: true,
      minMatchCharLength: 1,
    })
  } catch (err) {
    console.error('[search] 全文索引加载失败：', err)
  } finally {
    loading = false
  }
}

function setActive(index: number) {
  activeIndex = index
  resultsBox?.querySelectorAll<HTMLAnchorElement>('a[data-slug]').forEach((el, i) => {
    el.classList.toggle('bg-white/10', i === index)
    el.classList.toggle('bg-transparent', i !== index)
  })
}

function renderResults() {
  if (!input || !resultsBox || !fuse) return
  const query = input.value.trim()
  if (!query) {
    hideResults()
    return
  }
  const results = fuse.search(query).slice(0, MAX_RESULTS)

  document.body.classList.add('searching')
  if (countEl) countEl.textContent = String(results.length)

  if (!results.length) {
    resultsBox.innerHTML = `<div class="px-5 py-8 text-center text-sm text-slate-500">没有找到与「${escapeHtml(
      query,
    )}」相关的工具</div>`
    resultsBox.classList.remove('hidden')
    return
  }

  const html =
    `<div class="px-4 pt-3 pb-1.5 text-xs font-medium tracking-wider text-slate-500">${results.length} 条匹配</div>` +
    results
      .map(
        ({ item }) => `
      <a
        data-slug="${item.slug}"
        href="/tools/${item.slug}/"
        class="block px-4 py-3 transition"
      >
        <div class="flex items-center gap-3">
          <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-lg">${item.icon}</span>
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span class="font-medium text-slate-100">${item.name}</span>
              <span class="rounded-md bg-white/5 px-1.5 py-0.5 text-[11px] text-slate-400">${item.category}</span>
              <span class="text-[11px] text-slate-500">${item.price}</span>
            </div>
            <p class="truncate text-xs text-slate-500">${item.description}</p>
          </div>
          <span class="shrink-0 text-xs text-slate-500">
            ${item.stars != null ? `<span class="text-amber-400">★</span> ${fmt(item.stars)}` : ''}
          </span>
        </div>
      </a>`,
      )
      .join('')

  resultsBox.innerHTML = html
  resultsBox.classList.remove('hidden')
  setActive(0)
}

function hideResults() {
  resultsBox?.classList.add('hidden')
  document.body.classList.remove('searching')
  // 恢复统计数字，并通知分类筛选重新统计
  if (countEl) countEl.textContent = countEl.dataset.total ?? ''
  window.dispatchEvent(new CustomEvent('search-cleared'))
}

if (input) {
  input.addEventListener('input', () => {
    loadFuse().then(renderResults)
  })
  input.addEventListener('focus', () => {
    if (input.value.trim()) renderResults()
  })
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const n = resultsBox?.querySelectorAll('a[data-slug]').length ?? 0
      if (n) setActive((activeIndex + 1) % n)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const n = resultsBox?.querySelectorAll('a[data-slug]').length ?? 0
      if (n) setActive((activeIndex - 1 + n) % n)
    } else if (e.key === 'Enter') {
      const link = resultsBox?.querySelectorAll<HTMLAnchorElement>('a[data-slug]')[activeIndex]
      if (link) {
        const href = link.getAttribute('href')
        if (href) window.location.href = href
      }
    } else if (e.key === 'Escape') {
      input.value = ''
      hideResults()
      input.blur()
    }
  })
  // 点击下拉结果前保持输入框焦点，避免 blur 提前收起
  input.addEventListener('blur', () => setTimeout(hideResults, 120))
}

resultsBox?.addEventListener('mousedown', (e) => e.preventDefault())
resultsBox?.addEventListener('click', (e) => {
  const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[data-slug]')
  const href = link?.getAttribute('href')
  if (href) window.location.href = href
})

// 全局快捷键：在非输入场景按 / 聚焦搜索
document.addEventListener('keydown', (e) => {
  if (e.key !== '/') return
  const tag = (e.target as HTMLElement).tagName
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return
  e.preventDefault()
  input?.focus()
  input?.select()
})
