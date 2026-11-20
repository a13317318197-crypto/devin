// npm test：验证水印预览脚本的关键保证。
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import sharp from 'sharp';
import { makePreviews } from './make-previews.mjs';

async function workspace() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'moonlit-previews-'));
  return {
    root,
    originalsDir: path.join(root, 'originals'),
    outDir: path.join(root, 'public', 'previews'),
    manifestPath: path.join(root, 'generated', 'previews.json'),
    log: () => {},
  };
}
const flatPng = (width, height, color) => sharp({ create: { width, height, channels: 3, background: color } }).png().toBuffer();

async function addOriginal(dirs, category, name, width, height, color = '#808080') {
  await fs.mkdir(path.join(dirs.originalsDir, category), { recursive: true });
  await fs.writeFile(path.join(dirs.originalsDir, category, name), await flatPng(width, height, color));
}

// 把图切成 grid×grid 格，返回每格里「偏离纯色背景」的像素占比
async function watermarkCoverage(file, grid = 4) {
  const { data, info } = await sharp(file).greyscale().raw().toBuffer({ resolveWithObject: true });
  const cells = Array.from({ length: grid * grid }, () => ({ marked: 0, total: 0 }));
  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      const cell = cells[Math.min(grid - 1, Math.floor((y / info.height) * grid)) * grid + Math.min(grid - 1, Math.floor((x / info.width) * grid))];
      cell.total += 1;
      if (Math.abs(data[y * info.width + x] - 128) > 12) cell.marked += 1;
    }
  }
  return cells.map((cell) => cell.marked / cell.total);
}

test('没有原图时生成占位预览，尺寸符合规格', async () => {
  const dirs = await workspace();
  const { images } = await makePreviews(dirs);
  const sizes = { phone: [720, 1280], desktop: [1280, 720], avatar: [640, 640] };
  for (const [category, [width, height]] of Object.entries(sizes)) {
    const list = images.filter((image) => image.category === category);
    assert.ok(list.length >= 3, category + ' 至少 3 张占位图');
    for (const image of list) {
      assert.equal(image.placeholder, true);
      const meta = await sharp(path.join(dirs.outDir, '..', image.src)).metadata();
      assert.deepEqual([meta.format, meta.width, meta.height], ['webp', width, height]);
    }
  }
  for (const name of ['phone', 'desktop', 'avatar']) {
    const meta = await sharp(path.join(dirs.outDir, 'og', name + '.jpg')).metadata();
    assert.deepEqual([meta.width, meta.height], [1200, 630]);
  }
});

test('真实原图：按规定宽度缩小为 webp，水印铺满每个区域', async () => {
  const dirs = await workspace();
  await addOriginal(dirs, 'phone', 'a.png', 1440, 2560);
  await addOriginal(dirs, 'desktop', 'a.png', 3840, 2160);
  await addOriginal(dirs, 'avatar', 'a.png', 2048, 2048);
  const { images } = await makePreviews(dirs);
  const expected = { phone: [720, 1280], desktop: [1280, 720], avatar: [640, 640] };
  for (const [category, [width, height]] of Object.entries(expected)) {
    const [image, ...rest] = images.filter((item) => item.category === category);
    assert.equal(rest.length, 0);
    assert.equal(image.placeholder, false);
    const file = path.join(dirs.outDir, '..', image.src);
    const meta = await sharp(file).metadata();
    assert.deepEqual([meta.format, meta.width, meta.height], ['webp', width, height]);
    // 4×4 共 16 格，每一格都必须有水印：裁掉任何一边、只留任何一角都去不掉
    for (const share of await watermarkCoverage(file)) assert.ok(share > 0.02, `${category} 有区域没有水印 (${share})`);
    // 缩略图由带水印的预览缩小而来，同样带水印
    const thumb = path.join(dirs.outDir, '..', image.thumb);
    assert.equal((await sharp(thumb).metadata()).width, width / 2);
    for (const share of await watermarkCoverage(thumb)) assert.ok(share > 0.01, category + ' 缩略图有区域没有水印');
  }
});

test('输出目录里没有原图，文件名也不沿用原图名', async () => {
  const dirs = await workspace();
  await addOriginal(dirs, 'phone', 'my secret prompt.png', 1440, 2560);
  await makePreviews(dirs);
  const files = await fs.readdir(dirs.outDir, { recursive: true });
  assert.ok(files.every((file) => !/\.png$/i.test(file) && !/secret/.test(file)), files.join(', '));
});

test('小图不会被放大', async () => {
  const dirs = await workspace();
  await addOriginal(dirs, 'avatar', 'small.png', 400, 400);
  const { images } = await makePreviews(dirs);
  const avatar = images.find((image) => image.category === 'avatar');
  assert.deepEqual([avatar.width, avatar.height], [400, 400]);
});

test('原图不在时（例如 Cloudflare 构建）保留已提交的真实预览，不会被占位图覆盖', async () => {
  const dirs = await workspace();
  await addOriginal(dirs, 'phone', 'a.png', 1440, 2560, '#336699');
  const first = await makePreviews(dirs);
  const file = path.join(dirs.outDir, 'phone', 'phone-01.webp');
  const before = await fs.readFile(file);
  await fs.rm(dirs.originalsDir, { recursive: true });
  const second = await makePreviews(dirs);
  assert.deepEqual(second.images, first.images);
  assert.ok(before.equals(await fs.readFile(file)));
  assert.equal(second.images.find((image) => image.category === 'phone').placeholder, false);
});

test('原图换了之后，旧预览会被清掉', async () => {
  const dirs = await workspace();
  await addOriginal(dirs, 'desktop', 'a.png', 1920, 1080);
  await addOriginal(dirs, 'desktop', 'b.png', 1920, 1080);
  await makePreviews(dirs);
  await fs.rm(path.join(dirs.originalsDir, 'desktop', 'b.png'));
  const { images } = await makePreviews(dirs);
  assert.equal(images.filter((image) => image.category === 'desktop').length, 1);
  assert.deepEqual((await fs.readdir(path.join(dirs.outDir, 'desktop'))).sort(), ['desktop-01.webp', 'sm']);
});
