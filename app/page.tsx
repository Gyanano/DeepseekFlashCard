'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { BookOpen, Sparkles, ArrowRight } from 'lucide-react'

export default function Home() {
  const [topic, setTopic] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleStartQuiz = async () => {
    if (!topic.trim()) return
    
    setIsLoading(true)
    try {
      // 导航到闪卡页面，传递主题参数
      router.push(`/quiz?topic=${encodeURIComponent(topic)}`)
    } catch (error) {
      console.error('启动测验时出错:', error)
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleStartQuiz()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flashcard w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-4"
          >
            <Sparkles className="w-12 h-12 text-purple-600" />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            FlashCard 学习助手
          </h1>
          <p className="text-gray-600">
            基于 Deepseek AI 的智能闪卡学习体验
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-3">
              <BookOpen className="inline w-5 h-5 mr-2" />
              请输入您想学习的主题：
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="例如：人工智能基础知识、JavaScript编程、数据结构等..."
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors duration-200"
              disabled={isLoading}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStartQuiz}
            disabled={!topic.trim() || isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium py-4 px-6 rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <>
                <span>开始学习</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>AI 将根据您的主题生成个性化的学习卡片</p>
        </div>
      </motion.div>
    </div>
  )
}