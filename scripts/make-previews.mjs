// 生成带水印的低分辨率预览图（npm run previews，构建前自动运行）。
//
//   originals/{phone,desktop,avatar}/*.png   ← 你的原图（已在 .gitignore 里，永不提交、永不部署）
//   public/previews/{phone,desktop,avatar}/  ← 输出：带水印 webp 预览 + sm/ 缩略图
//   public/previews/og/                      ← 输出：社交分享图（由带水印预览合成）
//   src/generated/previews.json              ← 输出：页面读取的图片清单
//
// 规则（按分类分别判断）：
//   1. originals/<分类>/ 里有图  → 用原图重新生成该分类的预览。
//   2. 没有原图，但已有预览     → 原样保留（Cloudflare 上没有原图，走的就是这条）。
//   3. 既没有原图也没有预览     → 生成示意占位图，保证站点能构建、能看。
//
// 可选环境变量 ORIGINALS_DIR：原图放在仓库外时，指向那个目录。
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const WATERMARK_TEXT = 'MOONLIT INK · PREVIEW';
export const WATERMARK_OPACITY = 0.35;
// width = 预览图宽度（px）；placeholder = 没有原图时占位图的尺寸与数量
export const CATEGORIES = {
  phone: { width: 720, placeholder: { width: 720, height: 1280, count: 6 } },
  desktop: { width: 1280, placeholder: { width: 1280, height: 720, count: 4 } },
  avatar: { width: 640, placeholder: { width: 640, height: 640, count: 4 } },
};
const SOURCE_EXT = /\.(png|jpe?g|webp)$/i;
const PAPER = '#f7f4ec';

// ---------------------------------------------------------------- 水印
// 水印文字用内置的线条字形绘制，不依赖系统字体：任何电脑上结果都一样，
// 不会出现「机器上缺字体 → 水印悄悄消失」的情况。
const GLYPHS = {
  M: [4.4, 'M0 6V0L2.2 3.6L4.4 0V6'],
  O: [4, 'M1.2 0H2.8L4 1.2V4.8L2.8 6H1.2L0 4.8V1.2Z'],
  N: [4, 'M0 6V0L4 6V0'],
  L: [3.2, 'M0 0V6H3.2'],
  I: [0, 'M0 0V6'],
  T: [4, 'M0 0H4M2 0V6'],
  K: [3.8, 'M0 0V6M3.8 0L0 3.6M1.4 2.3L3.8 6'],
  P: [3.8, 'M0 6V0H2.6L3.8 1V2.4L2.6 3.4H0'],
  R: [3.8, 'M0 6V0H2.6L3.8 1V2.4L2.6 3.4H0M2.2 3.4L3.8 6'],
  E: [3.4, 'M3.4 0H0V6H3.4M0 3H2.6'],
  V: [4.2, 'M0 0L2.1 6L4.2 0'],
  W: [5.6, 'M0 0L1.4 6L2.8 1.6L4.2 6L5.6 0'],
  '·': [0.4, 'M0 3H0.4'],
  ' ': [1.2, ''],
};
const GLYPH_GAP = 1.6;

function watermarkLine(text) {
  let x = 0;
  let paths = '';
  for (const char of text) {
    const glyph = GLYPHS[char];
    if (!glyph) throw new Error('水印里有不支持的字符: ' + char);
    if (glyph[1]) paths += `<path transform="translate(${x.toFixed(2)} 0)" d="${glyph[1]}"/>`;
    x += glyph[0] + GLYPH_GAP;
  }
  return { paths, length: x - GLYPH_GAP };
}

// 斜向平铺、逐行错位，铺满整张图（含中心与四角），裁掉任何一边都还在。
export function watermarkSvg(width, height) {
  const { paths, length } = watermarkLine(WATERMARK_TEXT);
  const unit = Math.sqrt(width * height) / 230; // 字形 1 格 = 多少像素
  const stepX = (length + 14) * unit;
  const stepY = 30 * unit;
  const reach = Math.hypot(width, height) / 2 + stepX;
  let uses = '';
  let row = 0;
  for (let y = -reach; y <= reach; y += stepY, row += 1) {
    const shift = ((row * 0.37) % 1) * stepX;
    for (let x = -reach - shift; x <= reach; x += stepX) {
      uses += `<use xlink:href="#t" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${unit.toFixed(3)})"/>`;
    }
  }
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
      `<defs><g id="t">${paths}</g></defs>` +
      `<g opacity="${WATERMARK_OPACITY}" fill="none" stroke-linecap="round" stroke-linejoin="round" transform="translate(${width / 2} ${height / 2}) rotate(-30)">` +
      // 深色描边 + 浅色字芯：亮图暗图上都看得见
      `<g stroke="#000" stroke-width="1.7">${uses}</g><g stroke="#fff" stroke-width="0.85">${uses}</g>` +
      '</g></svg>',
  );
}

