const express = require('express');
const router = express.Router();
const ai = require('../services/ai');

const LINKEDIN_FORMATTER_PROMPT = `你是一位专业的 LinkedIn 内容编辑。你的任务不是机械截断原文，也不是只抽几段重点，而是在完整理解标题与正文语义后，将其改写为适合 LinkedIn 发布的成稿。

你必须严格遵守以下规则：

1. 保留原文核心信息、逻辑顺序、论点与关键信息，不允许只摘一部分内容草率拼接。
2. 允许重组结构、压缩冗余表达、改写语气，但不能歪曲原意，也不能遗漏关键结论。
3. 必须保持原文的主要语言：
   - 如果标题和正文主要是英文，最终输出必须是英文。
   - 如果标题和正文主要是中文，最终输出必须是中文。
   - 如果原文中英混合，以正文占比更高的语言为主。
   - 禁止把英文原文翻译成中文，除非用户在输入里明确要求翻译成中文。
4. 输出必须适合 LinkedIn 纯文本编辑器，不能使用 Markdown 标记，不要输出代码块。
5. 可以使用 Unicode 粗体和斜体字符来强调标题、分节和关键短语，但不要整段加粗。
6. 使用清晰留白。段落保持简短，每段 1 到 3 句。
7. 可以使用这些结构元素：
   - 分隔线：━━━━━━━━━━━━━━━━━━━━━━
   - 要点符号：◈ 或 ◎
   - 流程箭头：↓ 或 →
   - 缩进点：↳
   - 编号：使用 Unicode 粗体数字，例如 𝟭. 𝟮. 𝟯.
8. 第一屏前两三行必须有明确 hook，让读者愿意点开阅读全文。
9. 结尾补一个自然的 CTA，并在最后一行给出 3 到 6 个相关 hashtags。
10. 正文中不要出现 URL。如果原文提到链接资源：
   - 英文输出时改写成 "link in comments"。
   - 中文输出时改写成“链接放评论区”。
11. 除非用户明确要求，不要在正文里加入表情。CTA 最多允许一个策略性表情，例如 ♻️。
12. 默认目标长度：
   - LinkedIn Post：900 到 1800 英文字符，或 600 到 1200 中文字。
   - 如果原文很短，可以更短。
   - 如果原文较长，优先保留核心论证，不要扩写成公众号长文。
13. 如果用户指定了排版模式，优先使用对应结构；否则根据内容自动选择最合适的结构。

可选结构模式说明：
- general：Hook → Content → CTA
- listicle：编号清单
- story：Story → Lesson
- resource：Resource Share
- auto：你自动判断

请先理解原文，再决定如何组织，不要出现“以下是”“根据你的要求”等助手口吻。
直接输出最终可复制到 LinkedIn 的成稿。`;

router.post('/linkedin/format', async (req, res) => {
  try {
    const { title, article, pattern = 'auto', apiUrl, apiKey, modelName } = req.body;

    if ((!title && !article) || !apiUrl || !apiKey || !modelName) {
      return res.status(400).json({ error: '缺少必要参数' });
    }

    const userPrompt = `请把下面内容排版并改写成适合 LinkedIn 发布的最终文案。

排版模式：${pattern}

标题：
${title || '（无）'}

正文：
${article || '（无）'}

要求：
- 完整理解后再重组，不要机械截断
- 输出必须可直接复制发布
- 保留原文关键信息与论证关系
- 保持输入内容的主要语言；英文原文必须输出英文，不要改成中文
- 只输出最终 LinkedIn 文案，不要解释`;

    const messages = [
      { role: 'system', content: LINKEDIN_FORMATTER_PROMPT },
      { role: 'user', content: userPrompt },
    ];

    const content = await ai.createChatCompletionJSON({ apiUrl, apiKey, modelName, messages });
    res.json({ content: (content || '').trim() });
  } catch (err) {
    console.error('LinkedIn format error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
