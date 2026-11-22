/* ============================================================================
 *  月下墨 Moonlit Ink —— 全站内容都在这一个文件里，以后只改这里
 * ============================================================================
 *
 *  改完保存 → git commit → git push，Cloudflare Pages 会自动重新构建上线。
 *
 *  怎么改：
 *    · 每段文字都是一对：{ en: '英文', zh: '中文' }，两种语言请一起改。
 *    · 只改引号里面的字，不要动引号外的英文名字、逗号和括号。
 *    · 文字里要用单引号时写成 \'（例如 'Don\'t'）。
 *    · {n}、{count}、{price} 这类花括号是自动填入的数字，请原样保留。
 *
 *  目录（搜索「【数字】」可以直接跳过去）：
 *    【1】基本信息 —— 品牌名、域名、联系邮箱、社媒链接、货币
 *    【2】商品     —— 价格、Gumroad 链接、张数、分辨率、名称与介绍
 *    【3】免费样图 —— Gumroad 免费商品链接
 *    【4】通用文字 —— 导航、按钮、小标签、图片说明文字
 *    【5】首页     —— 一句话价值主张、各区块标题、FAQ
 *    【6】商品详情页、画廊页、免费样图页
 *    【7】关于、联系、404
 *    【8】条款类页面 —— 授权说明、AI 披露、隐私政策、使用条款、退款说明
 *
 *  上线前必须替换的占位内容（搜索「占位」能全部找到）：
 *    · site.url             正式域名
 *    · site.email           联系邮箱
 *    · 每个商品的 price     价格
 *    · 每个商品的 gumroadUrl 以及 sample.gumroadUrl
 *    · 每个商品的 resolution 你实际交付文件的分辨率
 *
 *  注意：文案里不要出现任何动漫、影视、游戏的角色名或商标名。
 *  图片不在这里改：原图放进 originals/，运行 npm run previews（见 README）。
 * ========================================================================== */

/** 一段双语文字 */
export type Text = { en: string; zh: string };
export type PreviewCategory = 'phone' | 'desktop' | 'avatar';

/* ----------------------------------------------------------------------------
 * 【1】基本信息
 * -------------------------------------------------------------------------- */
export const site = {
  brand: { en: 'Moonlit Ink', zh: '月下墨' },
  // 占位：正式域名，以 https:// 开头，结尾不要带斜杠。
  // （也可以不改这里，在 Cloudflare Pages 里设置环境变量 PUBLIC_SITE_URL。）
  url: 'https://moonlit-ink.example',
  // 占位：联系邮箱。
  email: 'hello@example.com',
  // 价格的货币。currency 用于搜索引擎的结构化数据，currencySymbol 显示在页面上。
  currency: 'USD',
  currencySymbol: '$',
  // 社媒链接：把网址填进 url 就会显示在页脚；留空 '' 就不显示。
  social: [
    { label: 'Instagram', url: '' },
    { label: 'Pinterest', url: '' },
    { label: 'X', url: '' },
  ],
};

/* ----------------------------------------------------------------------------
 * 【2】商品（四个）
 *   slug        网址的一段，例如 /en/products/phone-wallpaper-pack/ ——上线后不要再改
 *   previews    这个商品展示哪些分类的预览图
 *   price       占位：价格（数字，不带货币符号）
 *   gumroadUrl  占位：Gumroad 商品链接
 *   count       张数
 *   ratio       画幅比例
 *   resolution  占位：实际交付文件的分辨率，请改成你的真实数值
 *   format      交付文件格式
 * -------------------------------------------------------------------------- */
