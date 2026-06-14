// Daily content generator - runs via GitHub Actions
// Generates a new post entry in feed.json and creates the post HTML

const fs = require('fs');
const path = require('path');

const today = new Date().toISOString().slice(0, 10);
const slug = today;

// Read existing feed
const feedPath = path.join(__dirname, '..', 'feed.json');
const feed = JSON.parse(fs.readFileSync(feedPath, 'utf8'));

// Check if today's post already exists
if (feed.posts.find(p => p.slug === slug)) {
  console.log(`Post for ${today} already exists, skipping.`);
  process.exit(0);
}

// Rotating content pool - add more over time
const toolPool = [
  // Week 1: Developer tools
  [
    { title: 'GitHub Copilot 免费版', url: 'https://github.com/features/copilot', desc: 'AI 编程助手，提供代码补全和对话功能，免费版每月2000次补全', tag: 'AI工具' },
    { title: 'Vercel 免费部署', url: 'https://vercel.com', desc: '前端项目免费托管平台，支持自动部署，全球 CDN 加速', tag: '部署' },
    { title: 'Excalidraw 在线画图', url: 'https://excalidraw.com', desc: '手绘风格在线白板工具，适合画架构图和流程图', tag: '设计' },
    { title: 'Transform.tools', url: 'https://transform.tools', desc: '各种代码格式互转工具，JSX↔JSON↔TypeScript↔GraphQL', tag: '开发者' },
    { title: 'Squoosh 图片压缩', url: 'https://squoosh.app', desc: 'Google 出品的图片压缩工具，支持多种格式和高级压缩选项', tag: '设计' },
  ],
  [
    { title: 'Canva 免费版', url: 'https://canva.com', desc: '在线设计平台，海量模板，制作海报/封面/社交媒体图片', tag: '设计' },
    { title: 'Remove.bg 去背景', url: 'https://remove.bg', desc: 'AI 一键去除图片背景，免费版支持标清下载', tag: 'AI工具' },
    { title: 'TinyPNG 图片压缩', url: 'https://tinypng.com', desc: '智能 PNG/JPEG 压缩，保持画质的同时大幅减小文件体积', tag: '设计' },
    { title: 'ChatGPT 免费版', url: 'https://chat.openai.com', desc: 'OpenAI 的 AI 对话助手，免费版即可使用 GPT-4o mini', tag: 'AI工具' },
    { title: 'Claude AI', url: 'https://claude.ai', desc: 'Anthropic 的 AI 助手，擅长长文本处理和代码生成', tag: 'AI工具' },
  ],
  [
    { title: 'Cursor 编辑器', url: 'https://cursor.sh', desc: 'AI 驱动的代码编辑器，内置 AI 对话和代码生成功能', tag: 'AI工具' },
    { title: 'Shields.io 徽章生成', url: 'https://shields.io', desc: 'GitHub README 徽章生成器，美化你的项目主页', tag: '开发者' },
    { title: 'DevDocs API 文档', url: 'https://devdocs.io', desc: '聚合了数百个 API 文档的快速搜索工具，离线也能用', tag: '开发者' },
    { title: 'Carbon 代码截图', url: 'https://carbon.now.sh', desc: '把代码生成漂亮的截图，适合分享到社交媒体', tag: '开发者' },
    { title: 'Ray.so 代码图片', url: 'https://ray.so', desc: '另一款代码截图美化工具，风格更现代简约', tag: '开发者' },
  ],
  [
    { title: 'PDF24 免费PDF工具', url: 'https://tools.pdf24.org', desc: '免费在线 PDF 编辑、合并、压缩、转换工具合集', tag: '效率' },
    { title: 'ILovePDF', url: 'https://ilovepdf.com', desc: '最流行的在线 PDF 工具，合并/拆分/压缩/转换一应俱全', tag: '效率' },
    { title: 'SmallPDF', url: 'https://smallpdf.com', desc: '在线 PDF 处理工具，每天免费处理2个文件', tag: '效率' },
    { title: 'Notion 免费版', url: 'https://notion.so', desc: '全能笔记和项目管理工具，个人免费版功能强大', tag: '效率' },
    { title: 'Obsidian 笔记', url: 'https://obsidian.md', desc: '本地优先的 Markdown 笔记工具，支持双向链接和知识图谱', tag: '效率' },
  ],
];

// Pick a pool based on day of month
const poolIndex = (new Date().getDate() - 1) % toolPool.length;
const items = toolPool[poolIndex];

const titles = [
  `今日推荐：${items.length}个实用工具（${today}）`,
  `效率工具推荐 | ${today}`,
  `${today} 工具快报：这${items.length}个工具值得一试`,
  `每日发现：${items.length}个${items[0].tag}好帮手`,
];

const titleIndex = new Date().getDate() % titles.length;
const postTitle = titles[titleIndex];

// Add new post to feed (at the beginning)
feed.posts.unshift({ slug, date: today, title: postTitle, items });
feed.updated = today;

// Write feed back
fs.writeFileSync(feedPath, JSON.stringify(feed, null, 2));

// Create post HTML page
const postsDir = path.join(__dirname, '..', 'posts');
if (!fs.existsSync(postsDir)) fs.mkdirSync(postsDir, { recursive: true });

const itemsHtml = items.map(item =>
  `    <div class="entry"><h3><a href="${item.url}" target="_blank" rel="nofollow">${item.title}</a> <span class="tag">${item.tag}</span></h3><p>${item.desc}</p></div>`
).join('\n');

const postHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${postTitle} - 每日工具推荐</title>
<meta name="description" content="每日推荐${items.length}个实用在线工具和开源项目：${items.map(i => i.title).join('、')}">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#fafafa;--card:#fff;--text:#1a1a2e;--t2:#666;--accent:#2563eb;--border:#e5e7eb;--r:10px}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Noto Sans SC",sans-serif;background:var(--bg);color:var(--text);line-height:1.7;min-height:100vh}
.container{max-width:800px;margin:0 auto;padding:0 20px}
header{background:var(--card);border-bottom:1px solid var(--border);padding:20px 0;margin-bottom:32px}
header a{color:var(--accent);text-decoration:none;font-size:.9rem}header a:hover{text-decoration:underline}
header h1{font-size:1.3rem;margin-top:8px}
.post{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:28px}
.post .date{color:var(--t2);font-size:.8rem;margin-bottom:20px}
.entry{margin-bottom:24px;padding-bottom:20px;border-bottom:1px solid var(--border)}
.entry:last-child{border-bottom:none;margin-bottom:0;padding-bottom:0}
.entry h3{font-size:1rem;margin-bottom:4px}.entry h3 a{color:var(--accent);text-decoration:none}.entry h3 a:hover{text-decoration:underline}
.entry p{color:var(--t2);font-size:.9rem}
.tag{display:inline-block;background:#eff6ff;color:var(--accent);font-size:.72rem;padding:2px 8px;border-radius:10px;margin-left:6px;vertical-align:middle}
footer{text-align:center;padding:32px 20px;color:var(--t2);font-size:.8rem}
@media(max-width:600px){.post{padding:18px}}
</style>
</head>
<body>
<header><div class="container"><a href="../index.html">← 返回首页</a><h1>${postTitle}</h1></div></header>
<main class="container">
<article class="post">
<div class="date">📅 ${today}</div>
${itemsHtml}
</article>
</main>
<footer><p>每日工具推荐 · 自动更新</p></footer>
</body>
</html>`;

fs.writeFileSync(path.join(postsDir, `${slug}.html`), postHtml);
console.log(`Generated post for ${today}: ${postTitle}`);
