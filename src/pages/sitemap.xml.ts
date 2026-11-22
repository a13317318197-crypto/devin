// sitemap.xml：列出两种语言的全部页面，并带上 hreflang 对应关系。
import type { APIRoute } from 'astro';
import { absoluteUrl, allPages, LANGS, pagePath } from '../lib/site';

export const GET: APIRoute = () => {
  const urls = allPages().flatMap((page) =>
    LANGS.map((lang) => {
      const alternates = [...LANGS.map((code) => [code, code] as const), ['x-default', 'en'] as const]
        .map(([hreflang, code]) => `<xhtml:link rel="alternate" hreflang="${hreflang}" href="${absoluteUrl(pagePath(code, page))}"/>`)
        .join('');
      return `<url><loc>${absoluteUrl(pagePath(lang, page))}</loc>${alternates}</url>`;
    }),
  );
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
