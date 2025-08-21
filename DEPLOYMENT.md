# 🚀 Vercel 部署指南

## 准备工作

1. **注册 Vercel 账号**: 访问 [vercel.com](https://vercel.com) 并注册
2. **获取 Deepseek API Key**: 访问 [deepseek.com](https://www.deepseek.com) 获取 API Key

## 部署步骤

### 方法一：GitHub 自动部署（推荐）

1. **上传代码到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "初始化 FlashCard 应用"
   git remote add origin <你的仓库地址>
   git push -u origin main
   ```

2. **连接 Vercel**
   - 登录 [Vercel Dashboard](https://vercel.com/dashboard)
   - 点击 "New Project"
   - 选择从 GitHub 导入
   - 选择您的仓库

3. **配置环境变量**
   在 Vercel 部署界面的 "Environment Variables" 部分添加：
   
   | Name | Value |
   |------|-------|
   | `DEEPSEEK_API_KEY` | 您的 Deepseek API Key |
   | `NEXT_PUBLIC_APP_NAME` | FlashCard 学习助手 |
   | `NEXT_PUBLIC_MAX_QUESTIONS` | 10 |

4. **部署**
   - 点击 "Deploy" 按钮
   - 等待构建完成（通常 2-3 分钟）

### 方法二：Vercel CLI 部署

1. **安装 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   ```

3. **首次部署**
   ```bash
   vercel
   ```
   按照提示操作：
   - Project name: `flashcard-app`
   - Directory: `./` (当前目录)
   - Framework: `Next.js`

4. **设置环境变量**
   ```bash
   # 设置 Deepseek API Key
   vercel env add DEEPSEEK_API_KEY
   # 输入您的 API Key

   # 设置应用名称
   vercel env add NEXT_PUBLIC_APP_NAME
   # 输入: FlashCard 学习助手

   # 设置最大题目数
   vercel env add NEXT_PUBLIC_MAX_QUESTIONS
   # 输入: 10
   ```

5. **重新部署**
   ```bash
   vercel --prod
   ```

## 验证部署

1. **访问应用**: 点击 Vercel 提供的 URL
2. **测试 API**: 访问 `<你的域名>/api/health` 检查 API 状态
3. **创建测验**: 输入一个学习主题并开始测验

## 自定义域名（可选）

1. 在 Vercel Dashboard 中选择您的项目
2. 进入 "Settings" > "Domains"
3. 添加您的自定义域名
4. 按照提示配置 DNS

## 环境管理

### 开发环境
```bash
vercel env add DEEPSEEK_API_KEY development
```

### 预览环境
```bash
vercel env add DEEPSEEK_API_KEY preview
```

### 生产环境
```bash
vercel env add DEEPSEEK_API_KEY production
```

## 常见问题

### Q: 部署后显示 API Key 错误
**A**: 检查环境变量是否正确设置，注意区分大小写。

### Q: 构建失败
**A**: 确保 `package.json` 中的依赖版本正确，Node.js 版本建议使用 18+。

### Q: API 调用超时
**A**: Vercel 的 Serverless 函数默认超时时间较短，已在 `vercel.json` 中设置为 30 秒。

### Q: 如何查看日志
**A**: 在 Vercel Dashboard 的 "Functions" 标签页可以查看实时日志。

## 更新应用

### GitHub 自动部署
推送到 main 分支即可自动部署：
```bash
git add .
git commit -m "更新功能"
git push origin main
```

### CLI 手动部署
```bash
vercel --prod
```

## 性能优化

1. **启用缓存**: Vercel 自动启用静态文件缓存
2. **压缩响应**: 已配置 gzip 压缩
3. **边缘函数**: API 路由自动部署到边缘节点

## 监控和分析

1. 在 Vercel Dashboard 查看：
   - 部署状态
   - 性能指标
   - 错误日志
   - 使用量统计

## 安全注意事项

1. **API Key 安全**: 
   - 绝不要在前端代码中暴露 API Key
   - 定期轮换 API Key

2. **环境变量**:
   - 使用 Vercel 的环境变量管理
   - 避免在代码中硬编码敏感信息

3. **域名安全**:
   - 建议使用 HTTPS（Vercel 自动提供）
   - 考虑添加安全头部

---

🎉 **恭喜！您的 FlashCard 应用已成功部署到 Vercel！**