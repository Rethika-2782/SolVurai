'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart } from 'lucide-react'
import toast from 'react-hot-toast'
import { api, getFriendlyError } from '@/services/api'
import type { Emotion } from '@/types'
import QuotaError from '@/components/ui/QuotaError'

const EMOTIONS: { value: Emotion; label: string; tamil: string; emoji: string; color: string; bg: string; desc: string }[] = [
  { value: 'happy',        label: 'Happy',        tamil: 'மகிழ்ச்சி',      emoji: '😊', color: '#FFB830', bg: 'rgba(255,184,48,0.12)',  desc: 'Joyful, warm, upbeat' },
  { value: 'angry',        label: 'Angry',        tamil: 'கோபம்',          emoji: '😤', color: '#EF4444', bg: 'rgba(239,68,68,0.12)',   desc: 'Intense, sharp, heated' },
  { value: 'respectful',   label: 'Respectful',   tamil: 'மரியாதையான',    emoji: '🙏', color: '#10B981', bg: 'rgba(16,185,129,0.12)',  desc: 'Formal, polite, honoring' },
  { value: 'emotional',    label: 'Emotional',    tamil: 'உணர்ச்சிமிகு',  emoji: '🥺', color: '#A855F7', bg: 'rgba(168,85,247,0.12)',  desc: 'Deep feeling, moving' },
  { value: 'confident',    label: 'Confident',    tamil: 'தன்னம்பிக்கை',  emoji: '💪', color: '#3B82F6', bg: 'rgba(59,130,246,0.12)',  desc: 'Bold, assertive, strong' },
  { value: 'sad',          label: 'Sad',          tamil: 'துக்கமான',        emoji: '😢', color: '#6B7280', bg: 'rgba(107,114,128,0.12)', desc: 'Melancholic, sorrowful' },
  { value: 'motivational', label: 'Motivational', tamil: 'ஊக்கமளிக்கும்',  emoji: '🔥', color: '#FF6B1A', bg: 'rgba(255,107,26,0.12)',  desc: 'Inspiring, energizing' },
]

export default function EmotionEngine() {
  const [input,         setInput]         = useState('')
  const [targetEmotion, setTargetEmotion] = useState<Emotion>('happy')
  const [output,        setOutput]        = useState('')
  const [notes,         setNotes]         = useState('')
  const [loading,       setLoading]       = useState(false)
  const [quotaError,    setQuotaError]    = useState(false)

  const selected = EMOTIONS.find(e => e.value === targetEmotion)!

  async function adapt() {
    if (!input.trim()) return toast.error('Please enter a Tamil dialogue first')
    setLoading(true)
    setOutput('')
    setNotes('')
    setQuotaError(false)
    try {
      const res = await api.emotion({ dialogue: input, target_emotion: targetEmotion })
      setOutput(res.adapted)
      setNotes(res.emotion_notes)
    } catch (e: any) {
      const friendly = getFriendlyError(e.message)
      if (friendly === 'QUOTA') {
        setQuotaError(true)
      } else {
        toast.error(friendly)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Heart size={22} className="text-pink-400" />
          உணர்ச்சி என்ஜின் — Emotion Engine
        </h1>
        <p className="text-white/40 text-sm mt-1">
          Dynamically adapt any Tamil dialogue to express different emotions
        </p>
      </div>

      {/* Emotion Selector */}
      <div className="glass rounded-2xl p-5">
        <label className="text-xs uppercase tracking-widest text-white/30 mb-4 block">Target Emotion — இலக்கு உணர்ச்சி</label>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
          {EMOTIONS.map(e => (
            <motion.button key={e.value} onClick={() => setTargetEmotion(e.value)}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-200"
              style={targetEmotion === e.value ? {
                background: e.bg, border: `2px solid ${e.color}`, boxShadow: `0 0 16px ${e.color}44`,
              } : { background: 'rgba(255,255,255,0.03)', border: '2px solid rgba(255,255,255,0.06)' }}>
              <span className="text-2xl">{e.emoji}</span>
              <span className="text-[10px] font-medium" style={{ color: targetEmotion === e.value ? e.color : 'rgba(255,255,255,0.4)' }}>
                {e.label}
              </span>
              <span className="tamil text-[9px] text-white/20">{e.tamil}</span>
            </motion.button>
          ))}
        </div>
        <motion.div key={targetEmotion} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ background: selected.bg, border: `1px solid ${selected.color}44` }}>
          <span className="text-2xl">{selected.emoji}</span>
          <div>
            <div className="font-medium text-sm" style={{ color: selected.color }}>
              {selected.label} — <span className="tamil">{selected.tamil}</span>
            </div>
            <div className="text-xs text-white/40">{selected.desc}</div>
          </div>
        </motion.div>
      </div>

      {/* Input */}
      <div className="glass rounded-2xl p-5">
        <label className="text-xs uppercase tracking-widest text-white/30 mb-3 block">Original Dialogue — மூல உரையாடல்</label>
        <textarea value={input} onChange={e => setInput(e.target.value)} rows={6}
          placeholder="உரையாடலை இங்கே எழுதவும் அல்லது ஒட்டவும்…"
          className="tamil w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white/80 placeholder-white/20 text-sm resize-none outline-none focus:border-pink-500/40 transition-colors leading-relaxed" />
      </div>

      {/* Adapt Button */}
      <button onClick={adapt} disabled={loading || !input.trim()}
        className="w-full py-4 rounded-2xl text-base font-semibold flex items-center justify-center gap-3 transition-all duration-200"
        style={{ background: `linear-gradient(135deg, ${selected.color}, ${selected.color}99)`, boxShadow: loading ? 'none' : `0 0 30px ${selected.color}44` }}>
        {loading ? (
          <>
            <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="4"/>
              <path fill="white" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
            </svg>
            <span>உணர்ச்சியை தழுவுகிறது…</span>
          </>
        ) : (
          <><span>{selected.emoji}</span><span>{selected.label} ஆக மாற்று — Adapt to {selected.label}</span></>
        )}
      </button>

      {/* Quota Error */}
      <AnimatePresence>{quotaError && <QuotaError />}</AnimatePresence>

      {/* Output */}
      <AnimatePresence>
        {output && !loading && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="rounded-2xl p-5" style={{ background: selected.bg, border: `1px solid ${selected.color}33` }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">{selected.emoji}</span>
              <h3 className="font-semibold text-sm" style={{ color: selected.color }}>
                {selected.label} Adaptation — {selected.tamil} வடிவம்
              </h3>
            </div>
            <p className="tamil text-white/85 text-sm leading-loose whitespace-pre-wrap mb-4">{output}</p>
            {notes && (
              <div className="mt-3 pt-3 border-t" style={{ borderColor: `${selected.color}22` }}>
                <p className="text-xs text-white/40">
                  <span style={{ color: selected.color }}>💡 உணர்ச்சி குறிப்புகள்:</span> {notes}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
