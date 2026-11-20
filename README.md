# Moonlit Ink 月下墨

原创和风水墨壁纸与头像的展示站。纯静态（Astro 7 + Tailwind CSS 4 + TypeScript），零后端、无数据库、无登录。
付款和文件交付全部在 Gumroad 完成，站内的购买按钮只是跳转链接。

---

## 需要我本人完成

下面这些事只有你能做，仓库里**没有**替你做，也没有假装做过。链接、邮箱、域名目前全是占位符。

- [ ] **1. GitHub 仓库**：代码在 `a13317318197-crypto/devin` 的一个 PR 里。检查后合并到 `main`（想换仓库名可以在 GitHub 的 Settings 里改）。
- [ ] **2. 注册并连接 Cloudflare Pages**：注册 Cloudflare 账号 → Workers & Pages → Create → Pages → Connect to Git → 选这个仓库，按下面「部署到 Cloudflare Pages」一节填写。
- [ ] **3. 购买并绑定域名**：买好域名后，在 Pages 项目的 Custom domains 里绑定。然后把域名填进 `src/content/site.ts` 的 `site.url`（或设置环境变量 `PUBLIC_SITE_URL`）。不填的话 canonical、sitemap、分享图地址都会指向占位域名 `moonlit-ink.example`。
- [ ] **4. 填真实的 Gumroad 链接**：在 Gumroad 建好 4 个付费商品和 1 个免费商品，把 `src/content/site.ts` 里 5 处 `https://YOUR-NAME.gumroad.com/l/...` 换成真实链接。
- [ ] **5. 填真实的联系邮箱**：`src/content/site.ts` 的 `site.email`（现在是 `hello@example.com`）。
- [ ] **6. 核对价格、张数、分辨率、格式**：`src/content/site.ts` 的 `products`。现在的价格（$9 / $12 / $6 / $19）和分辨率是我先填的占位值，要改成和 Gumroad 上、和你实际交付的文件一致。
- [ ] **7. 放原图并生成预览**：把原图放进 `originals/phone`、`originals/desktop`、`originals/avatar`，运行 `npm run previews`，然后把 `public/previews/` 和 `src/generated/previews.json` 提交并推送（详见「水印预览图」）。在这之前，站上显示的是脚本画的示意占位图，并且页面上会明确写着「示意占位图」。
- [ ] **8. 核对文案和条款**：授权、隐私、条款、退款页是模板，页面末尾写着「模板，上线前请自行核对适用法律」。免费样图页和 FAQ 里对 Gumroad 流程的描述（例如下载方式）也请对照你实际的商品设置看一遍。
- [ ] **9.（可选）社媒链接与统计**：`site.social` 里填了网址才会显示；Cloudflare Web Analytics 见下文。

---

## 以后只改一个文件

所有文案（中英文）、价格、Gumroad 链接、邮箱、社媒链接、FAQ、条款都在 **`src/content/site.ts`**，文件顶部有中文说明。
改完 `git push`，Cloudflare Pages 会自动重新构建发布。

## 本地运行

需要 Node.js 22.23.4 以上（Astro 7 的要求；仓库里的 `.node-version` 指定了 22）。

```bash
npm install
npm run dev          # 本地预览 http://localhost:4321
npm run build        # 生成 dist/（会先自动跑 npm run previews，构建后自动审计产物）
npm run preview      # 本地查看 dist/
npm run check        # TypeScript / Astro 类型检查
npm run check:links  # 检查站内链接、图片、hreflang、外链 rel（需先 build）
npm test             # 水印预览脚本的测试
```

## 部署到 Cloudflare Pages

在 Cloudflare 连接 GitHub 仓库时这样填：

| 项目 | 值 |
| --- | --- |
| Framework preset | Astro |
| Production branch | `main` |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| Root directory | 留空 |

环境变量（Settings → Environment variables，都不是密钥，都可以不填；模板见 `.env.example`）：

| 变量 | 示例 | 说明 |
| --- | --- | --- |
| `PUBLIC_SITE_URL` | `https://YOUR-DOMAIN.example` | 正式域名，结尾不带斜杠。不填则用 `site.ts` 里的 `site.url` |
| `PUBLIC_CF_ANALYTICS_TOKEN` | `YOUR_TOKEN` | Cloudflare Web Analytics 的 token。**不填就不输出任何统计脚本** |
| `NODE_VERSION` | `22` | 一般不用填，仓库里的 `.node-version` 已指定 |

之后每次推送到 `main` 都会自动构建发布。`public/_headers` 里是给 Cloudflare Pages 的安全响应头和缓存设置。

> 这个仓库没有部署过。上面的步骤是按 Cloudflare Pages 的常规流程写的，实际连接、构建是否成功要你在 Cloudflare 后台确认。

