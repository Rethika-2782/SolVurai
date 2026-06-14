'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  onComplete: () => void
}

// Correct Tamil spelling: வணக்கம்
const VANAKKAM_CHARS = ['வ', 'ண', 'க்', 'க', 'ம்']

const TAGLINES = [
  'சொல்லின் சுவை அறிவோம்',
  'தமிழின் ஆற்றல் கண்டறிவோம்',
  'மொழியின் மாண்பு உணர்வோம்',
]

export default function VanakkamSplash({ onComplete }: Props) {
  const [phase, setPhase] = useState<'kolam' | 'vanakkam' | 'tagline' | 'exit'>('kolam')
  const [taglineIdx, setTaglineIdx] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('vanakkam'), 1200)
    const t2 = setTimeout(() => setPhase('tagline'), 2600)
    const t3 = setTimeout(() => {
      let i = 0
      const cycle = setInterval(() => {
        i++
        if (i < TAGLINES.length) {
          setTaglineIdx(i)
        } else {
          clearInterval(cycle)
          setPhase('exit')
          setTimeout(onComplete, 800)
        }
      }, 900)
    }, 3200)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [onComplete])

  return (
    <AnimatePresence>
      {phase !== 'exit' && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: '#050508' }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.7 }}
        >
          {/* Thiruvalluvar background */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "url('/thiruvalluvar.png')",
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              opacity: 0.05,
            }}
          />

          {/* Glow orbs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(255,107,26,0.12) 0%, transparent 70%)' }} />
            <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)' }} />
          </div>

          {/* Rotating kolam */}
          <motion.div
            className="absolute"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 0.2, scale: 1, rotate: 360 }}
            transition={{ duration: 1.2, rotate: { duration: 30, repeat: Infinity, ease: 'linear' } }}
          >
            <svg width="340" height="340" viewBox="0 0 100 100">
              {[15, 25, 35, 44].map((r, i) => (
                <circle key={r} cx="50" cy="50" r={r} fill="none"
                  stroke={i % 2 === 0 ? '#FF6B1A' : '#7C3AED'}
                  strokeWidth="0.4" strokeDasharray="2 3" />
              ))}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
                const rad = (deg * Math.PI) / 180
                const x = 50 + 44 * Math.cos(rad)
                const y = 50 + 44 * Math.sin(rad)
                return <circle key={i} cx={x} cy={y} r="1.5" fill={i % 2 === 0 ? '#FFB830' : '#FF6B1A'} />
              })}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
                const rad = (deg * Math.PI) / 180
                const x = 50 + 25 * Math.cos(rad)
                const y = 50 + 25 * Math.sin(rad)
                return <circle key={`i2${i}`} cx={x} cy={y} r="1" fill="#A855F7" />
              })}
            </svg>
          </motion.div>

          {/* வணக்கம் text */}
          <div className="relative z-10 text-center">
            {/* Full word display */}
            <motion.div
              className="tamil font-bold text-7xl md:text-9xl mb-2 select-none"
              style={{
                background: 'linear-gradient(135deg, #FF6B1A, #FFB830, #A855F7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 30px rgba(255,107,26,0.5))',
              }}
              initial={{ opacity: 0, y: 40, scale: 0.7 }}
              animate={phase !== 'kolam' ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.7, type: 'spring', stiffness: 150 }}
            >
              வணக்கம்
            </motion.div>

            <motion.p
              className="text-white/50 text-lg tracking-[0.4em] uppercase font-body mb-8"
              initial={{ opacity: 0 }}
              animate={phase === 'vanakkam' || phase === 'tagline' ? { opacity: 1 } : {}}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Welcome
            </motion.p>

            <AnimatePresence mode="wait">
              {phase === 'tagline' && (
                <motion.p
                  key={taglineIdx}
                  className="tamil text-xl md:text-2xl text-white/70 font-medium"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  {TAGLINES[taglineIdx]}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* App name bottom */}
          <motion.div
            className="absolute bottom-12 text-center"
            initial={{ opacity: 0 }}
            animate={phase === 'tagline' ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="flex items-center gap-2 justify-center mb-1">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M9 21h6M12 3C8.686 3 6 5.686 6 9c0 2.21 1.196 4.14 2.979 5.196L10 15h4l1.021-0.804C16.804 13.14 18 11.21 18 9c0-3.314-2.686-6-6-6z"
                  stroke="#FFB830" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M10 15v3h4v-3" stroke="#FF6B1A" strokeWidth="1.5" />
              </svg>
              <span className="font-display text-2xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, #FF6B1A, #FFB830)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                SolVurai
              </span>
            </div>
            <p className="tamil text-white/30 text-xs tracking-widest">
              சொல்வுரை — AI Tamil Expression Platform
            </p>
          </motion.div>

          {/* Loading dots */}
          <div className="absolute bottom-5 flex gap-1.5">
            {[0, 1, 2].map(i => (
              <motion.span key={i}
                className="w-1.5 h-1.5 rounded-full bg-orange-400/40"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ delay: i * 0.2, duration: 0.8, repeat: Infinity }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
