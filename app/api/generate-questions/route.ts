import { NextRequest, NextResponse } from 'next/server'
import { DeepseekAPI } from '@/lib/deepseek'
import { validateConfig } from '@/lib/config'

export async function POST(request: NextRequest) {
  try {
    // 验证配置
    const configValidation = validateConfig()
    if (!configValidation.isValid) {
      return NextResponse.json(
        { 
          error: '服务配置错误', 
          details: configValidation.errors 
        },
        { status: 500 }
      )
    }

    // 解析请求体
    const body = await request.json()
    const { topic } = body

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return NextResponse.json(
        { error: '请提供有效的学习主题' },
        { status: 400 }
      )
    }

    if (topic.length > 200) {
      return NextResponse.json(
        { error: '主题长度不能超过200个字符' },
        { status: 400 }
      )
    }

    // 初始化 Deepseek API
    const deepseekAPI = new DeepseekAPI()

    // 生成问题
    const questions = await deepseekAPI.generateQuestions(topic.trim(), 10)

    if (!questions || questions.length === 0) {
      return NextResponse.json(
        { error: '无法为此主题生成问题，请尝试其他主题' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      topic: topic.trim(),
      questions,
      totalQuestions: questions.length,
      generatedAt: new Date().toISOString(),
    })

  } catch (error) {
    console.error('生成问题 API 错误:', error)
    
    // 根据错误类型返回不同的响应
    if (error instanceof Error) {
      if (error.message.includes('API Key')) {
        return NextResponse.json(
          { error: 'API 配置错误，请检查 Deepseek API Key' },
          { status: 500 }
        )
      }
      
      if (error.message.includes('网络') || error.message.includes('fetch')) {
        return NextResponse.json(
          { error: '网络连接错误，请稍后重试' },
          { status: 503 }
        )
      }
    }

    return NextResponse.json(
      { error: '生成问题时发生内部错误，请稍后重试' },
      { status: 500 }
    )
  }
}

// 处理 GET 请求 - 返回 API 状态
export async function GET() {
  try {
    const configValidation = validateConfig()
    
    return NextResponse.json({
      status: 'ok',
      service: '问题生成 API',
      version: '1.0.0',
      config: {
        isValid: configValidation.isValid,
        hasApiKey: !!process.env.DEEPSEEK_API_KEY,
        errors: configValidation.errors,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'API 状态检查失败' },
      { status: 500 }
    )
  }
}