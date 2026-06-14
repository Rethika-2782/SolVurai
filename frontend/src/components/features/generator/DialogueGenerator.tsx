'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Copy, Save, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import { api, getFriendlyError } from '@/services/api'
import { saveDialogue, incrementGenerated } from '@/services/firestore'
import { useAuth } from '@/hooks/useAuth'
import type { Scenario, Emotion, DialogueStyle, Difficulty, DialogueLine } from '@/types'
import ExportButton from './ExportButton'
import QuotaError from '@/components/ui/QuotaError'

const SCENARIOS: { value: Scenario; label: string; tamil: string; emoji: string }[] = [
  { value: 'friends',          label: 'Friends',          tamil: 'நண்பர்கள்',       emoji: '👫' },
  { value: 'classroom',        label: 'Classroom',        tamil: 'வகுப்பறை',        emoji: '📚' },
  { value: 'interview',        label: 'Interview',        tamil: 'நேர்காணல்',       emoji: '💼' },
  { value: 'debate',           label: 'Debate',           tamil: 'விவாதம்',         emoji: '⚡' },
  { value: 'storytelling',     label: 'Storytelling',     tamil: 'கதை சொல்லல்',    emoji: '📖' },
  { value: 'customer_service', label: 'Customer Service', tamil: 'வாடிக்கையாளர்',  emoji: '🛎️' },
  { value: 'teacher_student',  label: 'Teacher/Student',  tamil: 'ஆசிரியர்/மாணவர்', emoji: '🎓' },
  { value: 'family',           label: 'Family',           tamil: 'குடும்பம்',       emoji: '🏡' },
]

const EMOTIONS: { value: Emotion; label: string; tamil: string; color: string; emoji: string }[] = [
  { value: 'happy',        label: 'Happy',        tamil: 'மகிழ்ச்சி',      color: '#FFB830', emoji: '😊' },
  { value: 'angry',        label: 'Angry',        tamil: 'கோபம்',          color: '#EF4444', emoji: '😤' },
  { value: 'respectful',   label: 'Respectful',   tamil: 'மரியாதை',        color: '#10B981', emoji: '🙏' },
  { value: 'emotional',    label: 'Emotional',    tamil: 'உணர்ச்சி',       color: '#A855F7', emoji: '🥺' },
  { value: 'confident',    label: 'Confident',    tamil: 'தன்னம்பிக்கை',  color: '#3B82F6', emoji: '💪' },
  { value: 'sad',          label: 'Sad',          tamil: 'துக்கம்',         color: '#6B7280', emoji: '😢' },
  { value: 'motivational', label: 'Motivational', tamil: 'ஊக்கம்',         color: '#FF6B1A', emoji: '🔥' },
]

const STYLES: { value: DialogueStyle; label: string; tamil: string }[] = [
  { value: 'spoken',     label: 'Spoken Tamil',    tamil: 'பேச்சு வழக்கு' },
  { value: 'formal',     label: 'Formal Tamil',    tamil: 'உயர் வழக்கு' },
  { value: 'literary',   label: 'Literary Tamil',  tamil: 'இலக்கிய நடை' },
  { value: 'simplified', label: 'Simplified Tamil', tamil: 'எளிய தமிழ்' },
]

const DIFFICULTIES: { value: Difficulty; label: string; color: string }[] = [
  { value: 'beginner',     label: 'Beginner',     color: '#10B981' },
  { value: 'intermediate', label: 'Intermediate', color: '#FFB830' },
  { value: 'advanced',     label: 'Advanced',     color: '#EF4444' },
]