export const products = [
  {
    slug: 'phone-wallpaper-pack',
    previews: ['phone'] as PreviewCategory[],
    price: 3,
    gumroadUrl: 'https://YOUR-NAME.gumroad.com/l/phone-wallpaper-pack',
    count: 20,
    ratio: '9:16',
    resolution: '1440 × 2560 px',
    format: 'PNG',
    name: { en: 'Phone Wallpaper Pack', zh: '手机壁纸包' },
    tagline: {
      en: 'Twenty quiet ink-wash scenes for your lock screen and home screen.',
      zh: '二十张安静的水墨画面，放在锁屏和主屏上。',
    },
    description: {
      en: 'Twenty original ink-wash wallpapers in portrait 9:16: misty ridges, pale moons and plenty of empty space, so your icons and clock stay easy to read.',
      zh: '二十张原创和风水墨竖版壁纸（9:16）：远山、薄雾、淡月，留白充足，图标和时间依然清晰好认。',
    },
  },
  {
    slug: 'desktop-wallpaper-pack',
    previews: ['desktop'] as PreviewCategory[],
    price: 5,
    gumroadUrl: 'https://YOUR-NAME.gumroad.com/l/desktop-wallpaper-pack',
    count: 12,
    ratio: '16:9',
    resolution: '3840 × 2160 px',
    format: 'PNG',
    name: { en: 'Desktop Wallpaper Pack', zh: '电脑壁纸包' },
    tagline: {
      en: 'Twelve wide ink-wash landscapes for a calmer desk.',
      zh: '十二张开阔的水墨山水，让桌面安静下来。',
    },
    description: {
      en: 'Twelve original ink-wash wallpapers in widescreen 16:9. Long horizons and soft mist that sit quietly behind your windows.',
      zh: '十二张原创和风水墨横版壁纸（16:9）。平远的山线与柔和的雾气，安静地待在窗口后面。',
    },
  },
  {
    slug: 'avatar-pack',
    previews: ['avatar'] as PreviewCategory[],
    price: 3,
    gumroadUrl: 'https://YOUR-NAME.gumroad.com/l/avatar-pack',
    count: 12,
    ratio: '1:1',
    resolution: '2048 × 2048 px',
    format: 'PNG',
    name: { en: 'Avatar Pack', zh: '头像包' },
    tagline: {
      en: 'Twelve square ink-wash images for your social profiles.',
      zh: '十二张方形水墨小图，用作社交头像。',
    },
    description: {
      en: 'Twelve original square ink-wash images (1:1), composed to stay readable when cropped to a small circle.',
      zh: '十二张原创和风水墨方图（1:1），构图居中，裁成小圆形头像也看得清。',
    },
  },
  {
    slug: 'complete-bundle',
    previews: ['phone', 'desktop', 'avatar'] as PreviewCategory[],
    price: 9,
    gumroadUrl: 'https://YOUR-NAME.gumroad.com/l/complete-bundle',
    count: 44,
    ratio: '9:16 · 16:9 · 1:1',
    // 合集的分辨率不用填，页面会自动列出上面三个包各自的数值。
    resolution: '',
    format: 'PNG',
    name: { en: 'Complete Bundle', zh: '完整合集' },
    tagline: {
      en: 'All three packs together: 44 images for phone, desktop and profile.',
      zh: '三个包一次收齐：手机、电脑、头像共 44 张。',
    },
    description: {
      en: 'Everything in the collection: the Phone Wallpaper Pack, the Desktop Wallpaper Pack and the Avatar Pack, 44 original ink-wash images in one download.',
      zh: '全部作品：手机壁纸包、电脑壁纸包和头像包，共 44 张原创和风水墨图，一次下载。',
    },
  },
];

/* ----------------------------------------------------------------------------
 * 【3】免费样图
 * -------------------------------------------------------------------------- */
export const sample = {
  // 占位：Gumroad 上价格为 0 的免费商品链接。
  gumroadUrl: 'https://YOUR-NAME.gumroad.com/l/free-sample',
  count: 3,
  name: { en: 'Free Sample', zh: '免费样图' },
};

/* ----------------------------------------------------------------------------
 * 【4】通用文字（导航、按钮、小标签）
 * -------------------------------------------------------------------------- */
export const ui = {
  nav: {
    label: { en: 'Main', zh: '主导航' },
    packs: { en: 'Packs', zh: '素材包' },
    gallery: { en: 'Gallery', zh: '画廊' },
    sample: { en: 'Free sample', zh: '免费样图' },
    about: { en: 'About', zh: '关于' },
  },
  // 页眉的语言切换：显示的是「另一种语言」的名字
  switchLanguage: { en: '中文', zh: 'English' },
  switchLanguageLabel: { en: '切换到中文', zh: 'Switch to English' },
  skipToContent: { en: 'Skip to content', zh: '跳到正文' },
  home: { en: 'Home', zh: '首页' },

  buy: { en: 'Buy on Gumroad', zh: '前往 Gumroad 购买' },
  buyNote: {
    en: 'Payment and download are handled by Gumroad. Opens in a new tab.',
    zh: '付款与下载都在 Gumroad 完成，将在新标签页打开。',
  },
  newTab: { en: '(opens in a new tab)', zh: '（在新标签页打开）' },
  details: { en: 'View details', zh: '查看详情' },
  free: { en: 'Free', zh: '免费' },

  // {count} 会换成张数
  imagesCount: { en: '{count} images', zh: '{count} 张' },
  labelImages: { en: 'Images', zh: '张数' },
  labelRatio: { en: 'Ratio', zh: '比例' },
  labelResolution: { en: 'Resolution', zh: '分辨率' },
  labelFormat: { en: 'Format', zh: '格式' },
  labelPrice: { en: 'Price', zh: '价格' },

  // 图片的替代文字（给读屏软件和搜索引擎），{n} 会换成序号
  alt: {
    phone: { en: 'Ink-wash phone wallpaper, watermarked preview {n}', zh: '水墨手机壁纸，水印预览图 {n}' },
    desktop: { en: 'Ink-wash desktop wallpaper, watermarked preview {n}', zh: '水墨电脑壁纸，水印预览图 {n}' },
    avatar: { en: 'Ink-wash avatar, watermarked preview {n}', zh: '水墨头像，水印预览图 {n}' },
  },
  categories: {
    all: { en: 'All', zh: '全部' },
    phone: { en: 'Phone', zh: '手机' },
    desktop: { en: 'Desktop', zh: '电脑' },
    avatar: { en: 'Avatar', zh: '头像' },
  },

  carousel: {
    label: { en: 'Preview images', zh: '预览图' },
    previous: { en: 'Previous image', zh: '上一张' },
    next: { en: 'Next image', zh: '下一张' },
  },
  lightbox: {
    label: { en: 'Image preview', zh: '图片预览' },
    open: { en: 'Enlarge', zh: '放大查看' },
    close: { en: 'Close', zh: '关闭' },
    previous: { en: 'Previous image', zh: '上一张' },
    next: { en: 'Next image', zh: '下一张' },
    partOf: { en: 'Included in', zh: '收录于' },
  },

  // 还没放真实原图时，自动显示的提示（放入原图并生成预览后会自动消失）
  placeholderNotice: {
    en: 'The images shown here are illustrative placeholders. The real artwork previews are coming soon.',
    zh: '当前展示的是示意占位图，真实作品预览即将上线。',
  },
  watermarkNotice: {
    en: 'Previews are low-resolution and watermarked. Purchased files are full resolution with no watermark.',
    zh: '预览图为低分辨率并带有水印，购买后的文件为完整分辨率、无水印。',
  },

  // AI 披露小字：出现在每一页页脚（含首页底部）和每个商品页的购买按钮旁
  aiLine: {
    en: 'Created with the help of AI image tools and edited by a human.',
    zh: '由 AI 工具辅助生成，并经人工筛选与修图。',
  },
  aiLineLink: { en: 'AI disclosure', zh: 'AI 披露' },

  footer: {
    tagline: {
      en: 'Original ink-wash wallpapers and avatars.',
      zh: '原创和风水墨壁纸与头像。',
    },
    shop: { en: 'Shop', zh: '商品' },
    info: { en: 'Information', zh: '说明' },
    follow: { en: 'Follow', zh: '关注' },
    contact: { en: 'Contact', zh: '联系' },
    rights: { en: 'All rights reserved.', zh: '保留所有权利。' },
  },

  // 条款类页面末尾的一行
  templateNote: {
    en: 'Template: please check the laws that apply to you before going live.',
    zh: '模板，上线前请自行核对适用法律。',
  },
};

