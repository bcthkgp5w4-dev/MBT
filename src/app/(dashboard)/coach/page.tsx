'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Brain, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

const STARTER_PROMPTS = [
  'My child screams when I turn off YouTube. What should I do?',
  'How do I teach my nonverbal child to communicate?',
  'My child has major meltdowns at transitions. Any strategies?',
  'What ABA techniques work best at home?',
  'How can I help my child make friends at school?',
]

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm the MBT AI Coach. I'm here to provide evidence-based guidance and support for families navigating autism.\n\nI can help you understand behaviors, suggest strategies, explain therapy approaches, and provide coaching on daily challenges.\n\n**How can I support you today?**\n\n*Remember: I provide educational support — not medical diagnosis or treatment.*",
      timestamp: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [children, setChildren] = useState<any[]>([])
  const [selectedChild, setSelectedChild] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    createClient().from('children').select('id, name').then(({ data }) => {
      if (data) setChildren(data)
    })
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(content = input) {
    if (!content.trim() || loading) return
    setInput('')

    const userMsg: Message = { role: 'user', content, timestamp: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          childId: selectedChild || null,
          history: messages.slice(-10),
        }),
      })

      if (!response.ok) throw new Error('Failed to get response')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ''

      const assistantMsg: Message = { role: 'assistant', content: '', timestamp: new Date().toISOString() }
      setMessages(prev => [...prev, assistantMsg])

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') break
              try {
                const parsed = JSON.parse(data)
                const delta = parsed.choices?.[0]?.delta?.content || ''
                assistantContent += delta
                setMessages(prev => {
                  const updated = [...prev]
                  updated[updated.length - 1] = { ...assistantMsg, content: assistantContent }
                  return updated
                })
              } catch {}
            }
          }
        }
      }
    } catch (err: any) {
      toast.error('Failed to get response. Please try again.')
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <Brain className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">AI Autism Coach</h1>
            <p className="text-xs text-gray-500">Evidence-based guidance for families</p>
          </div>
        </div>
        {children.length > 0 && (
          <select
            value={selectedChild}
            onChange={(e) => setSelectedChild(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">No child selected</option>
            {children.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-white rounded-2xl border border-gray-100 p-4 space-y-4 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-2 shrink-0 mt-0.5">
                <Brain className="w-4 h-4 text-purple-600" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-50 text-gray-900'
              }`}
            >
              <div className={`text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'text-white' : 'text-gray-800'}`}>
                {msg.content || (loading && i === messages.length - 1 ? (
                  <span className="flex items-center gap-1">
                    <span className="animate-bounce">•</span>
                    <span className="animate-bounce delay-100">•</span>
                    <span className="animate-bounce delay-200">•</span>
                  </span>
                ) : '')}
              </div>
              <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Starter prompts */}
      {messages.length <= 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-2">
          {STARTER_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => sendMessage(prompt)}
              className="shrink-0 text-xs bg-purple-50 text-purple-700 border border-purple-100 px-3 py-2 rounded-full hover:bg-purple-100 transition-colors max-w-48 text-left truncate"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder="Ask anything about autism, behaviors, or strategies..."
          disabled={loading}
          className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          className="bg-purple-600 text-white p-3 rounded-xl hover:bg-purple-700 disabled:opacity-50 transition-colors"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </button>
      </div>

      <p className="text-xs text-center text-gray-400 mt-2">
        MBT AI Coach provides educational support only — not medical diagnosis or treatment.
      </p>
    </div>
  )
}
