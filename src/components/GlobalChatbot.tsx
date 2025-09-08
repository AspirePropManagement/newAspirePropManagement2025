'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

/**
 * GlobalChatbot component provides a sticky chat interface accessible from all pages
 * Implements the Single Responsibility Principle by only handling chat functionality
 * Enhanced with modern UI design and smooth animations
 */

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  requiresLogin?: boolean
}

const GlobalChatbot: React.FC = () => {
  const { user, userRole, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! I\'m Kriti, your property assistant. How can I help you today?',
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Set client-side flag to prevent hydration issues
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
      if (!hasOpened) {
        setHasOpened(true)
      }
    }
  }, [isOpen, hasOpened])

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = inputText.trim()
    setInputText('')
    setIsTyping(true)

    try {
      // Call OpenAI API with user authentication data
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: currentInput,
          userId: user?.id,
          userRole: userRole
        }),
      })

      const data = await response.json()

      // Handle login requirement
      if (data.requiresLogin) {
        const loginMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          isUser: false,
          timestamp: new Date(),
          requiresLogin: true
        }
        setMessages(prev => [...prev, loginMessage])
      } else {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          isUser: false,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, botResponse])
      }
    } catch (error) {
      console.error('Error calling chat API:', error)
      // Fallback response
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I\'m sorry, I\'m having trouble connecting right now. Please try again or contact our support team at +91 8080 190190',
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
    } finally {
      setIsTyping(false)
    }
  }

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }


  // Format time for display - consistent between server and client
  const formatTime = (date: Date): string => {
    // Use a consistent format that works the same on server and client
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'pm' : 'am'
    const displayHours = hours % 12 || 12
    const displayMinutes = minutes.toString().padStart(2, '0')
    return `${displayHours}:${displayMinutes} ${ampm}`
  }

  // Handle login button click
  const handleLoginClick = () => {
    router.push('/auth')
    setIsOpen(false)
  }

  // Handle suggestion chip click
  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Get suggestion chips based on user authentication status
  const getSuggestionChips = () => {
    if (isAuthenticated && user) {
      // Authenticated user suggestions
      if (userRole === 'AGENT') {
        return [
          'Show my properties',
          'Add new listing',
          'View inquiries',
          'Update property status'
        ]
      } else if (userRole === 'BUILDER') {
        return [
          'Show my projects',
          'Add new project',
          'View sales data',
          'Update construction status'
        ]
      } else if (userRole === 'BUYER') {
        return [
          'Show my favorites',
          'Find properties in Pune',
          'Calculate EMI',
          'Connect with agent'
        ]
      }
    }
    
    // Non-authenticated user suggestions
    return [
      'Find properties in Pune',
      'Calculate EMI',
      'View rental properties',
      'Connect with agent'
    ]
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group animate-chat-bounce ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
        title="Chat with Kriti"
      >
        <svg 
          className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
          />
        </svg>
        
        {/* Notification dot - only show if chat hasn't been opened */}
        {!hasOpened && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center animate-chat-pulse">
            <span className="text-xs font-bold text-white">1</span>
          </div>
        )}
      </button>

      {/* Chat Interface */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 transition-all duration-300 ${
          isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
        }`}
      >
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 bg-orange-500 text-white rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-sm">Kriti</h3>
              <p className="text-xs text-orange-100">Property Assistant • Online now</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 h-64 custom-scrollbar">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-message-slide-in`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                  message.isUser
                    ? 'bg-orange-500 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.text}</p>
                
                {/* Login Button for messages that require login */}
                {message.requiresLogin && (
                  <button
                    onClick={handleLoginClick}
                    className="mt-2 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                  >
                    Login Now
                  </button>
                )}
                
                <p className={`text-xs mt-1 ${
                  message.isUser ? 'text-orange-100' : 'text-gray-500'
                }`}>
                  {isClient ? formatTime(message.timestamp) : '--:--'}
                </p>
              </div>
            </div>
          ))}
          
          {/* Suggestion Chips - Show only when no messages or after first message */}
          {messages.length <= 1 && (
            <div className="flex justify-center">
              <div className="flex flex-wrap gap-2 justify-center max-w-xs">
                {getSuggestionChips().slice(0, 3).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-1 bg-orange-100 hover:bg-orange-200 text-orange-700 text-xs rounded-full transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg rounded-bl-sm max-w-xs">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isTyping}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default GlobalChatbot
