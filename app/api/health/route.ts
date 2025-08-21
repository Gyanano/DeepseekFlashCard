import { NextRequest, NextResponse } from 'next/server'
import { DeepseekAPI } from '@/lib/deepseek'
import { getConfigStatus } from '@/lib/config'

export async function GET() {
  try {
    const configStatus = getConfigStatus()
    
    // 如果配置无效，直接返回配置状态
    if (!configStatus.isValid) {
      return NextResponse.json({
        success: false,
        message: '配置验证失败',
        config: configStatus,
        timestamp: new Date().toISOString(),
      })
    }

    // 测试 Deepseek API 连接
    const deepseekAPI = new DeepseekAPI()
    const connectionTest = await deepseekAPI.testConnection()

    return NextResponse.json({
      success: connectionTest.success,
      message: connectionTest.message,
      config: configStatus,
      api: {
        baseUrl: process.env.DEEPSEEK_API_BASE_URL || 'https://api.deepseek.com/v1',
        model: 'deepseek-chat',
      },
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    console.error('健康检查 API 错误:', error)
    
    return NextResponse.json({
      success: false,
      message: `健康检查失败: ${error instanceof Error ? error.message : '未知错误'}`,
      config: getConfigStatus(),
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // 允许前端手动触发连接测试
    const body = await request.json()
    const { action } = body

    if (action === 'test-connection') {
      const deepseekAPI = new DeepseekAPI()
      const result = await deepseekAPI.testConnection()
      
      return NextResponse.json({
        success: result.success,
        message: result.message,
        timestamp: new Date().toISOString(),
      })
    }

    return NextResponse.json(
      { error: '无效的操作' },
      { status: 400 }
    )

  } catch (error) {
    console.error('健康检查 POST 错误:', error)
    
    return NextResponse.json({
      success: false,
      message: `操作失败: ${error instanceof Error ? error.message : '未知错误'}`,
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}