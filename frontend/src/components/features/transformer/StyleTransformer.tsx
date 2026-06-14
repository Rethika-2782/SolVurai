'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeftRight, Copy, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { api, getFriendlyError } from '@/services/api'
import type { DialogueStyle } from '@/types'
import QuotaError from '@/components/ui/QuotaError'

const STYLES: { value: DialogueStyle; label: string; tamil: string; desc: string; color: string }[] = [
  { value: 'spoken',     label: 'Spoken',     tamil: 'பேச்சு',      desc: 'Everyday conversational Tamil', color: '#10B981' },
  { value: 'formal',     label: 'Formal',     tamil: 'உயர் வழக்கு', desc: 'Official & professional Tamil', color: '#3B82F6' },
  { value: 'literary',   label: 'Literary',   tamil: 'இலக்கியம்',  desc: 'Classical literary Tamil',      color: '#A855F7' },
  { value: 'simplified', label: 'Simplified', tamil: 'எளிமை',      desc: 'Simple & beginner-friendly',    color: '#FFB830' },
]

export default function StyleTransformer() {
  const [input,      setInput]      = useState('')
  const [fromStyle,  setFromStyle]  = useState<DialogueStyle>('spoken')
  const [toStyle,    setToStyle]    = useState<DialogueStyle>('formal')
  const [output,     setOutput]     = useState('')
  const [changes,    setChanges]    = useState<string[]>([])
  const [loading,    setLoading]    = useState(false)
  const [quotaError, setQuotaError] = useState(false)

  async function transform() {
    if (!input.trim()) return toast.error('Please enter a Tamil dialogue first')
    if (fromStyle === toStyle) return toast.error('Source and target styles must be different')
    setLoading(true)
    setOutput('')
    setChanges([])
    setQuotaError(false)
    try {
      const res = await api.transform({ dialogue: input, from_style: fromStyle, to_style: toStyle })
      setOutput(res.transformed)
      setChanges(res.changes_made || [])
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

  function swap() {
    setFromStyle(toStyle)
    setToStyle(fromStyle)
    setInput(output)
    setOutput('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <ArrowLeftRight size={22} className="text-purple-400" />
          நடை மாற்றி — Style Transformer
        </h1>
        <p className="text-white/40 text-sm mt-1">
          Convert Tamil dialogue between Spoken, Formal, Literary and Simplified styles
        </p>
      </div>

      {/* Style Selector */}
      <div className="flex items-center gap-3">
        <StylePicker label="From" value={fromStyle} onChange={setFromStyle} styles={STYLES} />
        <button onClick={swap}
          className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all mt-5">
          <ArrowLeftRight size={16} />
        </button>
        <StylePicker label="To" value={toStyle} onChange={setToStyle} styles={STYLES} />
      </div>

      {/* Input / Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-5">
          <label className="text-xs uppercase tracking-widest text-white/30 mb-3 block">Input Dialogue — உள்ளீடு</label>
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={10}
            placeholder="உரையாடலை இங்கே ஒட்டவும்…&#10;Paste your Tamil dialogue here…"
            className="tamil w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white/80 placeholder-white/20 text-sm resize-none outline-none focus:border-purple-500/40 transition-colors leading-relaxed" />
        </div>
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs uppercase tracking-widest text-white/30">Transformed — மாற்றம்</label>
            {output && (
              <button onClick={() => { navigator.clipboard.writeText(output); toast.success('Copied!') }}
                className="text-white/30 hover:text-white transition-colors">
                <Copy size={13} />
              </button>
            )}
          </div>
          <div className="w-full min-h-[200px]">
            {loading ? (
              <div className="space-y-3 pt-2">
                {[80,60,90,50,70].map((w,i) => (
                  <div key={i} className="skeleton h-4 rounded" style={{ width: `${w}%` }} />
                ))}
              </div>
            ) : output ? (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="tamil text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
                {output}
              </motion.p>
            ) : (
              <p className="text-white/15 text-sm">Transformed dialogue will appear here…</p>
            )}
          </div>
        </div>
      </div>

      {/* Transform Button */}
      <button onClick={transform} disabled={loading || !input.trim()}
        className="btn-violet w-full py-4 rounded-2xl text-base font-semibold flex items-center justify-center gap-3">
        {loading ? (
          <>
            <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="4"/>
              <path fill="white" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
            </svg>
            <span>மாற்றுகிறது…</span>
          </>
        ) : (
          <><Sparkles size={18} /><span>மாற்று — Transform Style</span></>
        )}
      </button>

      {/* Quota Error */}
      <AnimatePresence>{quotaError && <QuotaError />}</AnimatePresence>

      {/* Changes */}
      <AnimatePresence>
        {changes.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="glass-violet rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-purple-300 mb-3">
              🔍 Changes Made — செய்யப்பட்ட மாற்றங்கள்
            </h3>
            <ul className="space-y-2">
              {changes.map((c,i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                  <span className="text-purple-400 mt-0.5">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function StylePicker({ label, value, onChange, styles }: {
  label: string; value: DialogueStyle
  onChange: (v: DialogueStyle) => void; styles: typeof STYLES
}) {
  return (
    <div className="flex-1">
      <label className="text-xs uppercase tracking-widest text-white/30 mb-2 block">{label}</label>
      <div className="grid grid-cols-2 gap-1.5">
        {styles.map(s => (
          <button key={s.value} onClick={() => onChange(s.value)}
            className="px-3 py-2 rounded-xl text-left transition-all duration-150 text-xs"
            style={value === s.value ? {
              background: `${s.color}22`, border: `1px solid ${s.color}55`, color: s.color,
            } : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
            <div className="font-medium">{s.label}</div>
            <div className="tamil text-[10px] opacity-60">{s.tamil}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
