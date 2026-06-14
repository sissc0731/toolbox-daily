// Daily content generator - runs via GitHub Actions
// Generates: 1) website post, 2) Xiaohongshu note

const fs = require('fs');
const path = require('path');

const today = new Date().toISOString().slice(0, 10);
const slug = today;

// === Part 1: Website Post ===
const feedPath = path.join(__dirname, '..', 'feed.json');
const feed = JSON.parse(fs.readFileSync(feedPath, 'utf8'));

if (feed.posts.find(p => p.slug === slug)) {
  console.log(`Post for ${today} already exists.`);
} else {
  const toolPool = [
    [
      { title: 'GitHub Copilot 免费版', url: 'https://github.com/features/copilot', desc: 'AI 编程助手，代码补全和对话，免费版每月2000次补全', tag: 'AI工具' },
      { title: 'Vercel 免费部署', url: 'https://vercel.com', desc: '前端项目免费托管，自动部署，全球 CDN 加速', tag: '部署' },
      { title: 'Excalidraw 在线画图', url: 'https://excalidraw.com', desc: '手绘风格白板工具，画架构图和流程图利器', tag: '设计' },
      { title: 'Transform.tools', url: 'https://transform.tools', desc: '代码格式互转：JSX↔JSON↔TypeScript↔GraphQL', tag: '开发者' },
      { title: 'Squoosh 图片压缩', url: 'https://squoosh.app', desc: 'Google 出品图片压缩，多格式+高级选项', tag: '设计' },
    ],
    [
      { title: 'Canva 免费版', url: 'https://canva.com', desc: '在线设计平台，海量模板做海报封面', tag: '设计' },
      { title: 'Remove.bg 去背景', url: 'https://remove.bg', desc: 'AI 一键去除图片背景，免费标清下载', tag: 'AI工具' },
      { title: 'TinyPNG 图片压缩', url: 'https://tinypng.com', desc: '智能 PNG/JPEG 压缩，画质好体积小', tag: '设计' },
      { title: 'ChatGPT 免费版', url: 'https://chat.openai.com', desc: 'OpenAI 对话助手，GPT-4o mini 免费', tag: 'AI工具' },
      { title: 'Claude AI', url: 'https://claude.ai', desc: 'Anthropic AI 助手，长文本和代码生成擅长', tag: 'AI工具' },
    ],
    [
      { title: 'Cursor 编辑器', url: 'https://cursor.sh', desc: 'AI 驱动代码编辑器，内置 AI 对话', tag: 'AI工具' },
      { title: 'Shields.io 徽章', url: 'https://shields.io', desc: 'GitHub README 徽章生成，美化项目主页', tag: '开发者' },
      { title: 'DevDocs API 文档', url: 'https://devdocs.io', desc: '聚合数百 API 文档，离线也能搜索', tag: '开发者' },
      { title: 'Carbon 代码截图', url: 'https://carbon.now.sh', desc: '代码生成漂亮截图，适合发社交媒体', tag: '开发者' },
      { title: 'Ray.so 代码图片', url: 'https://ray.so', desc: '代码截图美化，风格现代简约', tag: '开发者' },
    ],
    [
      { title: 'PDF24 免费PDF', url: 'https://tools.pdf24.org', desc: '免费 PDF：编辑/合并/压缩/转换全包', tag: '效率' },
      { title: 'ILovePDF', url: 'https://ilovepdf.com', desc: '最流行的在线 PDF 工具合集', tag: '效率' },
      { title: 'Notion 免费版', url: 'https://notion.so', desc: '全能笔记+项目管理，个人免费版强大', tag: '效率' },
      { title: 'Obsidian 笔记', url: 'https://obsidian.md', desc: '本地 Markdown 笔记，双向链接知识图谱', tag: '效率' },
      { title: 'uTools 效率工具', url: 'https://u.tools', desc: 'Windows/Mac 效率启动器，插件扩展', tag: '效率' },
    ],
    [
      { title: 'Photopea', url: 'https://photopea.com', desc: '在线版 Photoshop，功能几乎一模一样', tag: '设计' },
      { title: 'Figma 免费版', url: 'https://figma.com', desc: 'UI/UX 设计协作工具，行业标准', tag: '设计' },
      { title: 'Unsplash 图库', url: 'https://unsplash.com', desc: '免费高清图片，商用无需授权', tag: '设计' },
      { title: 'Coolors 配色', url: 'https://coolors.co', desc: '配色方案生成器，一键生成调色板', tag: '设计' },
      { title: 'SVG Repo 图标', url: 'https://svgrepo.com', desc: '免费 SVG 图标库，10万+图标', tag: '设计' },
    ],
    [
      { title: 'DeepSeek AI', url: 'https://chat.deepseek.com', desc: '国产大模型，编程和长文本能力突出', tag: 'AI工具' },
      { title: 'Kimi 长文本', url: 'https://kimi.moonshot.cn', desc: '200万字超长上下文，适合读论文报告', tag: 'AI工具' },
      { title: '豆包 AI', url: 'https://www.doubao.com', desc: '字节跳动 AI 助手，多模态能力', tag: 'AI工具' },
      { title: '通义千问', url: 'https://tongyi.aliyun.com', desc: '阿里 AI 助手，办公场景优化', tag: 'AI工具' },
      { title: 'Perplexity', url: 'https://perplexity.ai', desc: 'AI 搜索引擎，搜索+总结一步到位', tag: 'AI工具' },
    ],
    [
      { title: 'JSON Crack 可视化', url: 'https://jsoncrack.com', desc: 'JSON 数据变漂亮树状图', tag: '开发者' },
      { title: 'CyberChef 加密工具箱', url: 'https://gchq.github.io/CyberChef', desc: '编码/加密/转换瑞士军刀', tag: '开发者' },
      { title: 'JWT.io 调试器', url: 'https://jwt.io', desc: 'JWT Token 在线解码调试', tag: '开发者' },
      { title: 'Regex101 正则测试', url: 'https://regex101.com', desc: '多语言正则调试，实时解释', tag: '开发者' },
      { title: 'QuickType 类型生成', url: 'https://quicktype.io', desc: 'JSON→各语言类型定义自动生成', tag: '开发者' },
    ],
    [
      { title: 'Gamma AI PPT', url: 'https://gamma.app', desc: 'AI 一键生成 PPT，排版精美', tag: 'AI工具' },
      { title: 'Slidesgo 模板', url: 'https://slidesgo.com', desc: '免费 PPT/Google Slides 模板', tag: '效率' },
      { title: 'Loom 录屏', url: 'https://loom.com', desc: '录屏+分享，适合远程协作', tag: '效率' },
      { title: 'Calendly 预约', url: 'https://calendly.com', desc: '日程预约工具，自动时区转换', tag: '效率' },
      { title: 'Eraser 技术画图', url: 'https://eraser.io', desc: '技术架构图/流程图在线画', tag: '开发者' },
    ],
    [
      { title: '免费在线工具箱 ⭐', url: 'https://xcn6au7vv0e4.aiforce.cloud/app/app_4kcptf9pby7e4', desc: '15+工具一站搞定：JSON/图片/二维码/正则/哈希/颜色', tag: '工具箱' },
      { title: 'Tool.lu 工具箱', url: 'https://tool.lu', desc: '50+开发/设计/转换/加密工具', tag: '工具箱' },
      { title: 'IT-Tools 开源工具箱', url: 'https://it-tools.tech', desc: '开源可自部署的开发者工具箱', tag: '工具箱' },
      { title: 'BeJSON 工具站', url: 'https://bejson.com', desc: '国内老牌工具站，100+功能', tag: '工具箱' },
      { title: 'He3 客户端工具箱', url: 'https://he3.app', desc: '200+工具的客户端应用', tag: '工具箱' },
    ],
  ];

  const poolIndex = (new Date().getDate() - 1) % toolPool.length;
  const items = toolPool[poolIndex];

  const titles = [
    `今日推荐：${items.length}个实用工具（${today}）`,
    `效率工具推荐 | ${today}`,
    `${today} 工具快报：这${items.length}个工具值得一试`,
    `每日发现：${items.length}个${items[0].tag}好帮手`,
  ];

  const postTitle = titles[new Date().getDate() % titles.length];
  feed.posts.unshift({ slug, date: today, title: postTitle, items });
  feed.updated = today;
  fs.writeFileSync(feedPath, JSON.stringify(feed, null, 2));

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
  console.log(`Generated website post: ${postTitle}`);
}

