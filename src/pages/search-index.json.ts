import type { APIRoute } from 'astro'
import { buildSearchIndex } from '../lib/tools'

// 构建期预渲染为 /search-index.json —— 客户端的 Fuse.js 全文检索索引。
// 零运行时依赖：这是一个静态 JSON 文件，不是 API。
export const GET: APIRoute = async () => {
  const index = await buildSearchIndex()
  return new Response(JSON.stringify(index), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