## 水印预览图

```
originals/            ← 你的原图。已写入 .gitignore，不提交、不部署
  phone/*.png         → public/previews/phone/phone-01.webp …    宽 720px
  desktop/*.png       → public/previews/desktop/desktop-01.webp … 宽 1280px
  avatar/*.png        → public/previews/avatar/avatar-01.webp …   宽 640px
```

```bash
npm run previews                                   # 读取 ./originals
ORIGINALS_DIR=/path/outside/repo npm run previews  # 原图放在仓库外时
```

`scripts/make-previews.mjs`（sharp）做的事：

- 把每张原图缩小到上面的宽度（比它小的图不放大），转成 webp；
- 整张图斜向平铺「MOONLIT INK · PREVIEW」水印，透明度 35%。水印铺满全图，裁掉任何一边都还在；
- 输出文件按 `phone-01.webp` 这样重新编号，不沿用原图文件名，并去掉原图的元数据；
- 另外生成缩略图（`sm/`）和分享图（`og/`），它们都是从**已加水印**的预览再缩小的；
- 把清单写进 `src/generated/previews.json`，页面按清单显示图片。

**更新预览的流程**：换原图 → `npm run previews` → 提交 `public/previews/` 和 `src/generated/previews.json` → 推送。

Cloudflare 上没有你的原图，所以线上显示的就是仓库里提交的这些预览。`npm run build` 每次都会先跑 `npm run previews`：

| 情况 | 行为 |
| --- | --- |
| `originals/` 里有图 | 重新生成该分类的预览 |
| `originals/` 为空，但已有预览（例如 Cloudflare 构建时） | 保留已有预览，不覆盖 |
| `originals/` 为空，也没有预览 | 生成脚本自绘的示意占位图，站点照常能构建、能看 |

### 原图不会进入部署产物

- `originals/` 在 `.gitignore` 里，不会被提交，Cloudflare 也就拿不到；
- Astro 只会把 `public/` 和 `src/` 里用到的东西放进 `dist/`，`originals/` 不在其中；
- 每次 `npm run build` 结束后自动运行 `scripts/audit-dist.mjs`：`dist/` 里出现 `originals` 目录、PNG 等非预览格式、长边超过 1280px 的图片、与本机任一原图内容相同的文件，或 `originals/` 被 git 跟踪，**构建直接失败**，不会发布。

注意：水印预览是低分辨率、带水印的，但毕竟是公开图片；水印能拦住随手保存，拦不住有心人用工具去除。

## 隐私与第三方

- 本站不设置任何 cookie，所以没有 cookie 横幅。
- 语言偏好：访客在页眉手动切换语言时，会在浏览器的 `localStorage` 里记一个 `lang` 值（`en` 或 `zh`），只用来让根路径 `/` 下次跳到对应语言。它不是 cookie，不会发送给任何服务器。
- 没有表单、没有登录、没有数据库，不收集邮箱。付款信息只在 Gumroad。
- 唯一可选的第三方脚本是 Cloudflare Web Analytics（不使用 cookie），只有设置了 `PUBLIC_CF_ANALYTICS_TOKEN` 才会输出。如果你改用 Cloudflare 后台的「自动注入」方式开启统计，就不要再设这个变量，否则会统计两次。
- 字体用系统字体，不加载远程字体。
- 所有外链（Gumroad、社媒）都是 `target="_blank" rel="noopener noreferrer"`。

## 页面与结构

```
/                         按浏览器语言跳转到 /en/ 或 /zh/
/{en,zh}/                 首页
/{en,zh}/gallery/         作品画廊（筛选 + 灯箱）
/{en,zh}/products/{phone-wallpaper-pack,desktop-wallpaper-pack,avatar-pack,complete-bundle}/
/{en,zh}/free-sample/     免费样图
/{en,zh}/{license,ai-disclosure,privacy,terms,refunds}/
/{en,zh}/{about,contact}/
/404.html  /sitemap.xml  /robots.txt
```

```
src/content/site.ts       ← 全站内容，只改这里
src/lib/site.ts           页面共用的小工具
src/layouts/Base.astro    <head>（SEO、hreflang、分享图）、页眉、页脚
src/components/           商品卡、轮播、灯箱、购买按钮等
src/pages/                各页面
src/generated/            预览清单（脚本生成，需要提交）
public/previews/          水印预览图（脚本生成，需要提交）
scripts/make-previews.mjs 生成水印预览
scripts/audit-dist.mjs    构建后审计：产物里不能有原图
scripts/check-links.mjs   链接与基础 SEO 检查
.github/workflows/ci.yml  每次推送自动跑：测试、类型检查、构建、审计、链接检查
```

商品 `slug` 决定网址（`/products/<slug>/`），上线后尽量不要改。
