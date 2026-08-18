// 分类筛选：点击筛选项只显示对应分类的工具卡片（与搜索联动）。
const chips = Array.from(
  document.querySelectorAll<HTMLButtonElement>('#category-chips button[data-filter]'),
)
const cards = Array.from(document.querySelectorAll<HTMLElement>('#tool-grid [data-category]'))
const countEl = document.getElementById('tool-count')

const BASE = 'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition'
const INACTIVE = 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200'
const ACTIVE = 'border-violet-500/40 bg-violet-500/15 text-violet-200'

let current = 'all'

function apply(value: string) {
  current = value
  let shown = 0
  cards.forEach((card) => {
    const visible = value === 'all' || card.dataset.category === value
    card.classList.toggle('hidden', !visible)
    if (visible) shown++
  })
  if (countEl) countEl.textContent = String(shown)
  chips.forEach((chip) => {
    const on = chip.dataset.filter === value
    chip.className = `${BASE} ${on ? ACTIVE : INACTIVE}`
    chip.setAttribute('aria-pressed', String(on))
  })
}

chips.forEach((chip) => {
  chip.addEventListener('click', () => apply(chip.dataset.filter ?? 'all'))
})

// 搜索被清空时，恢复当前分类下的正确数量
window.addEventListener('search-cleared', () => apply(current))
