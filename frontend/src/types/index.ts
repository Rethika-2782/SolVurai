/**
 * SolVurai — Shared TypeScript Types
 */

// ── Auth ─────────────────────────────────────────────────
export interface UserProfile {
  uid:         string
  email:       string | null
  displayName: string | null
  photoURL:    string | null
  createdAt?:  any
  stats?: {
    totalGenerated: number
    totalSaved:     number
    avgGrammarScore: number
    streak:         number
  }
}

// ── Dialogue Generation ───────────────────────────────────
export type Scenario =
  | 'friends' | 'classroom' | 'interview' | 'debate'
  | 'storytelling' | 'customer_service' | 'teacher_student' | 'family'

export type Emotion =
  | 'happy' | 'angry' | 'respectful' | 'emotional'
  | 'confident' | 'sad' | 'motivational'

export type DialogueStyle =
  | 'spoken' | 'formal' | 'literary' | 'simplified'

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export interface GenerateRequest {
  scenario:   Scenario
  emotion:    Emotion
  style:      DialogueStyle
  difficulty: Difficulty
  topic?:     string
  turns?:     number
}

export interface DialogueLine {
  speaker: string
  text:    string
  transliteration?: string
  translation?:     string
}

export interface GenerateResponse {
  dialogue:     DialogueLine[]
  title:        string
  topic_used:   string
  raw_text:     string
}

// ── Style Transform ──────────────────────────────────────
export interface TransformRequest {
  dialogue:  string
  from_style: DialogueStyle
  to_style:   DialogueStyle
}

export interface TransformResponse {
  transformed: string
  changes_made: string[]
}

// ── Emotion Engine ────────────────────────────────────────
export interface EmotionRequest {
  dialogue:      string
  target_emotion: Emotion
}

export interface EmotionResponse {
  adapted:        string
  emotion_notes:  string
}

// ── Grammar Analysis ──────────────────────────────────────
export interface GrammarRequest {
  dialogue: string
}

export interface GrammarScore {
  grammar:    number   // 0–100
  fluency:    number
  vocabulary: number
  formality:  number
  overall:    number
}

export interface GrammarInsight {
  category: string
  finding:  string
  example:  string
  tip:      string
}

export interface GrammarResponse {
  scores:    GrammarScore
  insights:  GrammarInsight[]
  tense_used:    string[]
  sentence_patterns: string[]
  vocabulary_highlights: string[]
}

// ── Saved Dialogue (Firestore) ────────────────────────────
export interface SavedDialogue {
  id?:         string
  userId:      string
  title:       string
  rawText:     string
  lines:       DialogueLine[]
  scenario:    Scenario
  emotion:     Emotion
  style:       DialogueStyle
  difficulty:  Difficulty
  topic:       string
  grammarScore?: number
  createdAt:   any
  tags?:       string[]
}

// ── UI State ──────────────────────────────────────────────
export interface ToastOptions {
  type:    'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
}

export type AppPage =
  | 'generator' | 'transformer' | 'emotion'
  | 'grammar'   | 'history'    | 'profile'
