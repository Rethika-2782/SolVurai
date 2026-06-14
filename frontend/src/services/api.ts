/**
 * SolVurai — API Service
 * All backend API calls with friendly error handling.
 */

import type {
  GenerateRequest, GenerateResponse,
  TransformRequest, TransformResponse,
  EmotionRequest, EmotionResponse,
  GrammarRequest, GrammarResponse,
} from '@/types'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

async function request<T>(path: string, body: unknown): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new Error('Cannot connect to server. Please make sure the backend is running.')
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Server error' }))
    const detail = err.detail || `HTTP ${res.status}`

    // Handle quota errors with friendly Tamil message
    if (detail.includes('429') || detail.includes('quota') || detail.includes('Quota')) {
      throw new Error('AI_QUOTA_EXCEEDED')
    }
    if (detail.includes('404') || detail.includes('not found')) {
      throw new Error('AI_MODEL_ERROR')
    }
    throw new Error(detail)
  }
  return res.json()
}

export function getFriendlyError(error: string): string {
  if (error === 'AI_QUOTA_EXCEEDED') {
    return 'QUOTA'
  }
  if (error === 'AI_MODEL_ERROR') {
    return 'The AI model is unavailable. Please try again later.'
  }
  if (error.includes('Cannot connect')) {
    return 'Cannot connect to backend. Please make sure it is running.'
  }
  return error
}

export const api = {
  generate:  (body: GenerateRequest)  => request<GenerateResponse>('/api/generate',  body),
  transform: (body: TransformRequest) => request<TransformResponse>('/api/transform', body),
  emotion:   (body: EmotionRequest)   => request<EmotionResponse>('/api/emotion',   body),
  grammar:   (body: GrammarRequest)   => request<GrammarResponse>('/api/grammar',   body),
  health:    () => fetch(`${BASE}/api/health`).then(r => r.json()),
}