// === Part 2: Xiaohongshu Note ===
const xhsDir = path.join(__dirname, '..', 'xiaohongshu');
if (!fs.existsSync(xhsDir)) fs.mkdirSync(xhsDir, { recursive: true });

// Check if today's XHS note already exists
const xhsTodayFile = path.join(xhsDir, `${today}.md`);
if (fs.existsSync(xhsTodayFile)) {
  console.log(`XHS note for ${today} already exists.`);
  process.exit(0);
}

const xhsTemplates = [
  // Template 1: Collection-style (收藏导向)
  (items) => {
    const emojis = ['🔥','💡','⚡','🎯','✨','🚀','💎','🔧','📌','🌟'];
    const cats = [...new Set(items.map(i => i.tag))];
    const dateStr = today.replace(/-/g, '/');
    let note = `📌 ${dateStr} 免费工具清单 | 建议收藏 🔖\n\n`;
    note += `分享 ${items.length} 个超好用的免费工具\n`;
    note += `涵盖 ${cats.join(' · ')} 等领域\n\n`;
    note += `━━━━━━━━━━━━━━━━\n\n`;
    items.forEach((item, i) => {
      note += `${emojis[i]} 𝗡𝗢.${i + 1}  ${item.title}\n`;
      note += `   💬 ${item.desc}\n`;
      if (item.url) note += `   🔗 ${item.url}\n`;
      note += `\n`;
    });
    note += `━━━━━━━━━━━━━━━━\n\n`;
    note += `💻 更多免费工具 → 主页有工具箱链接\n`;
    note += `📂 建议收藏，下次找工具不迷路\n\n`;
    note += `#免费工具 #效率提升 #实用工具推荐 #开发者必备 #打工人效率 #学生党必备 #好物分享 #免费资源 #工具箱 #每天分享实用工具`;
    return note;
  },
  // Template 2: List-style (清单导向)
  (items) => {
    const dateStr = today.replace(/-/g, '/');
    let note = `🎯 ${dateStr} | 打工人效率翻倍の${items.length}个免费工具\n\n`;
    note += `不花一分钱💰 每一个都亲测好用 ✨\n\n`;
    items.forEach((item, i) => {
      note += `${i + 1}️⃣ **${item.title}**\n`;
      note += `   ${item.desc}\n\n`;
    });
    note += `💡 小tips：全部浏览器打开即用，不用下载！\n\n`;
    note += `🏠 主页有完整工具箱合集～\n\n`;
    note += `#免费工具 #效率工具 #办公效率 #学生党 #程序员日常 #工具推荐 #效率翻倍 #实用app #免费资源分享 #干货分享`;
    return note;
  },
  // Template 3: Category-focused
  (items) => {
    const cat = items[0].tag;
    const dateStr = today.replace(/-/g, '/');
    let note = `🔧 ${dateStr} | ${cat}爱好者必藏的${items.length}个免费神器\n\n`;
    note += `每一个都是心头好 ❤️\n`;
    note += `建议先收藏再看 📂\n\n`;
    items.forEach((item, i) => {
      note += `✅ ${item.title}\n`;
      note += `   ${item.desc}\n\n`;
    });
    note += `📮 每天更新实用工具，关注不迷路\n`;
    note += `🔗 主页点链接直达工具箱\n\n`;
    note += `#${cat} #免费工具 #效率提升 #实用推荐 #好物分享 #干货 #收藏 #打工人效率工具`;
    return note;
  },
  // Template 4: "Save this" style
  (items) => {
    const dateStr = today.replace(/-/g, '/');
    let note = `💎 ${dateStr}\n`;
    note += `刷到就是赚到！${items.length}个你可能不知道的免费工具\n\n`;
    note += `先❤️后看，不然刷着刷着就找不到了 👇\n\n`;
    note += `┌──────────────────┐\n`;
    items.forEach((item, i) => {
      note += `│ ${i + 1}  ${item.title}\n`;
      note += `│    ${item.desc.slice(0, 18)}\n`;
    });
    note += `└──────────────────┘\n\n`;
    note += `🎁 全部工具都在首页工具箱里\n`;
    note += `🔖 记得收藏，用的时候好找\n\n`;
    note += `#实用工具 #办公必备 #学生党福利 #程序员 #摸鱼必备 #免费好用的工具网站 #效率提升 #干货分享 #每天一个省钱小技巧 #隐藏功能`;
    return note;
  },
];

const templateIndex = (new Date().getDate() - 1) % xhsTemplates.length;

// Get items from feed (or the pool just created)
const currentItems = (feed.posts[0] && feed.posts[0].items) || toolPool[(new Date().getDate() - 1) % toolPool.length];
const xhsNote = xhsTemplates[templateIndex](currentItems);

fs.writeFileSync(xhsTodayFile, xhsNote);

// Also write a latest.md that's always the newest
const latestFile = path.join(xhsDir, 'latest.md');
fs.writeFileSync(latestFile, xhsNote);

console.log(`Generated XHS note (template ${templateIndex + 1}): ${today}`);
console.log(`XHS output: ${xhsTodayFile}`);
