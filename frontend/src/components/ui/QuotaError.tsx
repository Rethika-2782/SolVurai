'use client'

import { motion } from 'framer-motion'
import { Clock, RefreshCw } from 'lucide-react'

export default function QuotaError() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-6 text-center"
      style={{
        background: 'linear-gradient(135deg, rgba(255,184,48,0.08), rgba(255,107,26,0.08))',
        border: '1px solid rgba(255,184,48,0.25)',
      }}
    >
      {/* Icon */}
      <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
        style={{ background: 'rgba(255,184,48,0.15)' }}>
        <Clock size={24} className="text-yellow-400" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-white mb-2">
        AI Quota Reached
      </h3>
      <p className="tamil text-white/60 text-sm mb-4">
        இன்றைய AI பயன்பாடு முடிந்தது
      </p>

      {/* Divider */}
      <div className="w-16 h-0.5 mx-auto mb-4"
        style={{ background: 'linear-gradient(90deg, transparent, #FFB830, transparent)' }} />

      {/* Message */}
      <p className="text-white/70 text-sm leading-relaxed mb-2">
        You have used all free AI requests for today.
      </p>
      <p className="text-white/50 text-sm leading-relaxed mb-5">
        The quota resets automatically in{' '}
        <span className="text-yellow-400 font-semibold">24 hours</span>.
        Please come back tomorrow to continue!
      </p>

      {/* Tamil message */}
      <p className="tamil text-white/35 text-xs mb-5">
        நாளை காலை மீண்டும் இலவசமாக பயன்படுத்தலாம் 🙏
      </p>

      {/* What you can do */}
      <div className="glass rounded-xl p-4 text-left mb-4">
        <p className="text-xs text-white/40 uppercase tracking-widest mb-3">
          Meanwhile you can still:
        </p>
        <ul className="space-y-2">
          {[
            '📖 View your saved dialogues in History',
            '📥 Export saved dialogues as PDF or TXT',
            '🌙 Try Dark / Light theme toggle',
            '🔍 Browse all features and UI',
          ].map(item => (
            <li key={item} className="text-sm text-white/60 flex items-center gap-2">
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Refresh tip */}
      <button
        onClick={() => window.location.reload()}
        className="flex items-center gap-2 mx-auto text-xs text-white/30 hover:text-white/60 transition-colors"
      >
        <RefreshCw size={12} />
        <span>Click to retry after 24 hours</span>
      </button>
    </motion.div>
  )
}
