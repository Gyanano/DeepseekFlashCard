export interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

export interface Quiz {
  topic: string
  questions: Question[]
  totalQuestions: number
}

export interface UserAnswer {
  questionId: number
  selectedOption: number
  isCorrect: boolean
  timeSpent: number
}

export interface QuizResult {
  score: number
  totalQuestions: number
  correctAnswers: number
  userAnswers: UserAnswer[]
  completionTime: number
  percentage: number
}