/* ----------------------------------------------------------------------------
 * 【5】首页
 * -------------------------------------------------------------------------- */
export const home = {
  // 浏览器标签页标题与搜索结果摘要
  title: {
    en: 'Moonlit Ink: original ink-wash wallpapers and avatars',
    zh: '月下墨 Moonlit Ink：原创和风水墨壁纸与头像',
  },
  description: {
    en: 'Original Japanese-inspired ink-wash wallpapers for phone and desktop, plus matching avatars. Instant download through Gumroad.',
    zh: '原创和风水墨手机壁纸、电脑壁纸与头像素材包，通过 Gumroad 购买后即时下载。',
  },

  hero: {
    eyebrow: { en: 'Wallpapers & avatars · Collection 01', zh: '壁纸与头像 · 第一辑' },
    // 一句话价值主张
    headline: {
      en: 'Quiet ink-wash wallpapers for the screens you look at every day.',
      zh: '把一方水墨，放进每天都会看的屏幕。',
    },
    lead: {
      en: 'Misty ridges, pale moons and room to breathe. Original Japanese-inspired ink-wash art, sized for your phone, your desktop and your profile picture.',
      zh: '远山、薄雾、淡月与留白。原创和风水墨图，按手机、电脑和头像的尺寸分别做好。',
    },
    primary: { en: 'See the packs', zh: '看看素材包' },
    secondary: { en: 'Get 3 free samples', zh: '领取 3 张免费样图' },
  },

  // 首屏下方的四条简短说明（标题 + 一句话）
  assurancesLabel: { en: 'How buying works', zh: '购买须知' },
  assurances: [
    {
      title: { en: 'Instant download', zh: '即时下载' },
      body: { en: 'Files are yours right after checkout.', zh: '付款后马上拿到文件。' },
    },
    {
      title: { en: 'Pay once', zh: '一次付清' },
      body: { en: 'No subscription, no account on this site.', zh: '没有订阅，本站无需注册。' },
    },
    {
      title: { en: 'Checkout on Gumroad', zh: '在 Gumroad 结账' },
      body: { en: 'This site never sees your payment details.', zh: '本站不接触任何付款信息。' },
    },
    {
      title: { en: 'Personal licence', zh: '个人授权' },
      body: { en: 'For your own screens and profiles.', zh: '用于自己的屏幕与头像。' },
    },
  ],

  packs: {
    eyebrow: { en: '01 · Packs', zh: '壹 · 素材包' },
    heading: { en: 'Four ways to take it home', zh: '四种带走的方式' },
    lead: {
      en: 'One-time purchase, instant download. No subscription.',
      zh: '一次购买，即时下载，没有订阅。',
    },
    bundleBadge: { en: 'Best value', zh: '最划算' },
  },

  sample: {
    eyebrow: { en: '02 · Free sample', zh: '贰 · 免费样图' },
    heading: { en: 'Try three images first', zh: '先试三张' },
    body: {
      en: 'Three images from the collection, free on Gumroad. See how they look on your own screen before you buy.',
      zh: '从作品里挑出的三张图，在 Gumroad 免费领取。先在自己的屏幕上看看效果，再决定买不买。',
    },
    cta: { en: 'Get the free sample', zh: '领取免费样图' },
  },

  gallery: {
    eyebrow: { en: '03 · Gallery', zh: '叁 · 画廊' },
    heading: { en: 'A few from the collection', zh: '作品精选' },
    cta: { en: 'Open the full gallery', zh: '进入完整画廊' },
  },

  ai: {
    eyebrow: { en: '04 · How it is made', zh: '肆 · 制作方式' },
    heading: { en: 'Made with AI tools, finished by hand', zh: 'AI 辅助生成，人工筛选修图' },
    body: {
      en: 'These images are generated with Midjourney from prompts I write. I pick the few that work, then retouch them by hand. They are not hand-painted, and I will never claim they are.',
      zh: '这些图由我撰写提示词、用 Midjourney 生成，再从中挑出满意的少数，逐张人工修图。它们不是手绘作品，我也不会这样宣称。',
    },
    cta: { en: 'Read the AI disclosure', zh: '阅读 AI 披露说明' },
  },

  faq: {
    eyebrow: { en: '05 · FAQ', zh: '伍 · 常见问题' },
    heading: { en: 'Questions, answered', zh: '常见问题' },
    items: [
      {
        q: { en: 'How do I get the files after paying?', zh: '付款后怎么拿到文件？' },
        a: {
          en: 'Checkout and delivery both happen on Gumroad. Right after payment you get a download page, and Gumroad emails you a link you can use again later.',
          zh: '付款和交付都在 Gumroad 完成。付款后会立刻看到下载页面，Gumroad 还会把下载链接发到你的邮箱，之后可以重复下载。',
        },
      },
      {
        q: { en: 'Do the files I buy have a watermark?', zh: '买到的文件有水印吗？' },
        a: {
          en: 'No. Only the previews on this site are watermarked and low-resolution. The files you download are full resolution with no watermark.',
          zh: '没有。只有本站的预览图带水印并降低了分辨率，下载到的文件是完整分辨率、无水印的。',
        },
      },
      {
        q: { en: 'What am I allowed to do with them?', zh: '我可以怎么使用？' },
        a: {
          en: 'Personal use: wallpapers on your own phone and computer, and your own social avatars. Reselling, redistributing, uploading to other wallpaper or stock sites, and AI training are not allowed. See the License page.',
          zh: '个人使用：自己的手机、电脑壁纸和自己的社交头像。不可以转售、再分发、上传到其他素材或壁纸平台，也不可以用于训练 AI。详见授权说明。',
        },
      },
      {
        q: { en: 'Can I use them commercially?', zh: '可以商用吗？' },
        a: {
          en: 'Not with the personal license. If you need commercial use, email me and tell me what you have in mind.',
          zh: '个人版不包含商用。如果需要商用，请发邮件告诉我你的用途。',
        },
      },
      {
        q: { en: 'Are these hand-painted?', zh: '这些是手绘的吗？' },
        a: {
          en: 'No. They are created with the help of AI image tools (Midjourney), then selected and retouched by me.',
          zh: '不是。它们由 AI 工具（Midjourney）辅助生成，再由我筛选并修图。',
        },
      },
      {
        q: { en: 'Can I get a refund?', zh: '可以退款吗？' },
        a: {
          en: 'Digital goods are generally non-refundable once delivered. If a file is damaged or a download fails, email me and I will send it again.',
          zh: '数字商品交付后一般不退款。如果文件损坏或下载失败，发邮件给我，我会重新发给你。',
        },
      },
    ],
  },
};

