// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

// 纯静态输出：构建产物 dist/ 只有 HTML / CSS / JS / JSON，
// 客户端不依赖任何 CDN 或运行时服务，即「零运行时依赖」。
export default defineConfig({
  // 部署地址：替换为你自己的 Cloudflare Pages 域名（影响 canonical / sitemap）
  site: 'https://ai-tools-nav-c7i.pages.dev',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
})
