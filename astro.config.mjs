import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// 纯静态输出，零后端。域名在 src/content/site.ts（或环境变量 PUBLIC_SITE_URL）里配置。
export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  build: { inlineStylesheets: 'always' },
  vite: { plugins: [tailwindcss()] },
});