export default function DialogueGenerator() {
  const { user } = useAuth()
  const [scenario,   setScenario]   = useState<Scenario>('friends')
  const [emotion,    setEmotion]    = useState<Emotion>('happy')
  const [style,      setStyle]      = useState<DialogueStyle>('spoken')
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner')
  const [topic,      setTopic]      = useState('')
  const [generating, setGenerating] = useState(false)
  const [saving,     setSaving]     = useState(false)
  const [quotaError, setQuotaError] = useState(false)

  const [result, setResult] = useState<{
    lines: DialogueLine[]
    title: string
    raw: string
  } | null>(null)
  const [displayed, setDisplayed] = useState<DialogueLine[]>([])

  async function generate() {
    setGenerating(true)
    setResult(null)
    setDisplayed([])
    setQuotaError(false)
    try {
      const res = await api.generate({ scenario, emotion, style, difficulty, topic })
      setResult({ lines: res.dialogue, title: res.title, raw: res.raw_text })
      if (user) await incrementGenerated(user.uid)
      for (let i = 0; i < res.dialogue.length; i++) {
        await new Promise(r => setTimeout(r, 220))
        setDisplayed(prev => [...prev, res.dialogue[i]])
      }
    } catch (e: any) {
      const friendly = getFriendlyError(e.message)
      if (friendly === 'QUOTA') {
        setQuotaError(true)
      } else {
        toast.error(friendly)
      }
    } finally {
      setGenerating(false)
    }
  }

  async function handleSave() {
    if (!result || !user) return
    setSaving(true)
    try {
      await saveDialogue({
        userId: user.uid,
        title: result.title,
        rawText: result.raw,
        lines: result.lines,
        scenario, emotion, style, difficulty,
        topic: topic || 'General',
      })
      toast.success('சேமிக்கப்பட்டது! Saved to history 💾')
    } catch (e: any) {
      toast.error('Save failed: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  function handleCopy() {
    if (!result) return
    const text = result.lines.map(l => `${l.speaker}: ${l.text}`).join('\n')
    navigator.clipboard.writeText(text)
    toast.success('நகலெடுக்கப்பட்டது! Copied ✅')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Sparkles size={22} className="text-orange-400" />
          உரையாடல் உருவாக்கி — Dialogue Generator
        </h1>
        <p className="text-white/40 text-sm mt-1">Generate realistic Tamil dialogues with AI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Scenario */}
        <div className="glass rounded-2xl p-5">
          <label className="text-xs uppercase tracking-widest text-white/30 mb-3 block">Scenario — காட்சி</label>
          <div className="grid grid-cols-2 gap-2">
            {SCENARIOS.map(s => (
              <button key={s.value} onClick={() => setScenario(s.value)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all duration-150"
                style={scenario === s.value ? {
                  background: 'linear-gradient(135deg, rgba(255,107,26,0.25), rgba(124,58,237,0.15))',
                  border: '1px solid rgba(255,107,26,0.4)',
                } : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-base">{s.emoji}</span>
                <div>
                  <div className={`text-xs font-medium ${scenario === s.value ? 'text-orange-300' : 'text-white/60'}`}>{s.label}</div>
                  <div className="tamil text-[10px] text-white/25">{s.tamil}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Emotion */}
        <div className="glass rounded-2xl p-5">
          <label className="text-xs uppercase tracking-widest text-white/30 mb-3 block">Emotion — உணர்ச்சி</label>
          <div className="grid grid-cols-2 gap-2">
            {EMOTIONS.map(e => (
              <button key={e.value} onClick={() => setEmotion(e.value)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all duration-150"
                style={emotion === e.value ? {
                  background: `${e.color}22`, border: `1px solid ${e.color}55`,
                } : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-sm">{e.emoji}</span>
                <div>
                  <div className="text-xs font-medium" style={{ color: emotion === e.value ? e.color : 'rgba(255,255,255,0.6)' }}>{e.label}</div>
                  <div className="tamil text-[10px] text-white/25">{e.tamil}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Style + Difficulty */}
        <div className="glass rounded-2xl p-5">
          <label className="text-xs uppercase tracking-widest text-white/30 mb-3 block">Style — நடை</label>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {STYLES.map(s => (
              <button key={s.value} onClick={() => setStyle(s.value)}
                className="px-3 py-2.5 rounded-xl text-left transition-all duration-150"
                style={style === s.value ? {
                  background: 'rgba(124,58,237,0.25)', border: '1px solid rgba(124,58,237,0.4)',
                } : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className={`text-xs font-medium ${style === s.value ? 'text-purple-300' : 'text-white/60'}`}>{s.label}</div>
                <div className="tamil text-[10px] text-white/25">{s.tamil}</div>
              </button>
            ))}
          </div>
          <label className="text-xs uppercase tracking-widest text-white/30 mb-2 block">Difficulty — நிலை</label>
          <div className="flex gap-2">
            {DIFFICULTIES.map(d => (
              <button key={d.value} onClick={() => setDifficulty(d.value)}
                className="flex-1 py-2 rounded-xl text-xs font-medium transition-all duration-150"
                style={difficulty === d.value ? {
                  background: `${d.color}33`, border: `1px solid ${d.color}66`, color: d.color,
                } : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Topic */}
        <div className="glass rounded-2xl p-5">
          <label className="text-xs uppercase tracking-widest text-white/30 mb-3 block">Topic (Optional) — தலைப்பு</label>
          <textarea value={topic} onChange={e => setTopic(e.target.value)}
            placeholder="E.g. discussing a new movie… / புதிய திரைப்படம் பற்றி…"
            rows={4}
            className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm resize-none outline-none focus:border-orange-500/40 transition-colors" />
          <p className="text-white/20 text-xs mt-2">You can type in English, Tanglish or Tamil</p>
        </div>
      </div>

      {/* Generate Button */}
      <motion.button onClick={generate} disabled={generating}
        whileHover={!generating ? { scale: 1.02 } : {}}
        whileTap={!generating ? { scale: 0.98 } : {}}
        className="btn-saffron w-full py-4 rounded-2xl text-base font-semibold flex items-center justify-center gap-3">
        {generating ? (
          <>
            <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="4"/>
              <path fill="white" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
            </svg>
            <span>உருவாக்குகிறது… Generating Tamil dialogue</span>
          </>
        ) : (
          <>
            <Sparkles size={20} />
            <span>உருவாக்கு — Generate Dialogue</span>
          </>
        )}
      </motion.button>

      {/* Quota Error */}
      <AnimatePresence>
        {quotaError && <QuotaError />}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {displayed.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="glass rounded-2xl overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between border-b"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <div>
                <h3 className="font-semibold text-white">{result?.title}</h3>
                <div className="flex gap-2 mt-1">
                  {[scenario, emotion, style, difficulty].map(t => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full text-white/40 capitalize"
                      style={{ background: 'rgba(255,255,255,0.06)' }}>{t}</span>
                  ))}
                </div>
              </div>
              {result && (
                <div className="flex gap-2">
                  <button onClick={handleCopy} title="Copy"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                    <Copy size={14} />
                  </button>
                  <button onClick={handleSave} disabled={saving} title="Save"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all disabled:opacity-40">
                    <Save size={14} />
                  </button>
                  <ExportButton lines={result.lines} title={result.title} />
                </div>
              )}
            </div>
            <div className="p-6 space-y-4">
              {displayed.map((line, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -16 : 16 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }} className={`flex gap-3 ${i % 2 === 0 ? '' : 'flex-row-reverse'}`}>
                  <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: i % 2 === 0 ? 'linear-gradient(135deg, #FF6B1A, #FFB830)' : 'linear-gradient(135deg, #7C3AED, #A855F7)' }}>
                    {line.speaker[0]}
                  </div>
                  <div className={`max-w-[75%] flex flex-col gap-1 ${i % 2 !== 0 ? 'items-end' : ''}`}>
                    <span className="text-[10px] text-white/30 px-1">{line.speaker}</span>
                    <div className="rounded-2xl px-4 py-3"
                      style={i % 2 === 0 ? { background: 'rgba(255,107,26,0.1)', border: '1px solid rgba(255,107,26,0.2)' }
                        : { background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
                      <p className="tamil text-white/90 text-sm leading-relaxed">{line.text}</p>
                      {line.translation && <p className="text-white/30 text-xs mt-1 italic">{line.translation}</p>}
                    </div>
                  </div>
                </motion.div>
              ))}
              {generating && (
                <div className="flex gap-2 items-center text-white/30 text-sm pl-11">
                  <span className="flex gap-1">
                    {[0,1,2].map(i => (
                      <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-orange-400"
                        animate={{ y: [0,-4,0] }} transition={{ delay: i*0.15, duration: 0.5, repeat: Infinity }} />
                    ))}
                  </span>
                  <span className="text-xs tamil">தமிழில் எழுதுகிறது…</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
