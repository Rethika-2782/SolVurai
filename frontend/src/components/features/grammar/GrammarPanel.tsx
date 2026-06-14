'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '@/services/api'
import type { GrammarScore, GrammarInsight } from '@/types'

const SCORE_LABELS: { key: keyof GrammarScore; label: string; tamil: string; color: string }[] = [
  { key: 'grammar',    label: 'Grammar',    tamil: 'இலக்கணம்',  color: '#3B82F6' },
  { key: 'fluency',    label: 'Fluency',    tamil: 'சரளம்',     color: '#10B981' },
  { key: 'vocabulary', label: 'Vocabulary', tamil: 'சொல்வளம்', color: '#A855F7' },
  { key: 'formality',  label: 'Formality',  tamil: 'முறைமை',   color: '#FFB830' },
]

export default function GrammarPanel() {
  const [input,    setInput]    = useState('')
  const [scores,   setScores]   = useState<GrammarScore | null>(null)
  const [insights, setInsights] = useState<GrammarInsight[]>([])
  const [tenses,   setTenses]   = useState<string[]>([])
  const [patterns, setPatterns] = useState<string[]>([])
  const [vocab,    setVocab]    = useState<string[]>([])
  const [loading,  setLoading]  = useState(false)

  async function analyze() {
    if (!input.trim()) return toast.error('Please enter Tamil text to analyze')
    setLoading(true)
    try {
      const res = await api.grammar({ dialogue: input })
      setScores(res.scores)
      setInsights(res.insights || [])
      setTenses(res.tense_used || [])
      setPatterns(res.sentence_patterns || [])
      setVocab(res.vocabulary_highlights || [])
    } catch (e: any) {
      toast.error(e.message || 'Grammar analysis failed')
    } finally {
      setLoading(false)
    }
  }

  const overall = scores?.overall ?? 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BookOpen size={22} className="text-blue-400" />
          இலக்கண நுண்ணறிவு — Grammar Intelligence
        </h1>
        <p className="text-white/40 text-sm mt-1">
          Deep AI analysis of Tamil grammar, tense, vocabulary, and fluency
        </p>
      </div>

      <div className="glass rounded-2xl p-5">
        <label className="text-xs uppercase tracking-widest text-white/30 mb-3 block">
          Tamil Text to Analyze — பகுப்பாய்வு செய்ய
        </label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={8}
          placeholder="உங்கள் தமிழ் உரையாடலை இங்கே ஒட்டவும் — or type in English / Tanglish"
          className="tamil w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white/80 placeholder-white/20 text-sm resize-none outline-none focus:border-blue-500/40 transition-colors leading-relaxed"
        />
        <button
          onClick={analyze}
          disabled={loading || !input.trim()}
          className="mt-4 btn-saffron px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
                <path fill="white" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
              </svg>
              <span>பகுப்பாய்கிறது…</span>
            </>
          ) : (
            <>
              <Sparkles size={16} />
              <span>பகுப்பாய் — Analyze</span>
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {scores && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

            {/* Overall score */}
            <div className="glass rounded-2xl p-6 flex items-center gap-6">
              <div className="relative w-24 h-24 flex-shrink-0">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                  <circle cx="40" cy="40" r="32" fill="none"
                    stroke="url(#scoreGrad)" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 32 * overall / 100} ${2 * Math.PI * 32}`}
                  />
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FF6B1A" />
                      <stop offset="100%" stopColor="#FFB830" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold gradient-saffron">{overall}</span>
                  <span className="text-[10px] text-white/30">/100</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Overall Tamil Score</h3>
                <p className="tamil text-white/40 text-sm">மொத்த தமிழ் மதிப்பெண்</p>
                <div className="mt-2">
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    overall >= 80 ? 'text-green-400 bg-green-400/10' :
                    overall >= 60 ? 'text-yellow-400 bg-yellow-400/10' :
                    'text-orange-400 bg-orange-400/10'
                  }`}>
                    {overall >= 80 ? '🌟 Excellent — சிறப்பு' :
                     overall >= 60 ? '👍 Good — நல்லது' :
                     '📚 Needs Practice — பயிற்சி தேவை'}
                  </span>
                </div>
              </div>
            </div>

            {/* Score cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {SCORE_LABELS.map(({ key, label, tamil, color }, idx) => {
                const val = scores[key] ?? 0
                return (
                  <motion.div key={key}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass rounded-xl p-4"
                    style={{ border: `1px solid ${color}22` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-white/40">{label}</span>
                      <span className="text-sm font-bold" style={{ color }}>{val}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${val}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-full rounded-full"
                        style={{ background: color }}
                      />
                    </div>
                    <p className="tamil text-[10px] text-white/20 mt-2">{tamil}</p>
                  </motion.div>
                )
              })}
            </div>

            {/* Insights */}
            {insights.length > 0 && (
              <div className="glass rounded-2xl p-5">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <span>🔍</span>
                  <span>Grammar Insights — இலக்கண நுண்ணறிவுகள்</span>
                </h3>
                <div className="space-y-3">
                  {insights.map((ins, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-4 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <span className="text-xs px-2 py-0.5 rounded-full text-orange-300 bg-orange-400/10">
                        {ins.category}
                      </span>
                      <p className="text-sm text-white/70 mt-2 mb-1">{ins.finding}</p>
                      {ins.example && (
                        <p className="tamil text-xs text-white/40 bg-white/5 px-3 py-1.5 rounded-lg mt-2">
                          {ins.example}
                        </p>
                      )}
                      {ins.tip && (
                        <p className="text-xs text-green-400/70 mt-2">💡 {ins.tip}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Tenses / Patterns / Vocab */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Tenses Used',          tamil: 'காலங்கள்',         items: tenses,   color: '#3B82F6', icon: '⏱️' },
                { title: 'Sentence Patterns',     tamil: 'வாக்கிய அமைப்பு', items: patterns, color: '#A855F7', icon: '🧩' },
                { title: 'Vocabulary Highlights', tamil: 'சொல் சிறப்புகள்', items: vocab,    color: '#10B981', icon: '📝' },
              ].map(({ title, tamil, items, color, icon }) => (
                <div key={title} className="glass rounded-xl p-4">
                  <h4 className="text-sm font-medium text-white/60 mb-1">{icon} {title}</h4>
                  <p className="tamil text-[10px] text-white/20 mb-3">{tamil}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map((item, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-lg tamil"
                        style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
                        {item}
                      </span>
                    ))}
                    {items.length === 0 && <span className="text-xs text-white/20">No data</span>}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="glass rounded-2xl p-6 flex gap-6">
              <div className="skeleton w-24 h-24 rounded-full" />
              <div className="flex-1 space-y-3 pt-2">
                <div className="skeleton h-5 rounded w-48" />
                <div className="skeleton h-4 rounded w-32" />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map(i => <div key={i} className="skeleton h-20 rounded-xl" />)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
