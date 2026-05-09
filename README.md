# 内容写作台 / AutoWriting

一个面向内容生产的本地写作工具，覆盖正文生成、标题摘要、封面生成、LinkedIn 排版，以及正文 Markdown 导出。

## 当前功能

- 正文生成：基于写作风格流式生成文章正文
- 标题摘要：根据正文生成多组标题和摘要
- 封面生成：提炼关键点、生成封面 Prompt，并调用图片模型出图
- LinkedIn 排版：基于 AI 理解原文语义后，重写成适合 LinkedIn 发布的文案
- Markdown 导出：正文可直接下载为 `.md`
- 模型设置分离：文本模型与图片模型可分别配置
- 风格可扩展：在 `styles/` 目录增加 `.txt` 文件即可扩展写作风格

## 界面说明

当前前端包含两个独立工作区：

1. `写作台`
   - 输入主题与要求
   - 选择写作风格
   - 生成正文、标题摘要、封面
   - 支持复制正文、下载 Markdown
2. `LinkedIn 排版`
   - 粘贴标题和正文
   - 选择排版模式
   - 调用文本模型生成适合 LinkedIn 的最终文案

## 快速开始

要求：

- Node.js >= 18

安装与启动：

```bash
git clone https://github.com/galong/AutoWriting.git
cd AutoWriting
npm install
npm start
```

启动后访问：

- [http://localhost:3000](http://localhost:3000)

开发模式：

```bash
npm run dev
```

## 配置说明

首次打开页面会弹出模型设置。

需要配置两组模型：

1. 文本模型
   - 用于正文生成
   - 用于标题摘要生成
   - 用于封面 Prompt 生成
   - 用于 LinkedIn 排版
2. 图片模型
   - 用于封面图片生成

配置项：

- `API URL`
- `API Key`
- `模型名称`

说明：

- 设置保存在浏览器 `localStorage`
- 服务端不保存 API Key
- 支持 OpenAI 兼容接口
- 文本模型和图片模型可来自不同厂商

## 使用流程

### 写作台

1. 打开模型设置，填写文本模型和图片模型
2. 输入主题与要求
3. 选择写作风格
4. 点击 `生成正文`
5. 可选：
   - 点击 `复制正文`
   - 点击 `下载 Markdown`
6. 点击 `生成标题摘要`
7. 点击 `生成封面`
8. 选择 Prompt 并生成、下载封面图

### LinkedIn 排版

1. 切换到 `LinkedIn 排版`
2. 粘贴标题和正文
3. 选择排版模式：
   - `自动判断`
   - `Hook → 内容 → CTA`
   - `编号清单`
   - `故事 → 观点`
   - `资源分享`
4. 点击 `生成 LinkedIn 文案`
5. 复制结果后直接发布

## 已内置写作风格

当前仓库已包含这些风格：

- `科技媒体评论`
- `公众号长文`
- `现象解读`
- `工具体验`
- `方法论长文`

新增风格方式：

```text
styles/
  你的风格名称.txt
```

规则：

- 文件名会作为风格名称显示在前端下拉框中
- 文件内容应为完整的写作 Prompt
- 新增后重启服务即可生效

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/styles` | 获取可用写作风格 |
| POST | `/api/article` | 流式生成正文（SSE） |
| POST | `/api/titles` | 生成标题与摘要 |
| POST | `/api/cover/prompts` | 根据正文生成封面 Prompt |
| POST | `/api/cover/generate` | 根据 Prompt 生成封面图 |
| GET | `/api/cover/proxy?url=` | 代理图片显示 |
| POST | `/api/cover/proxy` | 代理图片下载 |
| POST | `/api/linkedin/format` | 基于原文语义生成 LinkedIn 文案 |

## 项目结构

```text
AutoWriting/
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   └── index.html
├── server/
│   ├── routes/
│   │   ├── article.js
│   │   ├── cover.js
│   │   ├── linkedin.js
│   │   └── titles.js
│   ├── services/
│   │   ├── ai.js
│   │   └── styleLoader.js
│   └── index.js
├── styles/
├── package.json
└── README.md
```

## 技术栈

- 后端：Node.js + Express
- 前端：原生 HTML + Tailwind CSS
- 文本输出：SSE 流式返回
- 模型协议：OpenAI 兼容接口

## 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `PORT` | `3000` | 本地服务端口 |

## 注意事项

- 这个项目不是纯静态页面，必须通过本地服务访问，不能直接用 `file://` 打开 `public/index.html`
- LinkedIn 排版功能依赖文本模型，不是前端本地规则转换
- 图片生成能力取决于你配置的图片模型是否支持同步返回图片

## License

MIT
