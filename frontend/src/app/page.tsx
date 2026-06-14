'use client'

/**
 * Root page — Shows Vanakkam splash, then the full landing page.
 * If user is already logged in, redirects to dashboard.
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Sparkles, ArrowRight, Star, ChevronDown } from 'lucide-react'
import VanakkamSplash from '@/components/splash/VanakkamSplash'
import { useAuth } from '@/hooks/useAuth'

const FEATURES = [
  {
    icon: '🗣️', title: 'Dialogue Generator', tamil: 'உரையாடல் உருவாக்கி',
    desc: '8 scenarios × 7 emotions × 4 styles. Generate realistic Tamil conversations powered by Gemini AI.',
    color: '#FF6B1A',
  },
  {
    icon: '🔄', title: 'Style Transformer', tamil: 'நடை மாற்றி',
    desc: 'Convert any Tamil text between Spoken, Formal, Literary and Simplified styles instantly.',
    color: '#3B82F6',
  },
  {
    icon: '🎭', title: 'Emotion Engine', tamil: 'உணர்ச்சி என்ஜின்',
    desc: 'Dynamically recolor dialogue from Happy → Angry → Respectful → Emotional. The wow feature.',
    color: '#A855F7',
  },
  {
    icon: '📊', title: 'Grammar Intelligence', tamil: 'இலக்கண நுண்ணறிவு',
    desc: 'Deep AI scoring of Grammar, Fluency, Vocabulary & Formality with actionable insights.',
    color: '#10B981',
  },
  {
    icon: '💾', title: 'History & Export', tamil: 'வரலாறு & ஏற்றுமதி',
    desc: 'Firebase-backed dialogue library. Export as PDF or TXT with beautiful formatting.',
    color: '#FFB830',
  },
  {
    icon: '🔥', title: 'Thirukkural AI', tamil: 'திருக்குறள் AI',
    desc: 'Daily wisdom from Thiruvalluvar integrated throughout your Tamil learning journey.',
    color: '#C8102E',
  },
]

const TESTIMONIALS = [
  { name: 'Priya Ramesh',    role: 'Tamil Teacher',     text: 'SolVurai transformed how I create lesson material. The grammar analysis is incredibly accurate.', avatar: 'P', stars: 5 },
  { name: 'Karthik Selvam',  role: 'Language Learner',  text: 'As a non-native Tamil speaker, the style transformer helped me understand spoken vs formal Tamil differences.', avatar: 'K', stars: 5 },
  { name: 'Meera Krishnan',  role: 'Content Creator',   text: 'The emotion engine is absolutely magical. Same dialogue in 7 different emotions — never seen this before!', avatar: 'M', stars: 5 },
]

const STATS = [
  { value: '8+',   label: 'Scenarios',     tamil: 'காட்சிகள்' },
  { value: '7',    label: 'Emotions',      tamil: 'உணர்ச்சிகள்' },
  { value: '4',    label: 'Tamil Styles',  tamil: 'தமிழ் நடைகள்' },
  { value: '100%', label: 'Tamil Native',  tamil: 'தூய தமிழ்' },
]

export default function RootPage() {
  const [showSplash, setShowSplash] = useState(true)
  const [splashDone, setSplashDone] = useState(false)
  const { user, loading } = useAuth()
  const router = useRouter()

  // Redirect logged-in users to dashboard
  useEffect(() => {
    if (!loading && user && splashDone) {
      router.push('/dashboard')
    }
  }, [user, loading, splashDone, router])

  function onSplashComplete() {
    setShowSplash(false)
    setSplashDone(true)
    if (user) router.push('/dashboard')
  }

  return (
    <>
      {/* Vanakkam Splash */}
      {showSplash && <VanakkamSplash onComplete={onSplashComplete} />}

      {/* Landing Page */}
      <div className="min-h-screen" style={{ background: 'var(--ink-950)' }}>

        {/* ── Navbar ─────────────────────────────────────── */}
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #FF6B1A, #FFB830)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 21h6M12 3C8.686 3 6 5.686 6 9c0 2.21 1.196 4.14 2.979 5.196L10 15h4l1.021-0.804C16.804 13.14 18 11.21 18 9c0-3.314-2.686-6-6-6z"
                    stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                  <path d="M10 15v3h4v-3" stroke="white" strokeWidth="1.8"/>
                </svg>
              </div>
              <span className="font-display font-bold gradient-saffron">SolVurai</span>
              <span className="tamil text-white/30 text-xs hidden sm:block">சொல்வுரை</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/auth"
                className="text-sm text-white/50 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-white/5">
                Sign In
              </Link>
              <Link href="/auth"
                className="btn-saffron text-sm px-5 py-2 rounded-xl">
                Get Started
              </Link>
            </div>
          </div>
        </nav>

        {/* ── Hero Section ─────────────────────────────── */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
          {/* Mesh gradients */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px]"
              style={{ background: 'radial-gradient(ellipse, rgba(255,107,26,0.12) 0%, transparent 70%)' }} />
            <div className="absolute top-20 right-0 w-[400px] h-[400px]"
              style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)' }} />
            <div className="absolute inset-0 kolam-bg opacity-20" />
          </div>

          <div className="relative max-w-4xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: splashDone ? 1 : 0, y: splashDone ? 0 : -10 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs mb-8 glass-saffron"
            >
              <Sparkles size={12} className="text-orange-400" />
              <span className="text-orange-300">DTEC 2026 Hackathon — AI Tamil Innovation</span>
            </motion.div>

            {/* Hero heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: splashDone ? 1 : 0, y: splashDone ? 0 : 20 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-5xl md:text-7xl font-bold mb-4 leading-tight"
            >
              <span className="text-white">The AI Platform for</span>
              <br />
              <span className="gradient-hero">Tamil Expression</span>
            </motion.h1>

            {/* Tamil subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: splashDone ? 1 : 0, y: splashDone ? 0 : 10 }}
              transition={{ delay: 0.5 }}
              className="tamil text-2xl md:text-3xl text-white/60 mb-4 leading-relaxed"
            >
              சொல்லும் திறன் வளர்க்கும் AI தளம்
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: splashDone ? 1 : 0 }}
              transition={{ delay: 0.7 }}
              className="text-white/40 text-lg mb-10 max-w-2xl mx-auto"
            >
              Generate Tamil dialogues, transform styles, adapt emotions, and master grammar
              with the power of Google Gemini AI.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: splashDone ? 1 : 0, y: splashDone ? 0 : 10 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Link href="/auth"
                className="btn-saffron px-8 py-3.5 rounded-xl text-base font-semibold flex items-center justify-center gap-2 group">
                <span>தொடங்குங்கள் — Get Started Free</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#features"
                className="px-8 py-3.5 rounded-xl text-base font-medium text-white/60 hover:text-white glass transition-all duration-200 flex items-center justify-center gap-2">
                <span>See Features</span>
                <ChevronDown size={16} />
              </a>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: splashDone ? 1 : 0 }}
              transition={{ delay: 1 }}
              className="flex justify-center gap-8 mt-14"
            >
              {STATS.map(({ value, label, tamil }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-bold gradient-saffron">{value}</div>
                  <div className="text-xs text-white/40">{label}</div>
                  <div className="tamil text-[10px] text-white/20">{tamil}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Demo preview card */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: splashDone ? 1 : 0, y: splashDone ? 0 : 40, scale: splashDone ? 1 : 0.96 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="max-w-2xl mx-auto mt-16 glass rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(255,107,26,0.15)' }}
          >
            <div className="px-4 py-3 flex items-center gap-2 border-b"
              style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,107,26,0.05)' }}>
              <div className="flex gap-1.5">
                {['#EF4444','#FFB830','#10B981'].map(c => (
                  <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
                ))}
              </div>
              <span className="text-xs text-white/30 ml-2">SolVurai — நண்பர்கள் உரையாடல்</span>
            </div>
            <div className="p-5 space-y-4">
              {[
                { speaker: 'Arun', text: 'டேய் கார்த்தி! நீ இன்னும் வரலையா? திரைப்படம் ஆரம்பிக்க போகுதுடா!', side: 'left',  color: '#FF6B1A' },
                { speaker: 'Karthi', text: 'ஆமாடா! ஐந்து நிமிஷம்தான். ஆட்டோல வருகிறேன். கொஞ்சம் wait பண்ணு!', side: 'right', color: '#7C3AED' },
                { speaker: 'Arun', text: 'சீக்கிரம் வா! Popcorn வாங்கியாச்சு. நீ வரலன்னா தனியா சாப்பிடுவேன்! 😄', side: 'left',  color: '#FF6B1A' },
              ].map((line, i) => (
                <div key={i} className={`flex gap-3 ${line.side === 'right' ? 'flex-row-reverse' : ''}`}>
                  <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: `linear-gradient(135deg, ${line.color}, ${line.color}99)` }}>
                    {line.speaker[0]}
                  </div>
                  <div className={`max-w-[70%] flex flex-col ${line.side === 'right' ? 'items-end' : ''}`}>
                    <span className="text-[10px] text-white/25 mb-1">{line.speaker}</span>
                    <div className="rounded-2xl px-4 py-2.5 tamil text-sm text-white/80 leading-relaxed"
                      style={{ background: `${line.color}15`, border: `1px solid ${line.color}25` }}>
                      {line.text}
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-2 text-white/20 text-xs pl-10">
                <motion.span animate={{ opacity: [0,1,0] }} transition={{ duration: 1.2, repeat: Infinity }}>●</motion.span>
                <span className="tamil">AI தமிழில் உரையாடல் உருவாக்குகிறது…</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── Features Section ─────────────────────────── */}
        <section id="features" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs uppercase tracking-widest text-orange-400 mb-2">Features — அம்சங்கள்</p>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
                Everything you need to master Tamil
              </h2>
              <p className="tamil text-white/40 text-lg">தமிழில் தேர்ச்சி பெற தேவையான அனைத்தும்</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="glass rounded-2xl p-6 transition-all duration-200"
                  style={{ border: `1px solid ${f.color}20` }}
                >
                  <div className="text-3xl mb-4">{f.icon}</div>
                  <h3 className="text-base font-semibold text-white mb-0.5">{f.title}</h3>
                  <p className="tamil text-xs text-white/30 mb-3">{f.tamil}</p>
                  <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ─────────────────────────────── */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-widest text-orange-400 mb-2">Testimonials</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Loved by Tamil learners</h2>
              <p className="tamil text-white/40 mt-1">தமிழ் கற்பவர்களின் கருத்துகள்</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TESTIMONIALS.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-2xl p-6"
                >
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} size={13} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed mb-5">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ background: 'linear-gradient(135deg, #FF6B1A, #7C3AED)' }}>
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{t.name}</div>
                      <div className="text-xs text-white/30">{t.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────── */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="glass rounded-3xl p-10 md:p-16 relative overflow-hidden"
              style={{ border: '1px solid rgba(255,107,26,0.2)' }}>
              <div className="absolute inset-0"
                style={{ background: 'radial-gradient(circle at center, rgba(255,107,26,0.08) 0%, transparent 70%)' }}/>
              <p className="tamil text-orange-300/80 text-xl mb-3">வாருங்கள்! தமிழை மேலும் அறிவோம்!</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Start your Tamil AI journey today
              </h2>
              <p className="text-white/40 mb-8">
                Free forever. No credit card required. Generate your first Tamil dialogue in seconds.
              </p>
              <Link href="/auth"
                className="btn-saffron inline-flex items-center gap-2 px-10 py-4 rounded-xl text-base font-semibold">
                <span>இலவசமாக தொடங்கு — Start Free</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Footer ───────────────────────────────────── */}
        <footer className="border-t py-8 px-4"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold gradient-saffron">SolVurai</span>
              <span className="tamil text-white/25 text-sm">சொல்வுரை</span>
            </div>
            <p className="tamil text-white/20 text-sm">
              DTEC 2026 — தமிழ் மொழி AI தளம் | Built with ❤️ for Tamil
            </p>
            <p className="text-white/20 text-xs">
              Powered by Google Gemini AI
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