// ---------------------------------------------------------------- 占位图（没有原图时）
// 程序自绘的水墨山水示意图，不使用任何外部图片。
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PALETTES = [
  { sky: ['#f4efe3', '#ebe4d3'], ink: '#23261f', mist: '#f6f2e8', wash: '#6f7566', moon: '#fffdf6', bloom: '#a13f32' },
  { sky: ['#182429', '#465654'], ink: '#0b1214', mist: '#6f827e', wash: '#0b1214', moon: '#f6eed6', bloom: '#d9c9a0' },
  { sky: ['#efe6d4', '#f6f0e3'], ink: '#2c2f29', mist: '#f7f2e6', wash: '#8b8672', moon: '#a13f32', bloom: '#a13f32' },
];

function ridgePath(rand, w, h, baseY, amp, freq) {
  const phase = [rand() * 9, rand() * 9, rand() * 9];
  const step = Math.max(2, w / 180);
  let d = `M0 ${h}`;
  for (let x = 0; x <= w + step; x += step) {
    const u = (x / w) * freq;
    const big = 1 - Math.abs(Math.sin(Math.PI * (u + phase[0])));
    const mid = 1 - Math.abs(Math.sin(Math.PI * (u * 2.3 + phase[1])));
    const fine = Math.sin(Math.PI * 2 * (u * 5.3 + phase[2]));
    const y = baseY - amp * (0.62 * big * big + 0.3 * mid + 0.05 * fine);
    d += `L${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d + `L${w} ${h}Z`;
}

function growBranch(rand, x, y, angle, length, width, depth, out) {
  const x2 = x + Math.cos(angle) * length;
  const y2 = y + Math.sin(angle) * length;
  const mx = (x + x2) / 2 + (rand() - 0.5) * length * 0.35;
  const my = (y + y2) / 2 + (rand() - 0.5) * length * 0.35;
  out.strokes += `<path d="M${x.toFixed(1)} ${y.toFixed(1)}Q${mx.toFixed(1)} ${my.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}" stroke-width="${width.toFixed(1)}"/>`;
  out.tips.push([mx, my]);
  if (depth === 0) {
    out.tips.push([x2, y2]);
    return;
  }
  for (let i = 0; i < 2; i += 1) {
    growBranch(rand, x2, y2, angle + (rand() - 0.5) * 1.3, length * (0.58 + rand() * 0.2), Math.max(1, width * 0.6), depth - 1, out);
  }
}

function sceneBody(rand, w, h, index, pal) {
  const s = Math.min(w, h);
  const moonX = w * (index % 2 ? 0.3 : 0.68) + (rand() - 0.5) * w * 0.08;
  const moonY = h * (0.2 + rand() * 0.08);
  const moonR = s * (0.085 + rand() * 0.03);
  let svg = `<rect width="${w}" height="${h}" fill="url(#sky)"/>`;
  // 月亮四周的淡墨晕染
  svg += `<ellipse cx="${moonX}" cy="${moonY}" rx="${s * 0.55}" ry="${s * 0.36}" fill="${pal.wash}" opacity="0.2" filter="url(#soft)"/>`;
  svg += `<circle cx="${moonX}" cy="${moonY}" r="${moonR * 1.7}" fill="${pal.moon}" opacity="0.22" filter="url(#soft)"/>`;
  svg += `<circle cx="${moonX}" cy="${moonY}" r="${moonR}" fill="${pal.moon}"/>`;
  // 由远及近的山脊，底部融进雾气
  const layers = 4;
  const freq = (w / h) * 1.15 + 0.6;
  for (let i = 0; i < layers; i += 1) {
    const baseY = h * (0.56 + i * 0.13);
    const amp = h * (0.24 - i * 0.035);
    const top = 0.2 + i * 0.24;
    svg += `<linearGradient id="l${i}" gradientUnits="userSpaceOnUse" x1="0" y1="${baseY - amp}" x2="0" y2="${baseY + h * 0.1}"><stop offset="0" stop-color="${pal.ink}" stop-opacity="${top.toFixed(2)}"/><stop offset="1" stop-color="${pal.ink}" stop-opacity="${(top * 0.18).toFixed(2)}"/></linearGradient>`;
    svg += `<path d="${ridgePath(rand, w, h, baseY, amp, freq * (0.8 + i * 0.25))}" fill="url(#l${i})"${i < 2 ? ' filter="url(#haze)"' : ''}/>`;
    svg += `<ellipse cx="${w * rand()}" cy="${baseY + h * 0.03}" rx="${w * 0.7}" ry="${h * 0.035}" fill="${pal.mist}" opacity="0.5" filter="url(#soft)"/>`;
  }
  // 飞鸟
  const birdX = w * (index % 2 ? 0.62 : 0.2);
  const birdY = h * 0.3;
  let birds = '';
  for (let i = 0; i < 3; i += 1) {
    const bx = birdX + i * s * 0.05;
    const by = birdY + (i % 2) * s * 0.03 - i * s * 0.008;
    const b = s * 0.014;
    birds += `M${(bx - b).toFixed(1)} ${(by - b * 0.5).toFixed(1)}Q${(bx - b * 0.4).toFixed(1)} ${(by - b * 0.7).toFixed(1)} ${bx.toFixed(1)} ${by.toFixed(1)}Q${(bx + b * 0.4).toFixed(1)} ${(by - b * 0.7).toFixed(1)} ${(bx + b).toFixed(1)} ${(by - b * 0.5).toFixed(1)}`;
  }
  svg += `<path d="${birds}" fill="none" stroke="${pal.ink}" stroke-width="${Math.max(1.2, s * 0.004)}" stroke-linecap="round" opacity="0.75"/>`;
  // 前景花枝（隔张出现）
  if (index % 2 === 0) {
    const fromLeft = index % 4 === 0;
    const out = { strokes: '', tips: [] };
    growBranch(rand, fromLeft ? -s * 0.02 : w + s * 0.02, h * (0.08 + rand() * 0.1), fromLeft ? 0.35 : Math.PI - 0.35, s * 0.3, s * 0.016, 3, out);
    svg += `<g fill="none" stroke="${pal.ink}" stroke-linecap="round" opacity="0.9">${out.strokes}</g>`;
    svg += out.tips
      .filter(() => rand() < 0.75)
      .map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(s * (0.007 + rand() * 0.008)).toFixed(1)}" fill="${pal.bloom}" opacity="0.9"/>`)
      .join('');
  }
  return svg;
}

