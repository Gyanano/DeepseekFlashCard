import { config } from './config'
import { Question } from '@/types/quiz'

export class DeepseekAPI {
  private apiKey: string
  private baseUrl: string
  private model: string

  constructor() {
    this.apiKey = config.deepseek.apiKey
    this.baseUrl = config.deepseek.baseUrl
    this.model = config.deepseek.model
  }

  async generateQuestions(topic: string, count: number = 10): Promise<Question[]> {
    if (!this.apiKey) {
      throw new Error('Deepseek API Key 未配置')
    }

    const prompt = this.createQuestionPrompt(topic, count)

    try {
      console.log('正在调用中转站API:', this.baseUrl)
      
      // 尝试不同的API端点路径
      const possibleEndpoints = [
        '/chat/completions',
        '/v1/chat/completions', 
        '/api/chat/completions',
        '/deepseek/chat/completions'
      ]
      
      let lastError = null
      
      for (const endpoint of possibleEndpoints) {
        const fullUrl = `${this.baseUrl}${endpoint}`
        console.log('尝试端点:', fullUrl)
        
        try {
          const response = await fetch(fullUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
              model: this.model,
              messages: [
                {
                  role: 'system',
                  content: '你是一个专业的教育内容创建者，善于创建高质量的选择题。请严格按照要求的JSON格式返回答案，不要包含任何其他文本。'
                },
                {
                  role: 'user',
                  content: prompt
                }
              ],
              temperature: 0.7,
              max_tokens: 4000,
            }),
          })

          console.log(`${endpoint} 响应状态:`, response.status)
          
          // 先获取原始文本来调试
          const responseText = await response.text()
          console.log(`${endpoint} 原始响应前200字符:`, responseText.substring(0, 200))
          
          if (!response.ok) {
            console.log(`${endpoint} 失败，尝试下一个端点`)
            lastError = new Error(`${endpoint}: ${response.status} - ${responseText.substring(0, 200)}`)
            continue
          }

          // 检查响应是否是HTML
          if (responseText.trim().startsWith('<!doctype') || responseText.trim().startsWith('<html')) {
            console.log(`${endpoint} 返回HTML，尝试下一个端点`)
            lastError = new Error(`${endpoint} 返回了HTML而不是JSON`)
            continue
          }

          // 尝试解析JSON
          let data
          try {
            data = JSON.parse(responseText)
          } catch (parseError) {
            console.log(`${endpoint} JSON解析失败，尝试下一个端点`)
            lastError = parseError
            continue
          }
          
          const content = data.choices[0]?.message?.content

          if (!content) {
            console.log(`${endpoint} 内容为空，尝试下一个端点`)
            lastError = new Error(`${endpoint} 返回的内容为空`)
            continue
          }

          // 成功！解析JSON响应
          console.log(`${endpoint} 成功！`)
          return this.parseQuestionsResponse(content)
          
        } catch (fetchError) {
          const errorMsg = fetchError instanceof Error ? fetchError.message : String(fetchError)
          console.log(`${endpoint} 请求失败:`, errorMsg)
          lastError = fetchError instanceof Error ? fetchError : new Error(String(fetchError))
          continue
        }
      }
      
      // 所有端点都失败了
      throw lastError || new Error('所有API端点都失败了')
      
    } catch (error) {
      console.error('调用 Deepseek API 时出错:', error)
      throw error
    }
  }

  private createQuestionPrompt(topic: string, count: number): string {
    return `请为主题"${topic}"生成${count}道选择题。

要求：
1. 每道题有4个选项（A、B、C、D）
2. 题目要有一定的深度和挑战性
3. 答案要准确无误
4. 请包含简短的解释说明正确答案
5. 题目要覆盖该主题的不同方面

请严格按照以下JSON格式返回，不要包含任何其他文本：

{
  "questions": [
    {
      "id": 1,
      "question": "题目内容",
      "options": ["选项A", "选项B", "选项C", "选项D"],
      "correctAnswer": 0,
      "explanation": "解释为什么这个答案是正确的"
    }
  ]
}

注意：
- correctAnswer 是正确选项的索引（0-3）
- 请确保JSON格式正确
- 不要添加任何额外的文本或说明`
  }

  private parseQuestionsResponse(content: string): Question[] {
    try {
      // 清理响应内容，移除可能的代码块标记
      const cleanContent = content
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim()

      const parsed = JSON.parse(cleanContent)
      
      if (!parsed.questions || !Array.isArray(parsed.questions)) {
        throw new Error('响应格式不正确：缺少 questions 数组')
      }

      // 验证每个问题的格式
      const questions: Question[] = parsed.questions.map((q: any, index: number) => {
        if (!q.question || !Array.isArray(q.options) || q.options.length !== 4) {
          throw new Error(`问题 ${index + 1} 格式不正确`)
        }

        if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
          throw new Error(`问题 ${index + 1} 的正确答案索引无效`)
        }

        return {
          id: q.id || index + 1,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation || '',
        }
      })

      return questions
    } catch (error) {
      console.error('解析 Deepseek 响应时出错:', error)
      console.error('原始响应:', content)
      
      // 如果解析失败，返回一些示例问题
      return this.getFallbackQuestions()
    }
  }

  private getFallbackQuestions(): Question[] {
    return [
      {
        id: 1,
        question: "API 调用失败，这是一个示例问题。什么是人工智能？",
        options: [
          "模拟人类智能的计算机系统",
          "一种编程语言",
          "一种数据库",
          "一种网络协议"
        ],
        correctAnswer: 0,
        explanation: "人工智能是指模拟、延伸和扩展人的智能的理论、方法、技术及应用系统。"
      },
      {
        id: 2,
        question: "请检查您的 Deepseek API Key 配置。以下哪个不是机器学习的主要类型？",
        options: [
          "监督学习",
          "无监督学习",
          "强化学习",
          "直觉学习"
        ],
        correctAnswer: 3,
        explanation: "机器学习主要包括监督学习、无监督学习和强化学习三种类型。"
      }
    ]
  }

  // 测试API连接
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'user',
              content: '测试连接，请回复"连接成功"'
            }
          ],
          max_tokens: 10,
        }),
      })

      if (response.ok) {
        return { success: true, message: 'Deepseek API 连接成功' }
      } else {
        const errorData = await response.json().catch(() => ({}))
        return { 
          success: false, 
          message: `连接失败: ${response.status} - ${errorData.error?.message || '未知错误'}` 
        }
      }
    } catch (error) {
      return { 
        success: false, 
        message: `连接测试失败: ${error instanceof Error ? error.message : '未知错误'}` 
      }
    }
  }
}