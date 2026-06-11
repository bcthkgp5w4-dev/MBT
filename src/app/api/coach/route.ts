import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'
import { SYSTEM_PROMPT, buildChildContext } from '@/lib/ai/prompts'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { message, childId, history } = await req.json()

  let child = null
  if (childId) {
    const { data } = await supabase.from('children').select('*').eq('id', childId).eq('profile_id', user.id).single()
    child = data
  }

  const messages = [
    { role: 'system' as const, content: SYSTEM_PROMPT },
    ...(child ? [{ role: 'system' as const, content: buildChildContext(child) }] : []),
    ...(history?.slice(-8)?.map((m: any) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })) || []),
    { role: 'user' as const, content: message },
  ]

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const stream = await client.chat.completions.create({
    model: 'gpt-4o',
    messages,
    stream: true,
    temperature: 0.7,
    max_tokens: 1500,
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const data = JSON.stringify(chunk)
        controller.enqueue(encoder.encode(`data: ${data}\n\n`))
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      controller.close()
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
