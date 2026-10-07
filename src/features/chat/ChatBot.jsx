import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * ChatBot Component (Floating AI Assistant for Portfolio)
 * 
 * Features:
 * - Floating action button with pulse animation & glow effect
 * - Responsive glassmorphism popup card (dark slate & blue accent)
 * - Quick prompt suggestion chips for fast discovery
 * - Supports markdown-style bold and bullet points formatting
 * - Auto-scroll on new messages
 * - Graceful loading state and error handling
 */
export default function ChatBot() {
  const { i18n } = useTranslation()
  const isEn = i18n.language === 'en'

  const [isOpen, setIsOpen] = useState(false)
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: isEn
        ? "Hello! 👋 I'm the AI Assistant for Dương Đoàn Thuận's Portfolio. Feel free to ask me anything about his skills, backend experience, or projects!"
        : "Xin chào! 👋 Tôi là trợ lý AI cho Portfolio của Dương Đoàn Thuận. Bạn có thể hỏi tôi bất kỳ điều gì về kỹ năng, kinh nghiệm backend hoặc các dự án của Thuận!",
    },
  ])

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Quick suggestions based on active language
  const suggestions = isEn
    ? [
      "Where can I download Master CV and Transcript?",
      "What are Thuận's core skills?",
      "Tell me about his experience at FPT",
      "What key projects has he built?",
      "How can I contact Thuận?",
    ]
    : [
      "Làm sao để tải Master CV và Bảng điểm của Thuận?",
      "Thuận có những kỹ năng chính nào?",
      "Kinh nghiệm làm việc tại FPT Software?",
      "Các dự án tiêu biểu của Thuận?",
      "Thông tin liên hệ với Thuận?",
    ]

  // Auto scroll to bottom whenever messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen, isLoading])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [isOpen])

  // Send message handler
  const handleSendMessage = async (customText = null) => {
    const textToSend = typeof customText === 'string' ? customText.trim() : inputMessage.trim()
    if (!textToSend || isLoading) return

    const userMessageId = `user-${Date.now()}`
    const newUserMsg = {
      id: userMessageId,
      sender: 'user',
      text: textToSend,
    }

    setMessages((prev) => [...prev, newUserMsg])
    setInputMessage('')
    setIsLoading(true)

    // API URL from env or deployed Cloudflare Worker endpoint
    const API_ENDPOINT =
      import.meta.env.VITE_API_CHAT_URL ||
      'https://portfolio-gemini-worker.ayana0409-porfolio.workers.dev/api/chat'

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: textToSend }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.reply || data.error || (isEn ? 'Failed to connect to AI assistant' : 'Không thể kết nối đến trợ lý AI'))
      }

      const aiReply = data.reply || (isEn ? 'No response received.' : 'Không nhận được phản hồi.')

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: aiReply,
        },
      ])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text:
            error.message ||
            (isEn
              ? 'Sorry, a temporary issue occurred. Please try again later.'
              : 'Xin lỗi, đã xảy ra sự cố tạm thời. Vui lòng thử lại sau.'),
          isError: true,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Enter keypress in input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Clear chat history
  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        text: isEn
          ? "Conversation cleared. How can I assist you?"
          : "Đã làm mới đoạn chat. Bạn muốn tìm hiểu thêm thông tin gì về Thuận?",
      },
    ])
  }

  // Helper to format inline markdown elements: **bold**, `code`, [link](url), raw URLs
  const formatInlineText = (text) => {
    if (!text) return null

    // Regex to detect markdown links [label](url), bold text **text**, inline code `code`, or bare URLs
    const tokenRegex = /(\[[^\]]+\]\([^\s)]+\)|\*\*.*?\*\*|`.*?`|https?:\/\/[^\s)]+)/g
    const parts = text.split(tokenRegex)

    return parts.map((part, index) => {
      if (!part) return null

      // 1. Markdown link [text](url) - supports https, http, mailto, etc.
      const mdLinkMatch = part.match(/^\[([^\]]+)\]\(([^\s)]+)\)$/)
      if (mdLinkMatch) {
        const [, label, url] = mdLinkMatch
        const isExternal = url.startsWith('http://') || url.startsWith('https://')
        return (
          <a
            key={index}
            href={url}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="text-blue-400 hover:text-blue-300 underline underline-offset-2 break-all font-medium inline-flex items-center gap-0.5"
          >
            <span>{label}</span>
            {isExternal && <span className="text-[10px] select-none">↗</span>}
          </a>
        )
      }

      // 2. Bold **text**
      if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        return (
          <strong key={index} className="font-semibold text-blue-300">
            {part.slice(2, -2)}
          </strong>
        )
      }

      // 3. Inline code `code`
      if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
        return (
          <code key={index} className="px-1 py-0.5 rounded bg-slate-950/60 border border-slate-700 text-blue-300 font-mono text-[11px]">
            {part.slice(1, -1)}
          </code>
        )
      }

      // 4. Raw URL https://...
      if (/^https?:\/\/[^\s)]+$/.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline underline-offset-2 break-all inline-flex items-center gap-0.5"
          >
            <span>{part}</span>
            <span className="text-[10px] select-none">↗</span>
          </a>
        )
      }

      return part
    })
  }

  // Formatter for markdown lines (bullet points, numbered lists, paragraphs)
  const renderFormattedText = (text) => {
    if (!text) return null

    const lines = text.split('\n')

    return lines.map((line, lineIndex) => {
      const trimmed = line.trim()

      // Empty line -> vertical spacing
      if (!trimmed) {
        return <div key={lineIndex} className="h-1.5" />
      }

      // Bullet points (* item, - item, • item)
      if (/^(\*|-|•)\s+/.test(trimmed)) {
        const cleanContent = trimmed.replace(/^(\*|-|•)\s+/, '')
        return (
          <div key={lineIndex} className="flex items-start gap-2 my-0.5 ml-1">
            <span className="text-blue-400 mt-0.5 text-xs select-none">•</span>
            <div className="flex-1">{formatInlineText(cleanContent)}</div>
          </div>
        )
      }

      // Numbered list item (1. item, 2. item)
      const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/)
      if (numMatch) {
        const [, num, numContent] = numMatch
        return (
          <div key={lineIndex} className="flex items-start gap-1.5 my-1 ml-0.5">
            <span className="font-semibold text-blue-300 text-xs select-none shrink-0">{num}.</span>
            <div className="flex-1">{formatInlineText(numContent)}</div>
          </div>
        )
      }

      // Standard text line
      return (
        <div key={lineIndex} className="leading-relaxed">
          {formatInlineText(line)}
        </div>
      )
    })
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* ─── 1. Chat Window ──────────────────────────────────────────────── */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[410px] h-[540px] max-h-[82vh] bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4 transition-all duration-300 animate-in fade-in zoom-in-95">
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-900 animate-pulse"></span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
                  <span>AI Portfolio Assistant</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Edge
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  {isEn ? 'Instant Q&A grounded in Portfolio' : 'Hỏi đáp tức thì về Thuận'}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearChat}
                title={isEn ? "Clear conversation" : "Làm mới hội thoại"}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title={isEn ? "Close chat" : "Đóng"}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user'
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 text-xs mt-0.5">
                      AI
                    </div>
                  )}

                  <div
                    className={`max-w-[84%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${isUser
                        ? 'bg-blue-600 text-white rounded-tr-none font-normal'
                        : msg.isError
                          ? 'bg-red-950/40 text-red-200 border border-red-800/50 rounded-tl-none'
                          : 'bg-slate-800/90 text-slate-100 border border-slate-700/60 rounded-tl-none'
                      }`}
                  >
                    {renderFormattedText(msg.text)}
                  </div>
                </div>
              )
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 text-xs">
                  AI
                </div>
                <div className="bg-slate-800/90 border border-slate-700/60 text-slate-400 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></span>
                  <span className="text-xs ml-1.5 text-slate-400">
                    {isEn ? 'Thinking...' : 'Đang suy nghĩ...'}
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions (Shown if only 1 welcome message) */}
          {messages.length <= 1 && (
            <div className="px-3 py-2 bg-slate-950/40 border-t border-slate-800/60 flex flex-wrap gap-1.5">
              {suggestions.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(prompt)}
                  className="text-[11px] text-slate-300 bg-slate-800/70 hover:bg-blue-600/30 hover:text-blue-200 border border-slate-700/60 hover:border-blue-500/50 rounded-full px-2.5 py-1 transition-all text-left"
                >
                  💡 {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 bg-slate-900/90 border-t border-slate-700/60">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage()
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isEn
                    ? "Ask about Thuận's skills, projects..."
                    : "Hỏi về kinh nghiệm, kỹ năng của Thuận..."
                }
                disabled={isLoading}
                className="flex-1 bg-slate-800/90 text-slate-100 placeholder-slate-400 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white p-2.5 rounded-xl transition-all shadow-md flex items-center justify-center shrink-0"
                title={isEn ? "Send message" : "Gửi tin nhắn"}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─── 2. Floating Action Button (FAB) ─────────────────────────────── */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="group relative flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 active:scale-95 border border-blue-400/30"
        aria-label={isEn ? "Chat with AI" : "Trò chuyện với AI"}
      >
        {/* Glow pulsing ring behind button */}
        <span className="absolute -inset-0.5 rounded-full bg-blue-500 opacity-40 blur group-hover:opacity-75 transition duration-300 animate-pulse"></span>

        <span className="relative flex items-center gap-2 text-sm font-medium">
          {isOpen ? (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>{isEn ? 'Close AI' : 'Đóng AI'}</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span>{isEn ? 'Assistant' : 'Hỗ trợ'}</span>
            </>
          )}
        </span>
      </button>
    </div>
  )
}
