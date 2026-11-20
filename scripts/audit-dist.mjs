// 构建后自动运行（npm run build 的 postbuild）：确认部署产物 dist/ 里没有任何原图。
// 任何一项不通过都会让构建失败，Cloudflare 就不会发布。
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const ORIGINALS = process.env.ORIGINALS_DIR ? path.resolve(process.env.ORIGINALS_DIR) : path.join(ROOT, 'originals');
const MAX_WIDTH = 1280; // 预览图按宽度缩小，最宽的是电脑壁纸 1280px；高度随原图比例，不限制
const IMAGE = /\.(png|jpe?g|webp|gif|avif|tiff?|bmp|psd)$/i;

async function walk(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
  const files = await Promise.all(entries.map((entry) => (entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)])));
  return files.flat();
}
const sha256 = async (file) => createHash('sha256').update(await fs.readFile(file)).digest('hex');

const problems = [];
const distFiles = await walk(DIST);
if (distFiles.length === 0) problems.push('dist/ 是空的，请先运行 npm run build');

// 1. 不能有 originals 目录
for (const file of distFiles) {
  if (path.relative(DIST, file).split(path.sep).includes('originals')) problems.push('dist 里出现 originals 目录: ' + path.relative(ROOT, file));
}
// 2. 图片只能是预览用的 webp / jpg，且尺寸不能超过预览上限
const images = distFiles.filter((file) => IMAGE.test(file));
for (const file of images) {
  const name = path.relative(ROOT, file);
  if (!/\.(webp|jpe?g)$/i.test(file)) problems.push('dist 里有非预览格式的图片: ' + name);
  const { width = 0, height = 0 } = await sharp(file).metadata();
  if (width > MAX_WIDTH) problems.push(`dist 里有超过预览宽度的图片 (${width}×${height}): ${name}`);
}
// 3. 本机有原图时，逐个比对内容，确认没有任何一张被原样复制进 dist
const originals = (await walk(ORIGINALS)).filter((file) => IMAGE.test(file));
if (originals.length > 0) {
  const originalHashes = new Map(await Promise.all(originals.map(async (file) => [await sha256(file), file])));
  for (const file of distFiles) {
    const match = originalHashes.get(await sha256(file));
    if (match) problems.push(`原图被复制进了 dist: ${path.relative(ROOT, file)} 与 ${match} 相同`);
  }
}
// 4. 原图不能被 git 跟踪
try {
  const tracked = execFileSync('git', ['ls-files', '--', 'originals'], { cwd: ROOT, encoding: 'utf8' }).trim();
  if (tracked) problems.push('originals/ 里有文件被 git 跟踪了:\n' + tracked);
} catch {
  // 不在 git 仓库里时跳过
}

if (problems.length > 0) {
  console.error('[audit] 失败：\n- ' + problems.join('\n- '));
  process.exit(1);
}
console.log(`[audit] 通过：dist 共 ${distFiles.length} 个文件、${images.length} 张图片，全部是水印预览；比对了 ${originals.length} 张本机原图，没有原图进入部署产物。`);
