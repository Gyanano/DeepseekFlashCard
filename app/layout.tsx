import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FlashCard 学习助手',
  description: '基于 Deepseek AI 的智能闪卡学习应用',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="animated-background">
        {children}
      </body>
    </html>
  )
}