/* ----------------------------------------------------------------------------
 * 【6】商品详情页、画廊页、免费样图页
 * -------------------------------------------------------------------------- */
export const productPage = {
  // 浏览器标题，{name} 会换成商品名
  titleSuffix: { en: '{name} | Moonlit Ink', zh: '{name}｜月下墨 Moonlit Ink' },
  previewHeading: { en: 'Preview gallery', zh: '预览画廊' },
  includedHeading: { en: 'What is included', zh: '包含内容' },
  // 合集里每个分包占一行：{name} 商品名，{count} 张数
  howHeading: { en: 'How to use', zh: '使用说明' },
  // 使用说明三步
  steps: [
    {
      title: { en: 'Buy and download', zh: '购买并下载' },
      body: {
        en: 'Check out on Gumroad, then download the files from the page or the email Gumroad sends you.',
        zh: '在 Gumroad 完成付款，从下载页面或 Gumroad 发来的邮件里下载文件。',
      },
    },
    {
      title: { en: 'Choose your favourites', zh: '挑选喜欢的' },
      body: {
        en: 'Save the images you like to your phone or computer.',
        zh: '把喜欢的图片存到手机或电脑里。',
      },
    },
    {
      title: { en: 'Set it', zh: '设置' },
      body: {
        en: 'Open your wallpaper or profile settings, pick the image and you are done.',
        zh: '打开壁纸或头像设置，选中图片即可。',
      },
    },
  ],
  licenseHeading: { en: 'License summary', zh: '授权摘要' },
  licenseAllowed: {
    en: 'Yes: wallpapers on your own phone and computer, and your own social avatars.',
    zh: '可以：用作自己的手机、电脑壁纸和自己的社交头像。',
  },
  licenseForbidden: {
    en: 'No: reselling, redistributing, uploading to other wallpaper or stock sites, AI training, or commercial use.',
    zh: '不可以：转售、再分发、上传到其他素材或壁纸平台、训练 AI，以及商用。',
  },
  licenseLink: { en: 'Read the full license', zh: '阅读完整授权说明' },
  relatedHeading: { en: 'You may also like', zh: '相关推荐' },
};

