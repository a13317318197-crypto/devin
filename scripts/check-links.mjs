// 链接与基础 SEO / 无障碍检查（npm run check:links，需先 npm run build）。
// 只检查站内链接和文件是否存在；外部网址（Gumroad 等）只列出来，不会去请求。
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'cheerio';

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => (entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)])));
  return files.flat();
}

const files = await walk(DIST);
const fileSet = new Set(files.map((file) => '/' + path.relative(DIST, file).split(path.sep).join('/')));
const pages = new Map();
for (const file of files.filter((name) => name.endsWith('.html'))) {
  const url = ('/' + path.relative(DIST, file).split(path.sep).join('/')).replace(/index\.html$/, '');
  pages.set(url, load(await fs.readFile(file, 'utf8')));
}

const problems = [];
const external = new Map();
const titles = new Map();
const descriptions = new Map();
let linkCount = 0;
let imageCount = 0;

// 站内路径是否存在；带 #锚点 时目标页面里要有对应 id
function resolves(href, from) {
  const url = new URL(href, 'https://site.local' + from);
  const pathname = decodeURIComponent(url.pathname);
  if (pages.has(pathname)) {
    if (url.hash && pages.get(pathname)(`[id="${url.hash.slice(1)}"]`).length === 0) return false;
    return true;
  }
  return fileSet.has(pathname);
}
const firstSrcsetUrls = (srcset) => srcset.split(',').map((part) => part.trim().split(/\s+/)[0]).filter(Boolean);

let siteOrigin = '';
for (const [url, $] of pages) {
  const canonical = $('link[rel="canonical"]').attr('href');
  if (canonical && !siteOrigin) siteOrigin = new URL(canonical).origin;
}

for (const [url, $] of pages) {
  const fail = (message) => problems.push(`${url}: ${message}`);
  const title = $('title').text().trim();
  const description = $('meta[name="description"]').attr('content')?.trim();
  if (!title) fail('缺少 <title>');
  if (!description) fail('缺少 meta description');
  if (!$('html').attr('lang')) fail('<html> 缺少 lang');
  if ($('h1').length !== 1 && url !== '/404.html') fail(`应该只有一个 <h1>，实际 ${$('h1').length} 个`);

  const indexable = !/noindex/.test($('meta[name="robots"]').attr('content') ?? '');
  if (indexable) {
    if (titles.has(title)) fail(`title 与 ${titles.get(title)} 重复`);
    if (descriptions.has(description)) fail(`description 与 ${descriptions.get(description)} 重复`);
    titles.set(title, url);
    descriptions.set(description, url);
    const canonical = $('link[rel="canonical"]').attr('href');
    if (canonical !== siteOrigin + url) fail(`canonical 应为 ${siteOrigin + url}，实际 ${canonical}`);
    for (const code of ['en', 'zh', 'x-default']) {
      const href = $(`link[rel="alternate"][hreflang="${code}"]`).attr('href');
      if (!href) fail(`缺少 hreflang="${code}"`);
      else if (!href.startsWith(siteOrigin) || !pages.has(new URL(href).pathname)) fail(`hreflang="${code}" 指向不存在的页面 ${href}`);
    }
    const ogImage = $('meta[property="og:image"]').attr('content');
    if (!ogImage || !fileSet.has(new URL(ogImage).pathname)) fail(`og:image 不存在: ${ogImage}`);
  }

  $('a[href]').each((_, element) => {
    const href = $(element).attr('href');
    linkCount += 1;
    if (/^(mailto:|tel:)/.test(href)) return;
    if (/^https?:\/\//.test(href)) {
      external.set(href, (external.get(href) ?? 0) + 1);
      const rel = ($(element).attr('rel') ?? '').split(/\s+/);
      if (!rel.includes('noopener') || !rel.includes('noreferrer')) fail(`外链缺少 rel="noopener noreferrer": ${href}`);
      if ($(element).attr('target') !== '_blank') fail(`外链没有在新标签页打开: ${href}`);
      return;
    }
    if (href === '#') return; // 灯箱里由脚本填入的链接
    if (!resolves(href, url)) fail(`站内链接失效: ${href}`);
  });

  $('img').each((_, element) => {
    imageCount += 1;
    const src = $(element).attr('src') ?? '';
    if ($(element).attr('alt') === undefined) fail(`图片缺少 alt: ${src}`);
    if (!$(element).attr('width') || !$(element).attr('height')) fail(`图片缺少 width/height: ${src}`);
    if (src.startsWith('data:')) return;
    if ($(element).attr('alt') === '') fail(`图片 alt 为空: ${src}`);
    for (const candidate of [src, ...firstSrcsetUrls($(element).attr('srcset') ?? '')]) {
      if (!resolves(candidate, url)) fail(`图片文件不存在: ${candidate}`);
    }
  });

  $('script[src], link[rel="stylesheet"][href], link[rel="icon"][href]').each((_, element) => {
    const ref = $(element).attr('src') ?? $(element).attr('href');
    if (/^https?:\/\//.test(ref)) external.set(ref, (external.get(ref) ?? 0) + 1);
    else if (!resolves(ref, url)) fail(`资源文件不存在: ${ref}`);
  });

  $('script[type="application/ld+json"]').each((_, element) => {
    try {
      JSON.parse($(element).text());
    } catch {
      fail('JSON-LD 不是合法的 JSON');
    }
  });
}

// sitemap 里的每个地址都要有对应页面
const sitemap = await fs.readFile(path.join(DIST, 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
for (const loc of sitemapUrls) if (!pages.has(new URL(loc).pathname)) problems.push(`sitemap.xml: ${loc} 没有对应页面`);
if (!fileSet.has('/robots.txt')) problems.push('缺少 robots.txt');
if (!fileSet.has('/404.html')) problems.push('缺少 404.html');

console.log(`[links] ${pages.size} 个页面，${linkCount} 个链接，${imageCount} 张图片，sitemap ${sitemapUrls.length} 个地址`);
console.log('[links] 外部地址（未请求，只列出；占位链接上线前要换成真实的）：');
for (const [href, count] of [...external].sort()) console.log(`  ${/YOUR-NAME|example/i.test(href) ? '[占位] ' : ''}${href}  ×${count}`);
if (problems.length > 0) {
  console.error(`[links] 发现 ${problems.length} 个问题：\n- ` + problems.join('\n- '));
  process.exit(1);
}
console.log('[links] 通过：站内链接、图片、hreflang、canonical、外链 rel 均无问题。');
