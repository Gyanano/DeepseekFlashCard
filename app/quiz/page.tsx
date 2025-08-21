'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Clock, CheckCircle, XCircle, RotateCcw, Home } from 'lucide-react'
import { Question, QuizResult, UserAnswer } from '@/types/quiz'

export default function QuizPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const topic = searchParams.get('topic') || ''

  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now())

  // 获取问题
  useEffect(() => {
    if (topic) {
      fetchQuestions()
    }
  }, [topic])

  const fetchQuestions = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      })

      if (!response.ok) {
        throw new Error('生成问题失败')
      }

      const data = await response.json()
      setQuestions(data.questions)
      setStartTime(Date.now())
      setQuestionStartTime(Date.now())
    } catch (error) {
      console.error('获取问题时出错:', error)
      alert('生成问题时出错，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOptionSelect = (optionIndex: number) => {
    if (showAnswer) return
    setSelectedOption(optionIndex)
  }

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return

    const currentQuestion = questions[currentQuestionIndex]
    const isCorrect = selectedOption === currentQuestion.correctAnswer
    const timeSpent = Date.now() - questionStartTime

    const userAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedOption,
      isCorrect,
      timeSpent,
    }

    setUserAnswers(prev => [...prev, userAnswer])
    setShowAnswer(true)

    // 2秒后自动进入下一题
    setTimeout(() => {
      nextQuestion()
    }, 2000)
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedOption(null)
      setShowAnswer(false)
      setQuestionStartTime(Date.now())
    } else {
      // 测验完成
      setQuizCompleted(true)
    }
  }

  const calculateResult = (): QuizResult => {
    const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length
    const totalQuestions = questions.length
    const percentage = Math.round((correctAnswers / totalQuestions) * 100)
    const completionTime = Date.now() - startTime

    return {
      score: correctAnswers,
      totalQuestions,
      correctAnswers,
      userAnswers,
      completionTime,
      percentage,
    }
  }

  const restartQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedOption(null)
    setShowAnswer(false)
    setUserAnswers([])
    setQuizCompleted(false)
    setStartTime(Date.now())
    setQuestionStartTime(Date.now())
  }

  const goHome = () => {
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flashcard text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">正在生成问题...</h2>
          <p className="text-gray-500">AI 正在为「{topic}」创建个性化学习卡片</p>
        </motion.div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flashcard text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">生成问题失败</h2>
          <p className="text-gray-500 mb-4">无法为此主题生成问题，请尝试其他主题</p>
          <button
            onClick={goHome}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            返回首页
          </button>
        </div>
      </div>
    )
  }

  if (quizCompleted) {
    const result = calculateResult()
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flashcard text-center"
        >
          <div className="mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="text-4xl mb-4"
            >
              {result.percentage >= 80 ? '🎉' : result.percentage >= 60 ? '👏' : '💪'}
            </motion.div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {result.percentage >= 80 ? 'Excellent work! You nailed it.' : 
               result.percentage >= 60 ? 'Good job! Keep it up!' : 
               'Keep learning! You can do better!'}
            </h2>
            
            <div className="text-lg font-semibold text-gray-600 mb-4">
              {result.correctAnswers} / {result.totalQuestions}
            </div>
            
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-600 mb-2">正确率</div>
              <div className="text-3xl font-bold text-purple-600">
                {result.percentage}%
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={restartQuiz}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium py-3 px-6 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>再来一次</span>
            </button>
            
            <button
              onClick={goHome}
              className="w-full bg-gray-600 text-white font-medium py-3 px-6 rounded-xl hover:bg-gray-700 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Home className="w-5 h-5" />
              <span>返回首页</span>
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* 头部进度条 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={goHome}
              className="flex items-center space-x-2 text-white hover:text-white/80 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>返回</span>
            </button>
            
            <div className="flex items-center space-x-2 text-white">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                {currentQuestionIndex + 1} / {questions.length}
              </span>
            </div>
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-2">
            <motion.div
              className="bg-white rounded-full h-2"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* 问题卡片 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="flashcard"
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 leading-relaxed">
                {currentQuestion.question}
              </h2>
            </div>

            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option, index) => {
                let buttonClass = "option-button"
                
                if (showAnswer) {
                  if (index === currentQuestion.correctAnswer) {
                    buttonClass += " correct"
                  } else if (index === selectedOption && index !== currentQuestion.correctAnswer) {
                    buttonClass += " incorrect"
                  }
                } else if (selectedOption === index) {
                  buttonClass += " selected"
                }

                return (
                  <motion.button
                    key={index}
                    onClick={() => handleOptionSelect(index)}
                    className={buttonClass}
                    whileHover={!showAnswer ? { scale: 1.02 } : {}}
                    whileTap={!showAnswer ? { scale: 0.98 } : {}}
                    disabled={showAnswer}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full border-2 border-gray-400 flex items-center justify-center text-sm font-medium">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="flex-1">{option}</span>
                      {showAnswer && index === currentQuestion.correctAnswer && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      {showAnswer && index === selectedOption && index !== currentQuestion.correctAnswer && (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* 提交按钮 */}
            {!showAnswer && (
              <motion.button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium py-3 px-6 rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                whileHover={selectedOption !== null ? { scale: 1.02 } : {}}
                whileTap={selectedOption !== null ? { scale: 0.98 } : {}}
              >
                提交答案
              </motion.button>
            )}

            {/* 答案解释 */}
            {showAnswer && currentQuestion.explanation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
              >
                <div className="text-sm font-medium text-blue-800 mb-1">解释：</div>
                <div className="text-sm text-blue-700">{currentQuestion.explanation}</div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}