export const galleryPage = {
  title: { en: 'Gallery | Moonlit Ink', zh: '作品画廊｜月下墨 Moonlit Ink' },
  description: {
    en: 'Browse watermarked previews of every Moonlit Ink ink-wash wallpaper and avatar. Filter by phone, desktop or avatar.',
    zh: '浏览月下墨全部水墨壁纸与头像的水印预览图，可按手机、电脑、头像筛选。',
  },
  heading: { en: 'Gallery', zh: '作品画廊' },
  lead: {
    en: 'Tap any image to enlarge it and see which pack it belongs to.',
    zh: '点开任意一张可以放大，并查看它属于哪个素材包。',
  },
  filterLabel: { en: 'Filter by type', zh: '按类型筛选' },
  // {count} 会换成当前显示的张数
  showing: { en: 'Showing {count} images', zh: '当前显示 {count} 张' },
};

export const samplePage = {
  title: { en: 'Free sample | Moonlit Ink', zh: '免费样图｜月下墨 Moonlit Ink' },
  description: {
    en: 'Download three free Moonlit Ink ink-wash images from Gumroad and try them on your own screen.',
    zh: '在 Gumroad 免费下载三张月下墨水墨图，先在自己的屏幕上试试效果。',
  },
  heading: { en: 'Three images, free', zh: '三张样图，免费领取' },
  lead: {
    en: 'Three images picked from the collection, free to download, so you can see them on your own screen first.',
    zh: '从作品里挑出的三张图，免费下载，先在自己的屏幕上看看效果。',
  },
  points: [
    {
      en: 'The sample is a free product on Gumroad.',
      zh: '样图是 Gumroad 上的免费商品。',
    },
    {
      en: 'This site does not ask for or collect your email. Gumroad handles the download under its own policies.',
      zh: '本站不索取、不收集你的邮箱。下载由 Gumroad 按其自身政策处理。',
    },
    {
      en: 'The same personal-use license applies to the free sample.',
      zh: '免费样图同样适用个人使用授权。',
    },
  ],
  cta: { en: 'Get the free sample on Gumroad', zh: '前往 Gumroad 领取免费样图' },
  afterHeading: { en: 'Like them? See the full packs', zh: '喜欢的话，看看完整素材包' },
};

/* ----------------------------------------------------------------------------
 * 【7】关于、联系、404
 * -------------------------------------------------------------------------- */
export const aboutPage = {
  title: { en: 'About | Moonlit Ink', zh: '关于｜月下墨 Moonlit Ink' },
  description: {
    en: 'Moonlit Ink is a one-person studio making original Japanese-inspired ink-wash wallpapers and avatars.',
    zh: '月下墨是一个人运营的小工作室，制作原创和风水墨壁纸与头像。',
  },
  heading: { en: 'About Moonlit Ink', zh: '关于月下墨' },
  paragraphs: [
    {
      en: 'Moonlit Ink is run by one person. I make ink-wash style wallpapers and avatars: mountains, mist, moonlight and a lot of empty space.',
      zh: '月下墨由我一个人运营。我做的是水墨风格的壁纸和头像：山、雾、月光，还有大量留白。',
    },
    {
      en: 'Every image starts as a prompt I write for Midjourney. Most results are discarded. The few I keep are retouched by hand before they go into a pack.',
      zh: '每张图都从我写给 Midjourney 的提示词开始。大多数结果会被丢弃，留下的少数经过人工修图，才会放进素材包。',
    },
    {
      en: 'The style is original. Nothing here depicts characters, logos or settings from existing films, shows, comics or games.',
      zh: '风格是原创的。这里没有任何来自现有影视、动画、漫画或游戏的角色、标志或场景。',
    },
    {
      en: 'Payment and file delivery are handled entirely by Gumroad. This website is a simple showcase: no accounts, no cookies, no forms.',
      zh: '付款和文件交付全部由 Gumroad 完成。这个网站只是一个展示页：没有账号，没有 cookie，没有表单。',
    },
  ],
  contactCta: { en: 'Get in touch', zh: '联系我' },
};

export const contactPage = {
  title: { en: 'Contact | Moonlit Ink', zh: '联系｜月下墨 Moonlit Ink' },
  description: {
    en: 'Email Moonlit Ink about download problems, commercial licensing or anything else.',
    zh: '下载问题、商用授权或其他事情，都可以通过邮件联系月下墨。',
  },
  heading: { en: 'Contact', zh: '联系' },
  lead: {
    en: 'Email is the only way to reach me. I read everything and reply as soon as I can.',
    zh: '邮件是唯一的联系方式。每封我都会看，并尽快回复。',
  },
  emailLabel: { en: 'Email', zh: '邮箱' },
  topics: [
    {
      en: 'Download failed or a file is damaged: include your Gumroad receipt email so I can send it again.',
      zh: '下载失败或文件损坏：请附上 Gumroad 收据邮箱，方便我重新发给你。',
    },
    {
      en: 'Commercial use: tell me what you would like to use the images for.',
      zh: '商用授权：请告诉我你打算把图片用在哪里。',
    },
    {
      en: 'Anything else: feedback and questions are welcome.',
      zh: '其他：欢迎反馈和提问。',
    },
  ],
};

