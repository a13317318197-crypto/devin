// 页面共用的小工具。内容本身都在 src/content/site.ts。
import { docs, products, site, ui, type PreviewCategory, type Text } from '../content/site';
import manifest from '../generated/previews.json';

export const LANGS = ['en', 'zh'] as const;
export type Lang = (typeof LANGS)[number];
export type Product = (typeof products)[number];
export type Preview = {
  id: string;
  category: PreviewCategory;
  src: string;
  thumb: string;
  width: number;
  height: number;
  thumbWidth: number;
  placeholder: boolean;
};

export const HTML_LANG: Record<Lang, string> = { en: 'en', zh: 'zh-Hans' };
export const otherLang = (lang: Lang): Lang => (lang === 'en' ? 'zh' : 'en');
export const langStaticPaths = () => LANGS.map((lang) => ({ params: { lang } }));

/** 取出一种语言的文字，并填入 {占位符} */
export const t = (text: Text, lang: Lang, vars: Record<string, string | number> = {}) =>
  text[lang].replace(/\{(\w+)\}/g, (match, key: string) => (key in vars ? String(vars[key]) : match));

export const siteUrl = (import.meta.env.PUBLIC_SITE_URL || site.url).replace(/\/+$/, '');
export const absoluteUrl = (pathname: string) => siteUrl + pathname;

/** 站内路径，例如 pagePath('zh', 'gallery') → /zh/gallery/ */
export const pagePath = (lang: Lang, page = '') => {
  const clean = page.replace(/^\/+|\/+$/g, '');
  return `/${lang}/${clean ? clean + '/' : ''}`;
};
export const productPage = (product: Product) => `products/${product.slug}`;
/** 每种语言都有的全部页面（用于 sitemap） */
export const allPages = () => ['', 'gallery', 'free-sample', 'about', 'contact', ...products.map(productPage), ...docs.map((doc) => doc.slug)];

export const formatPrice = (price: number, lang: Lang) => (price === 0 ? ui.free[lang] : `${site.currencySymbol}${price}`);

export const previews = manifest.images as Preview[];
export const hasPlaceholders = previews.some((preview) => preview.placeholder);
export const previewsOf = (category: PreviewCategory) => previews.filter((preview) => preview.category === category);

/** 把几个分类的图轮流排在一起，让画面有变化 */
export const interleave = (categories: PreviewCategory[]) => {
  const lists = categories.map(previewsOf);
  const longest = Math.max(0, ...lists.map((list) => list.length));
  const mixed: Preview[] = [];
  for (let i = 0; i < longest; i += 1) for (const list of lists) if (list[i]) mixed.push(list[i]);
  return mixed;
};
// 合集从每个分类的第二张开始排，这样它的封面不会和任何一个单品包的封面重复
export const previewsForProduct = (product: Product) => {
  const mixed = interleave(product.previews);
  const skip = product.previews.length;
  return skip > 1 && mixed.length > skip ? [...mixed.slice(skip), ...mixed.slice(0, skip)] : mixed;
};
/** 一张预览图所属的单品包（合集除外） */
export const packOf = (preview: Preview) => products.find((product) => product.previews.length === 1 && product.previews[0] === preview.category)!;
export const altFor = (preview: Preview, lang: Lang) => t(ui.alt[preview.category], lang, { n: Number(preview.id.split('-').pop()) });
export const shareImage = (category: PreviewCategory = 'desktop') => `/previews/og/${category}.jpg`;
