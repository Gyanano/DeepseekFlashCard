// 配置管理工具
export const config = {
  // Deepseek API 配置
  deepseek: {
    apiKey: process.env.DEEPSEEK_API_KEY || '',
    baseUrl: process.env.DEEPSEEK_API_BASE_URL || 'https://api.deepseek.com',
    model: 'deepseek-chat', // Deepseek 的模型名称
  },
  
  // 应用配置
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'FlashCard 学习助手',
    maxQuestions: parseInt(process.env.NEXT_PUBLIC_MAX_QUESTIONS || '10'),
  },
  
  // 问题生成配置
  quiz: {
    defaultQuestionCount: 10,
    minQuestionCount: 5,
    maxQuestionCount: 15,
    questionTypes: ['multiple-choice'],
    difficulty: 'mixed', // easy, medium, hard, mixed
  },
}

// 验证配置
export function validateConfig() {
  const errors: string[] = []
  
  if (!config.deepseek.apiKey) {
    errors.push('DEEPSEEK_API_KEY 环境变量未设置')
  }
  
  if (!config.deepseek.baseUrl) {
    errors.push('DEEPSEEK_API_BASE_URL 环境变量未设置')
  }
  
  if (config.app.maxQuestions < 1 || config.app.maxQuestions > 50) {
    errors.push('NEXT_PUBLIC_MAX_QUESTIONS 应该在 1-50 之间')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

// 获取运行时配置状态
export function getConfigStatus() {
  const validation = validateConfig()
  
  return {
    ...validation,
    environment: process.env.NODE_ENV || 'development',
    hasApiKey: !!config.deepseek.apiKey,
    apiKeyMasked: config.deepseek.apiKey 
      ? `${config.deepseek.apiKey.slice(0, 8)}...${config.deepseek.apiKey.slice(-4)}`
      : '未设置',
  }
}