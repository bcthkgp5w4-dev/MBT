import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateJSON<T>(prompt: string, systemPrompt?: string): Promise<T> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
      { role: 'user', content: prompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  })

  const content = response.choices[0]?.message?.content
  if (!content) throw new Error('No response from AI')
  return JSON.parse(content) as T
}

export async function generateText(prompt: string, systemPrompt?: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 1500,
  })

  return response.choices[0]?.message?.content || ''
}

export async function streamChat(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>
) {
  return openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
    temperature: 0.7,
    max_tokens: 2000,
    stream: true,
  })
}
