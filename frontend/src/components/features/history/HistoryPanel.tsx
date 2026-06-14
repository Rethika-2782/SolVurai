'use client'

/**
 * HistoryPanel — View, search, delete and reopen saved Tamil dialogues.
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { History, Search, Trash2, ExternalLink, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { getUserDialogues, deleteDialogue } from '@/services/firestore'
import { useAuth } from '@/hooks/useAuth'
import { formatDate } from '@/lib/utils'
import type { SavedDialogue } from '@/types'

export default function HistoryPanel() {
  const { user } = useAuth()
  const [dialogues, setDialogues] = useState<SavedDialogue[]>([])
  const [filtered,  setFiltered]  = useState<SavedDialogue[]>([])
  const [search,    setSearch]    = useState('')
  const [loading,   setLoading]   = useState(true)
  const [selected,  setSelected]  = useState<SavedDialogue | null>(null)
  const [deleting,  setDeleting]  = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    loadHistory()
  }, [user])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(q
      ? dialogues.filter(d =>
          d.title.toLowerCase().includes(q) ||
          d.topic.toLowerCase().includes(q) ||
          d.scenario.includes(q) ||
          d.emotion.includes(q)
        )
      : dialogues
    )
  }, [search, dialogues])

  async function loadHistory() {
    if (!user) return
    setLoading(true)
    try {
      const data = await getUserDialogues(user.uid)
      setDialogues(data)
      setFiltered(data)
    } catch (e) {
      toast.error('Failed to load history')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!user || !id) return
    setDeleting(id)
    try {
      await deleteDialogue(id, user.uid)
      setDialogues(prev => prev.filter(d => d.id !== id))
      if (selected?.id === id) setSelected(null)
      toast.success('நீக்கப்பட்டது — Deleted')
    } catch (e) {
      toast.error('Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  const EMOTION_EMOJI: Record<string, string> = {
    happy: '😊', angry: '😤', respectful: '🙏', emotional: '🥺',
    confident: '💪', sad: '😢', motivational: '🔥',
  }
  const SCENARIO_EMOJI: Record<string, string> = {
    friends: '👫', classroom: '📚', interview: '💼', debate: '⚡',
    storytelling: '📖', customer_service: '🛎️', teacher_student: '🎓', family: '🏡',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <History size={22} className="text-yellow-400" />
            வரலாறு — History
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {dialogues.length} saved dialogue{dialogues.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={loadHistory}
          className="text-xs text-white/30 hover:text-white/60 transition-colors px-3 py-1.5 rounded-lg glass">
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="தேடுக — Search by title, topic, emotion…"
          className="w-full bg-white/5 border border-white/8 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-yellow-500/40 transition-colors"
        />
        {search && (
          <button onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50">
            <X size={14} />
          </button>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="skeleton h-20 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 glass rounded-2xl">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-white/40 text-sm">
            {search ? 'No dialogues match your search' : 'No saved dialogues yet'}
          </p>
          <p className="tamil text-white/20 text-xs mt-1">
            {search ? 'வேறு சொற்களில் தேடுங்கள்' : 'உரையாடல் உருவாக்கி முதலில் பயன்படுத்தவும்'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.04 }}
                className="glass rounded-xl overflow-hidden hover:bg-white/5 transition-all duration-150 group cursor-pointer"
                onClick={() => setSelected(d)}
              >
                <div className="p-4 flex items-center gap-4">
                  {/* Icons */}
                  <div className="flex gap-1.5 flex-shrink-0">
                    <span className="text-lg">{SCENARIO_EMOJI[d.scenario] ?? '💬'}</span>
                    <span className="text-lg">{EMOTION_EMOJI[d.emotion] ?? '✨'}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium text-white truncate">{d.title}</h3>
                      {d.grammarScore && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full text-orange-300 bg-orange-400/10 flex-shrink-0">
                          {d.grammarScore}/100
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {[d.scenario, d.emotion, d.style, d.difficulty].map(tag => (
                        <span key={tag} className="text-[10px] text-white/25 capitalize">{tag}</span>
                      ))}
                      <span className="text-[10px] text-white/20 ml-auto">
                        {formatDate(d.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                      onClick={e => { e.stopPropagation(); setSelected(d) }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-blue-400 hover:bg-blue-400/10 transition-all"
                    >
                      <ExternalLink size={12} />
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); handleDelete(d.id!) }}
                      disabled={deleting === d.id}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all disabled:opacity-40"
                    >
                      {deleting === d.id ? (
                        <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.3"/>
                          <path fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
                        </svg>
                      ) : <Trash2 size={12} />}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-strong rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="px-6 py-4 flex items-center justify-between border-b"
                style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <div>
                  <h2 className="font-semibold text-white">{selected.title}</h2>
                  <div className="flex gap-2 mt-1">
                    {[selected.scenario, selected.emotion, selected.style].map(t => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-full text-white/30 bg-white/5 capitalize">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <button onClick={() => setSelected(null)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all">
                  <X size={16} />
                </button>
              </div>

              {/* Dialogue lines */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {selected.lines.map((line, i) => (
                  <div key={i} className={`flex gap-3 ${i % 2 === 0 ? '' : 'flex-row-reverse'}`}>
                    <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                      style={{
                        background: i % 2 === 0
                          ? 'linear-gradient(135deg, #FF6B1A, #FFB830)'
                          : 'linear-gradient(135deg, #7C3AED, #A855F7)',
                      }}>
                      {line.speaker[0]}
                    </div>
                    <div className={`max-w-[75%] flex flex-col gap-1 ${i % 2 !== 0 ? 'items-end' : ''}`}>
                      <span className="text-[10px] text-white/30 px-1">{line.speaker}</span>
                      <div className="rounded-2xl px-4 py-2.5"
                        style={i % 2 === 0
                          ? { background: 'rgba(255,107,26,0.1)', border: '1px solid rgba(255,107,26,0.2)' }
                          : { background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }
                        }>
                        <p className="tamil text-white/85 text-sm leading-relaxed">{line.text}</p>
                        {line.translation && (
                          <p className="text-white/30 text-xs mt-1 italic">{line.translation}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal footer */}
              <div className="px-6 py-3 border-t flex items-center justify-between"
                style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <span className="text-xs text-white/25">{formatDate(selected.createdAt)}</span>
                <button
                  onClick={() => handleDelete(selected.id!)}
                  className="text-xs text-red-400/60 hover:text-red-400 transition-colors flex items-center gap-1"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
