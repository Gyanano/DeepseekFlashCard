# 🎴 FlashCard 学习助手

基于 Deepseek AI 的智能闪卡学习应用，复刻 ChatGPT 的闪卡功能。

![FlashCard Demo](https://img.shields.io/badge/Demo-Live-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-cyan)

## ✨ 功能特点

- 🤖 **AI 驱动**: 使用 Deepseek API 智能生成个性化学习问题
- 🎨 **精美界面**: 仿照 ChatGPT 闪卡设计，支持动画效果
- 📱 **响应式设计**: 完美适配桌面端和移动端
- ⚡ **快速部署**: 一键部署到 Vercel，只需配置 API Key
- 🎯 **智能评分**: 实时反馈和详细解释
- 🔧 **易于配置**: 简单的环境变量配置

## 🚀 快速开始

### 1. 获取 Deepseek API Key

1. 访问 [Deepseek 官网](https://www.deepseek.com/)
2. 注册账号并获取 API Key
3. 保存您的 API Key，稍后需要用到

### 2. 本地开发

```bash
# 克隆项目
git clone <项目地址>
cd Demo12_FlashCard

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local

# 编辑 .env.local 文件，填入您的 Deepseek API Key
# DEEPSEEK_API_KEY=your_deepseek_api_key_here

# 启动开发服务器
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 3. 部署到 Vercel

#### 方法一：通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 部署
vercel

# 设置环境变量
vercel env add DEEPSEEK_API_KEY
# 输入您的 Deepseek API Key

vercel env add NEXT_PUBLIC_APP_NAME
# 输入: FlashCard 学习助手

vercel env add NEXT_PUBLIC_MAX_QUESTIONS  
# 输入: 10
```

#### 方法二：通过 Vercel Dashboard

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "New Project"
3. 导入您的 Git 仓库
4. 在 "Environment Variables" 中添加：
   - `DEEPSEEK_API_KEY`: 您的 Deepseek API Key
   - `NEXT_PUBLIC_APP_NAME`: FlashCard 学习助手
   - `NEXT_PUBLIC_MAX_QUESTIONS`: 10
5. 点击 "Deploy"

## ⚙️ 配置说明

### 环境变量

| 变量名 | 必需 | 默认值 | 说明 |
|--------|------|--------|------|
| `DEEPSEEK_API_KEY` | ✅ | - | Deepseek API 密钥 |
| `NEXT_PUBLIC_APP_NAME` | ❌ | FlashCard 学习助手 | 应用名称 |
| `NEXT_PUBLIC_MAX_QUESTIONS` | ❌ | 10 | 每次测验最大题目数 |
| `DEEPSEEK_API_BASE_URL` | ❌ | https://api.deepseek.com/v1 | API 基础 URL |

### 自定义配置

编辑 `lib/config.ts` 文件可以自定义更多配置：

```typescript
export const config = {
  quiz: {
    defaultQuestionCount: 10,    // 默认问题数量
    minQuestionCount: 5,         // 最少问题数量
    maxQuestionCount: 15,        // 最多问题数量
    difficulty: 'mixed',         // 难度级别
  },
}
```

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **图标**: Lucide React
- **AI**: Deepseek API
- **部署**: Vercel

## 📁 项目结构

```
flashcard-app/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   ├── generate-questions/
│   │   └── health/
│   ├── quiz/              # 闪卡页面
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页
├── lib/                   # 工具库
│   ├── config.ts          # 配置管理
│   └── deepseek.ts        # Deepseek API 客户端
├── types/                 # TypeScript 类型定义
│   └── quiz.ts
├── .env.example           # 环境变量示例
├── .env.local             # 本地环境变量
└── vercel.json            # Vercel 配置
```

## 🎮 使用说明

1. **输入主题**: 在首页输入您想学习的主题
2. **开始测验**: AI 会生成相关的选择题
3. **答题**: 选择您认为正确的答案
4. **查看结果**: 获得实时反馈和详细解释
5. **完成测验**: 查看最终得分和统计

## 🔧 故障排除

### 常见问题

1. **API Key 错误**
   - 确保 Deepseek API Key 正确配置
   - 检查 API Key 是否有效且有足够额度

2. **部署失败**
   - 检查所有环境变量是否正确设置
   - 确保 Node.js 版本兼容 (推荐 18+)

3. **生成问题失败**
   - 检查网络连接
   - 尝试使用更具体的学习主题

### 调试工具

访问 `/api/health` 可以检查 API 状态和配置。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- [Deepseek](https://www.deepseek.com/) - 提供强大的 AI 能力
- [Vercel](https://vercel.com/) - 优秀的部署平台
- [Next.js](https://nextjs.org/) - 强大的 React 框架

---

**开始您的智能学习之旅吧！** 🚀