function seal(w, h) {
  const size = Math.min(w, h) * 0.06;
  const x = w - size * 2;
  const y = h - size * 2;
  return (
    `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${size * 0.14}" fill="#a13f32"/>` +
    `<path d="M${x + size * 0.28} ${y + size * 0.25}V${y + size * 0.75}M${x + size * 0.5} ${y + size * 0.25}V${y + size * 0.75}M${x + size * 0.72} ${y + size * 0.25}V${y + size * 0.75}M${x + size * 0.28} ${y + size * 0.5}H${x + size * 0.72}" stroke="#f7f4ec" stroke-width="${size * 0.07}" fill="none"/>`
  );
}

export function placeholderSvg(category, index, width, height) {
  const rand = mulberry32(category.length * 7919 + index * 104729 + 17);
  const pal = PALETTES[index % PALETTES.length];
  const blur = Math.min(width, height);
  const defs =
    `<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${pal.sky[0]}"/><stop offset="1" stop-color="${pal.sky[1]}"/></linearGradient>` +
    `<filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${blur * 0.035}"/></filter>` +
    `<filter id="haze" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="${blur * 0.0035}"/></filter>`;
  let body;
  if (category === 'avatar') {
    // 头像：纸底 + 圆窗里的山水
    const r = width * 0.4;
    body =
      `<rect width="${width}" height="${height}" fill="#f4efe3"/>` +
      `<clipPath id="win"><circle cx="${width / 2}" cy="${height / 2}" r="${r}"/></clipPath>` +
      `<g clip-path="url(#win)">${sceneBody(rand, width, height, index, pal)}</g>` +
      `<circle cx="${width / 2}" cy="${height / 2}" r="${r}" fill="none" stroke="#23261f" stroke-opacity="0.7" stroke-width="${width * 0.006}"/>`;
  } else {
    body = sceneBody(rand, width, height, index, pal);
  }
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><defs>${defs}</defs>${body}${seal(width, height)}</svg>`,
  );
}

// ---------------------------------------------------------------- 生成
async function exists(file) {
  return fs.access(file).then(() => true, () => false);
}

async function listOriginals(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && SOURCE_EXT.test(entry.name))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

// 缩小（不放大）→ 叠水印 → webp；缩略图由「已带水印」的预览再缩小得到。
async function writePreview(input, spec, outDir, category, number, placeholder) {
  const id = `${category}-${String(number).padStart(2, '0')}`;
  const { data, info } = await sharp(input, { failOn: 'error' })
    .rotate()
    .resize({ width: spec.width, withoutEnlargement: true })
    .flatten({ background: PAPER })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const marked = await sharp(data, { raw: info })
    .composite([{ input: watermarkSvg(info.width, info.height) }])
    .webp({ quality: 80, effort: 5 })
    .toBuffer();
  const thumbWidth = Math.round(info.width / 2);
  await fs.mkdir(path.join(outDir, category, 'sm'), { recursive: true });
  await fs.writeFile(path.join(outDir, category, `${id}.webp`), marked);
  await sharp(marked).resize({ width: thumbWidth }).webp({ quality: 74, effort: 5 }).toFile(path.join(outDir, category, 'sm', `${id}.webp`));
  return {
    id,
    category,
    src: `/previews/${category}/${id}.webp`,
    thumb: `/previews/${category}/sm/${id}.webp`,
    width: info.width,
    height: info.height,
    thumbWidth,
    placeholder,
  };
}

// 社交分享图 1200×630：只用带水印的预览拼成。
async function writeShareImage(outDir, name, images, columns) {
  const columnWidth = Math.round(1200 / columns);
  const tiles = [];
  for (let i = 0; i < columns; i += 1) {
    const image = images[i % images.length];
    const input = await sharp(path.join(outDir, '..', image.src)).resize(columnWidth, 630, { fit: 'cover' }).toBuffer();
    tiles.push({ input, left: i * columnWidth, top: 0 });
  }
  await fs.mkdir(path.join(outDir, 'og'), { recursive: true });
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: PAPER } })
    .composite(tiles)
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(outDir, 'og', `${name}.jpg`));
}

export async function makePreviews({
  originalsDir = process.env.ORIGINALS_DIR ? path.resolve(process.env.ORIGINALS_DIR) : path.join(ROOT, 'originals'),
  outDir = path.join(ROOT, 'public', 'previews'),
  manifestPath = path.join(ROOT, 'src', 'generated', 'previews.json'),
  log = console.log,
} = {}) {
  let previous = [];
  try {
    previous = JSON.parse(await fs.readFile(manifestPath, 'utf8')).images ?? [];
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  const images = [];
  let changed = false;
  for (const [category, spec] of Object.entries(CATEGORIES)) {
    const sources = await listOriginals(path.join(originalsDir, category));
    const kept = previous.filter((image) => image.category === category);
    const keptOnDisk = kept.length > 0 && (await Promise.all(kept.flatMap((image) => [image.src, image.thumb]).map((file) => exists(path.join(outDir, '..', file))))).every(Boolean);

    if (sources.length === 0 && keptOnDisk) {
      images.push(...kept);
      log(`[previews] ${category}: 没有原图，保留已有的 ${kept.length} 张${kept[0].placeholder ? '占位' : ''}预览`);
      continue;
    }

    changed = true;
    await fs.rm(path.join(outDir, category), { recursive: true, force: true });
    if (sources.length > 0) {
      for (const [index, name] of sources.entries()) {
        images.push(await writePreview(path.join(originalsDir, category, name), spec, outDir, category, index + 1, false));
      }
      log(`[previews] ${category}: 由 ${sources.length} 张原图生成水印预览`);
    } else {
      const { width, height, count } = spec.placeholder;
      for (let index = 0; index < count; index += 1) {
        images.push(await writePreview(placeholderSvg(category, index, width, height), spec, outDir, category, index + 1, true));
      }
      log(`[previews] ${category}: 没有原图，生成 ${count} 张示意占位图`);
    }
  }

  const shareImages = { phone: 3, desktop: 1, avatar: 2 };
  const shareMissing = !(await Promise.all(Object.keys(shareImages).map((name) => exists(path.join(outDir, 'og', `${name}.jpg`))))).every(Boolean);
  if (changed || shareMissing) {
    for (const [category, columns] of Object.entries(shareImages)) {
      await writeShareImage(outDir, category, images.filter((image) => image.category === category), columns);
    }
  }

  const manifest = { note: '由 scripts/make-previews.mjs 自动生成，请勿手改。', images };
  await fs.mkdir(path.dirname(manifestPath), { recursive: true });
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  return manifest;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await makePreviews();
}
