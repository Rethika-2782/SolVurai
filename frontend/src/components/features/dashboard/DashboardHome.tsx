'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Sparkles, ArrowLeftRight, Heart, BookOpen, History } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { getUserDialogues } from '@/services/firestore'
import type { SavedDialogue } from '@/types'
import { formatDate } from '@/lib/utils'

const QUICK_ACTIONS = [
  { href: '/dashboard',             icon: Sparkles,       label: 'Generate',  tamil: 'உருவாக்கு', color: '#FF6B1A', desc: 'Create Tamil dialogue' },
  { href: '/dashboard/transformer', icon: ArrowLeftRight, label: 'Transform', tamil: 'மாற்று',     color: '#3B82F6', desc: 'Switch dialogue style' },
  { href: '/dashboard/emotion',     icon: Heart,          label: 'Emotion',   tamil: 'உணர்ச்சி',  color: '#A855F7', desc: 'Adapt emotional tone' },
  { href: '/dashboard/grammar',     icon: BookOpen,       label: 'Grammar',   tamil: 'இலக்கணம்', color: '#10B981', desc: 'Analyze Tamil grammar' },
]

const SCENARIO_EMOJI: Record<string, string> = {
  friends: '👫', classroom: '📚', interview: '💼', debate: '⚡',
  storytelling: '📖', customer_service: '🛎️', teacher_student: '🎓', family: '🏡',
}

export default function DashboardHome() {
  const { user, profile } = useAuth()
  const [recent, setRecent] = useState<SavedDialogue[]>([])

  useEffect(() => {
    if (user) {
      getUserDialogues(user.uid).then(d => setRecent(d.slice(0, 5)))
    }
  }, [user])

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'காலை வணக்கம்' :
    hour < 17 ? 'மதிய வணக்கம்' : 'மாலை வணக்கம்'

  const stats = [
    { label: 'Generated',  value: profile?.stats?.totalGenerated ?? 0,  color: '#FF6B1A', icon: '🗣️' },
    { label: 'Saved',      value: profile?.stats?.totalSaved ?? 0,       color: '#A855F7', icon: '💾' },
    { label: 'Avg Score',  value: profile?.stats?.avgGrammarScore ?? 0,  color: '#10B981', icon: '📊' },
    { label: 'Day Streak', value: profile?.stats?.streak ?? 1,           color: '#FFB830', icon: '🔥' },
  ]

  return (
    <div className="space-y-8">

      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden p-6 md:p-8"
        style={{ background: 'linear-gradient(135deg, rgba(255,107,26,0.15) 0%, rgba(124,58,237,0.15) 100%)', border: '1px solid rgba(255,107,26,0.2)' }}
      >
        <p className="tamil text-orange-300 text-sm mb-1">{greeting} 🙏</p>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
          {user?.displayName ? `Welcome, ${user.displayName.split(' ')[0]}!` : 'Welcome to SolVurai!'}
        </h1>
        <p className="text-white/50 text-sm">What Tamil conversation will you create today?</p>
        <p className="tamil text-white/25 text-xs mt-1">இன்று என்ன தமிழ் உரையாடல் உருவாக்குவீர்கள்?</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map(({ label, value, color, icon }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }} className="glass rounded-xl p-4">
            <div className="text-2xl mb-2">{icon}</div>
            <div className="text-2xl font-bold" style={{ color }}>{value}</div>
            <div className="text-xs text-white/40 mt-0.5">{label}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm uppercase tracking-widest text-white/30 mb-3">
          Quick Actions — விரைவு செயல்கள்
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map(({ href, icon: Icon, label, tamil, color, desc }, i) => (
            <motion.div key={href} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.08 }} whileHover={{ scale: 1.02, y: -2 }}>
              <Link href={href} className="flex flex-col gap-3 p-4 rounded-xl transition-all duration-200 block"
                style={{ background: `${color}10`, border: `1px solid ${color}25` }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{label}</div>
                  <div className="tamil text-[10px] text-white/30 mt-0.5">{tamil}</div>
                  <div className="text-[10px] text-white/20 mt-1">{desc}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent */}
      {recent.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm uppercase tracking-widest text-white/30">
              Recent — சமீபத்திய உரையாடல்கள்
            </h2>
            <Link href="/dashboard/history" className="text-xs text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1">
              View all <History size={10} />
            </Link>
          </div>
          <div className="space-y-2">
            {recent.map((d, i) => (
              <motion.div key={d.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="glass rounded-xl px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer">
                <span className="text-lg">{SCENARIO_EMOJI[d.scenario] ?? '💬'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/70 truncate">{d.title}</p>
                  <p className="text-[10px] text-white/25">{formatDate(d.createdAt)}</p>
                </div>
                <span className="text-[10px] text-white/20 capitalize">{d.emotion}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Thirukkural — exact text as requested, left aligned */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        className="olaichuvadi rounded-2xl p-6">
        <p className="text-xs text-yellow-400/60 uppercase tracking-widest mb-4 text-center">
          📜 திருக்குறள் — Thirukkural of the Day
        </p>
        {/* Left-aligned kural lines */}
        <div className="pl-2 border-l-2 border-orange-400/40 mb-4">
          <p className="tamil text-white/90 text-base font-semibold leading-relaxed">
            யாகாவா ராயினும் நாகாக்க காவாக்கால்
          </p>
          <p className="tamil text-white/90 text-base font-semibold leading-relaxed">
            சோகாப்பர் சொல்லிழுக்குப் பட்டு.
          </p>
        </div>
        {/* Meaning */}
        <div className="pl-2">
          <p className="tamil text-white/55 text-sm leading-relaxed">
            யாராக இருந்தாலும் தன் பேச்சைக் கட்டுப்படுத்த வேண்டும்;
          </p>
          <p className="tamil text-white/55 text-sm leading-relaxed">
            இல்லையெனில், பேச்சால் துன்பம் வரும்.
          </p>
        </div>
        <p className="text-white/20 text-xs mt-3 text-right">— திருவள்ளுவர் • குறள் 127</p>
      </motion.div>

    </div>
  )
}