export const notFoundPage = {
  title: { en: 'Page not found | Moonlit Ink', zh: '页面不存在｜月下墨 Moonlit Ink' },
  heading: { en: 'This page drifted into the mist', zh: '这一页走进了雾里' },
  body: {
    en: 'The page you are looking for does not exist or has moved.',
    zh: '你要找的页面不存在，或者已经搬走了。',
  },
  cta: { en: 'Back to the home page', zh: '回到首页' },
};

/* ----------------------------------------------------------------------------
 * 【8】条款类页面
 *   每个页面：title 浏览器标题、description 搜索摘要、heading 页面大标题、
 *   intro 开头一段、sections 若干小节（heading 小标题 + paragraphs 段落 + list 列表）。
 *   文字里的 {email} 会自动换成 site.email。
 *   这些是模板，上线前请自行核对适用法律。
 * -------------------------------------------------------------------------- */
export type DocSection = { heading: Text; paragraphs?: Text[]; list?: Text[] };
export type Doc = {
  slug: string;
  navLabel: Text;
  title: Text;
  description: Text;
  heading: Text;
  intro: Text;
  sections: DocSection[];
  /** 是否在页面末尾显示「模板，上线前请自行核对适用法律」 */
  templateNote: boolean;
};

export const docs: Doc[] = [
  /* ---------------- 授权说明 /license ---------------- */
  {
    slug: 'license',
    navLabel: { en: 'License', zh: '授权说明' },
    title: { en: 'License | Moonlit Ink', zh: '授权说明｜月下墨 Moonlit Ink' },
    description: {
      en: 'The Moonlit Ink personal-use license: what you may and may not do with the wallpapers and avatars you download.',
      zh: '月下墨个人使用授权：下载的壁纸和头像可以怎么用、不可以怎么用。',
    },
    heading: { en: 'License', zh: '授权说明' },
    intro: {
      en: 'Every pack, and the free sample, comes with a personal-use license. You are buying permission to use the images yourself, not ownership of the artwork.',
      zh: '每个素材包（包括免费样图）都附带个人使用授权。你购买的是自己使用这些图片的许可，不是作品本身的所有权。',
    },
    sections: [
      {
        heading: { en: 'What you can do', zh: '可以做的' },
        list: [
          { en: 'Use the images as wallpaper on your own phones, tablets and computers.', zh: '用作你自己的手机、平板和电脑的壁纸。' },
          { en: 'Use the avatars as your own profile picture on social and chat platforms.', zh: '把头像用作你自己在社交和聊天平台上的头像。' },
          { en: 'Keep a backup copy for yourself.', zh: '为自己保留备份。' },
        ],
      },
      {
        heading: { en: 'What you cannot do', zh: '不可以做的' },
        list: [
          { en: 'Resell the files, with or without changes.', zh: '转售文件，无论是否修改过。' },
          { en: 'Redistribute or share the files, for free or for payment.', zh: '再分发或分享文件，无论免费还是收费。' },
          { en: 'Upload the files to other stock, asset or wallpaper platforms.', zh: '把文件上传到其他素材或壁纸平台。' },
          { en: 'Use the files to train, fine-tune or test AI or machine-learning models.', zh: '把文件用于训练、微调或测试 AI 及机器学习模型。' },
          { en: 'Claim the images as your own work.', zh: '声称这些图片是你自己的作品。' },
        ],
      },
      {
        heading: { en: 'Commercial use', zh: '商用' },
        paragraphs: [
          {
            en: 'Commercial use is not included in the personal license. That covers, for example, products for sale, advertising, client work, and branding for a business. If you need commercial use, email {email} and describe your project.',
            zh: '个人版不包含商用，例如用于出售的商品、广告、客户项目、企业品牌形象等。如需商用，请发邮件到 {email} 说明你的用途。',
          },
        ],
      },
      {
        heading: { en: 'Ownership', zh: '权利归属' },
        paragraphs: [
          {
            en: 'Moonlit Ink keeps all rights in the images that are not expressly granted here. The license is for one person and cannot be transferred.',
            zh: '本授权未明确授予的权利，均由月下墨保留。授权仅限一人使用，不可转让。',
          },
        ],
      },
    ],
    templateNote: true,
  },

  /* ---------------- AI 披露 /ai-disclosure ---------------- */
  {
    slug: 'ai-disclosure',
    navLabel: { en: 'AI disclosure', zh: 'AI 披露' },
    title: { en: 'AI disclosure | Moonlit Ink', zh: 'AI 披露｜月下墨 Moonlit Ink' },
    description: {
      en: 'How Moonlit Ink images are made: generated with Midjourney from my own prompts, then selected and retouched by a human.',
      zh: '月下墨的图片如何制作：由我撰写提示词、用 Midjourney 生成，再经人工筛选与修图。',
    },
    heading: { en: 'AI disclosure', zh: 'AI 披露' },
    intro: {
      en: 'Created with the help of AI image tools and edited by a human.',
      zh: '由 AI 工具辅助生成，并经人工筛选与修图。',
    },
    sections: [
      {
        heading: { en: 'How the images are made', zh: '图片是怎么做出来的' },
        list: [
          { en: 'I write the prompts.', zh: '提示词由我撰写。' },
          { en: 'The images are generated with an AI image tool, Midjourney.', zh: '图像由 AI 工具 Midjourney 生成。' },
          { en: 'I go through the results and keep only a small number.', zh: '我从结果中筛选，只留下少数。' },
          { en: 'I retouch the selected images by hand: cleaning up flaws, adjusting tone and cropping for each screen size.', zh: '我对选中的图片进行人工修图：修掉瑕疵、调整色调，并按各屏幕尺寸裁切。' },
        ],
      },
      {
        heading: { en: 'What they are not', zh: '它们不是什么' },
        paragraphs: [
          {
            en: 'These images are not hand-painted or hand-drawn, and they are never described that way on this site or on Gumroad.',
            zh: '这些图片不是手绘作品，在本站和 Gumroad 上都不会被描述为手绘。',
          },
          {
            en: 'The style is original. The images do not depict characters, logos or trademarks from any existing film, show, comic or game.',
            zh: '风格为原创。图片不包含任何现有影视、动画、漫画或游戏的角色、标志或商标。',
          },
        ],
      },
      {
        heading: { en: 'Questions', zh: '有疑问' },
        paragraphs: [
          {
            en: 'If you want to know more about how a particular image was made, email {email}.',
            zh: '如果想了解某张图的制作过程，请发邮件到 {email}。',
          },
        ],
      },
    ],
    templateNote: false,
  },

  /* ---------------- 隐私政策 /privacy ---------------- */
  {
    slug: 'privacy',
    navLabel: { en: 'Privacy', zh: '隐私政策' },
    title: { en: 'Privacy policy | Moonlit Ink', zh: '隐私政策｜月下墨 Moonlit Ink' },
    description: {
      en: 'Moonlit Ink sets no cookies and has no accounts, forms or database. Payments and downloads are handled by Gumroad.',
      zh: '月下墨不设置 cookie，没有账号、表单或数据库。付款与下载由 Gumroad 处理。',
    },
    heading: { en: 'Privacy policy', zh: '隐私政策' },
    intro: {
      en: 'This website is a static showcase. It is built to collect as little as possible.',
      zh: '本网站是一个静态展示页，在设计上尽量不收集任何信息。',
    },
    sections: [
      {
        heading: { en: 'What this site does not do', zh: '本站不做的事' },
        list: [
          { en: 'It sets no cookies.', zh: '不设置 cookie。' },
          { en: 'It has no accounts, logins, forms or database.', zh: '没有账号、登录、表单或数据库。' },
          { en: 'It never sees or stores payment details, identity documents or passwords.', zh: '不接触、不存储任何支付信息、证件或密码。' },
          { en: 'It uses no advertising or cross-site tracking scripts.', zh: '不使用广告或跨站追踪脚本。' },
        ],
      },
      {
        heading: { en: 'Language preference', zh: '语言偏好' },
        paragraphs: [
          {
            en: 'If you switch language, your choice (English or Chinese) is saved in your browser\'s local storage so the home page opens in that language next time. It stays on your device and is not sent to us.',
            zh: '当你切换语言时，你的选择（英文或中文）会保存在浏览器的本地存储里，以便下次打开首页时使用该语言。它只留在你的设备上，不会发送给我们。',
          },
        ],
      },
      {
        heading: { en: 'Hosting and analytics', zh: '托管与访问统计' },
        paragraphs: [
          {
            en: 'The site is hosted on Cloudflare Pages. Like any web host, Cloudflare processes technical request data such as your IP address in order to deliver pages and protect the service.',
            zh: '本站托管在 Cloudflare Pages。与所有网站托管服务一样，Cloudflare 为了传送页面和保护服务，会处理 IP 地址等技术性请求数据。',
          },
          {
            en: 'The site may use Cloudflare Web Analytics to count page views. It does not use cookies and does not build a profile of individual visitors.',
            zh: '本站可能使用 Cloudflare Web Analytics 统计页面访问量。它不使用 cookie，也不对单个访客建立画像。',
          },
        ],
      },
      {
        heading: { en: 'Purchases', zh: '购买' },
        paragraphs: [
          {
            en: 'Buy buttons take you to Gumroad. Checkout, payment, receipts and file delivery all happen there, under Gumroad\'s own terms and privacy policy. As the seller I can see the order details Gumroad provides, such as your email address, and I use them only to support your purchase.',
            zh: '购买按钮会跳转到 Gumroad。结账、付款、收据和文件交付都在那里完成，适用 Gumroad 自己的条款和隐私政策。作为卖家，我能看到 Gumroad 提供的订单信息（例如你的邮箱），并且只用于为你的购买提供支持。',
          },
        ],
      },
      {
        heading: { en: 'Email', zh: '邮件' },
        paragraphs: [
          {
            en: 'If you email {email}, I use your address and message only to reply to you.',
            zh: '如果你发邮件到 {email}，你的邮箱地址和邮件内容只用于回复你。',
          },
        ],
      },
    ],
    templateNote: true,
  },

  /* ---------------- 使用条款 /terms ---------------- */
  {
    slug: 'terms',
    navLabel: { en: 'Terms', zh: '使用条款' },
    title: { en: 'Terms of use | Moonlit Ink', zh: '使用条款｜月下墨 Moonlit Ink' },
    description: {
      en: 'Terms for using the Moonlit Ink website and buying its digital wallpaper and avatar packs through Gumroad.',
      zh: '使用月下墨网站以及通过 Gumroad 购买数字壁纸与头像素材包的条款。',
    },
    heading: { en: 'Terms of use', zh: '使用条款' },
    intro: {
      en: 'By using this website or buying a pack, you agree to these terms.',
      zh: '使用本网站或购买素材包，即表示你同意以下条款。',
    },
    sections: [
      {
        heading: { en: 'The products', zh: '商品' },
        paragraphs: [
          {
            en: 'The packs are digital image files. Nothing physical is shipped. Preview images on this site are low-resolution and watermarked; purchased files are not.',
            zh: '素材包是数字图片文件，不寄送任何实物。本站的预览图为低分辨率并带水印，购买后的文件没有水印。',
          },
        ],
      },
      {
        heading: { en: 'Buying', zh: '购买' },
        paragraphs: [
          {
            en: 'All purchases are made on Gumroad and are also subject to Gumroad\'s terms. Prices shown here are for reference; the price shown at Gumroad checkout, including any taxes, is the one that applies.',
            zh: '所有购买都在 Gumroad 完成，同时适用 Gumroad 的条款。本站显示的价格仅供参考，以 Gumroad 结账页显示的价格（含可能的税费）为准。',
          },
        ],
      },
      {
        heading: { en: 'License', zh: '授权' },
        paragraphs: [
          {
            en: 'Your use of the files is governed by the License page. In short: personal use only; no resale, redistribution, re-uploading or AI training.',
            zh: '文件的使用以授权说明页面为准。简单来说：仅限个人使用；不得转售、再分发、重新上传或用于训练 AI。',
          },
        ],
      },
      {
        heading: { en: 'Website content', zh: '网站内容' },
        paragraphs: [
          {
            en: 'The images, text and design of this site belong to Moonlit Ink. Please do not copy, scrape or reuse them.',
            zh: '本站的图片、文字和设计归月下墨所有，请勿复制、抓取或挪用。',
          },
        ],
      },
      {
        heading: { en: 'No warranty', zh: '免责声明' },
        paragraphs: [
          {
            en: 'The site and the files are provided as they are. Colours can look different from one screen to another. To the extent the law allows, Moonlit Ink is not liable for indirect or consequential loss.',
            zh: '网站和文件均按现状提供。不同屏幕显示的颜色可能有差异。在法律允许的范围内，月下墨不对间接或后果性损失承担责任。',
          },
        ],
      },
      {
        heading: { en: 'Changes and contact', zh: '变更与联系' },
        paragraphs: [
          {
            en: 'These terms may be updated from time to time; the version on this page is the current one. Questions: {email}.',
            zh: '本条款可能不时更新，以本页面显示的版本为准。如有疑问请联系 {email}。',
          },
        ],
      },
    ],
    templateNote: true,
  },

  /* ---------------- 退款说明 /refunds ---------------- */
  {
    slug: 'refunds',
    navLabel: { en: 'Refunds', zh: '退款说明' },
    title: { en: 'Refund policy | Moonlit Ink', zh: '退款说明｜月下墨 Moonlit Ink' },
    description: {
      en: 'Moonlit Ink digital packs are generally non-refundable. If a file is damaged or a download fails, email for a replacement.',
      zh: '月下墨的数字素材包一般不退款。文件损坏或下载失败时，可邮件联系换发。',
    },
    heading: { en: 'Refund policy', zh: '退款说明' },
    intro: {
      en: 'Because these are digital files that are delivered immediately and cannot be returned, purchases are generally not refundable.',
      zh: '由于商品是即时交付、无法退回的数字文件，购买后一般不予退款。',
    },
    sections: [
      {
        heading: { en: 'If something goes wrong', zh: '如果出了问题' },
        paragraphs: [
          {
            en: 'If a file is damaged, or your download fails, email {email} with the email address on your Gumroad receipt. I will send you a working copy.',
            zh: '如果文件损坏或下载失败，请发邮件到 {email}，并附上 Gumroad 收据上的邮箱地址，我会重新发给你可用的文件。',
          },
        ],
      },
      {
        heading: { en: 'Before you buy', zh: '购买之前' },
        paragraphs: [
          {
            en: 'Look through the previews in the gallery and try the free sample first, so you know what the files look like on your own screen.',
            zh: '建议先看看画廊里的预览图，并领取免费样图，在自己的屏幕上确认效果。',
          },
        ],
      },
      {
        heading: { en: 'Your legal rights', zh: '你的法定权利' },
        paragraphs: [
          {
            en: 'Nothing here limits any rights you have under the consumer law that applies to you.',
            zh: '本说明不限制你依据适用的消费者保护法律所享有的任何权利。',
          },
        ],
      },
    ],
    templateNote: true,
  },
];
