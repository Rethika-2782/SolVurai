'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'

type Mode = 'login' | 'signup'

export default function AuthPage() {
  const { signInGoogle, signInEmail, signUpEmail } = useAuth()
  const router = useRouter()

  const [mode,     setMode]     = useState<Mode>('login')
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error,    setError]    = useState('')

  async function handleGoogle() {
    setError('')
    setGoogleLoading(true)
    try {
      await signInGoogle()
      toast.success('வணக்கம்! Welcome back 🙏')
      router.push('/dashboard')
    } catch (e: any) {
      setError(e.message || 'Google sign-in failed')
      toast.error(e.message || 'Google sign-in failed')
    } finally {
      setGoogleLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!email.trim()) { setError('Please enter your email'); return }
    if (!password.trim()) { setError('Please enter your password'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    if (mode === 'signup' && !name.trim()) { setError('Please enter your name'); return }

    setLoading(true)
    try {
      if (mode === 'signup') {
        await signUpEmail(email.trim(), password, name.trim())
        toast.success('கணக்கு உருவாக்கப்பட்டது! Account created 🎉')
      } else {
        await signInEmail(email.trim(), password)
        toast.success('வணக்கம்! Welcome back 🙏')
      }
      router.push('/dashboard')
    } catch (e: any) {
      // Show friendly Firebase error messages
      let msg = e.message || 'Authentication failed'
      if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        msg = 'Incorrect email or password. Please try again.'
      } else if (msg.includes('email-already-in-use')) {
        msg = 'This email is already registered. Please sign in instead.'
      } else if (msg.includes('invalid-email')) {
        msg = 'Please enter a valid email address.'
      } else if (msg.includes('weak-password')) {
        msg = 'Password must be at least 6 characters.'
      } else if (msg.includes('network')) {
        msg = 'Network error. Please check your connection.'
      }
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'var(--ink-950)' }}>

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #FF6B1A 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)' }} />
        <div className="absolute inset-0 kolam-bg opacity-20" />
        {/* Thiruvalluvar */}
        <div className="absolute inset-0"
          style={{
            backgroundImage: "url('/thiruvalluvar.png')",
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center left',
            opacity: 0.04,
          }} />
      </div>

      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col items-center justify-center w-1/2 h-screen relative">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center px-12"
        >
          {/* Full Tamil word சொல்வுரை — not just சொ */}
          <motion.div
            className="tamil text-[80px] leading-none font-bold mb-6 select-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255,107,26,0.4), rgba(124,58,237,0.4))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            சொல்வுரை
          </motion.div>

          <h2 className="font-display text-4xl font-bold mb-3"
            style={{
              background: 'linear-gradient(135deg, #FF6B1A, #FFB830)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
            SolVurai
          </h2>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs mx-auto">
            AI-powered Tamil dialogue generation &amp; language learning platform
          </p>

          <div className="flex flex-wrap gap-2 justify-center mt-8">
            {[
              '🗣️ உரையாடல் உருவாக்கம்',
              '🎭 உணர்ச்சி தழுவல்',
              '📊 இலக்கண பகுப்பு',
              '🔄 நடை மாற்றம்',
            ].map(f => (
              <span key={f}
                className="text-xs px-3 py-1.5 rounded-full tamil text-white/60"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {f}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md mx-4 lg:mx-0 lg:mr-24"
      >
        <div className="glass-strong rounded-2xl p-8 shadow-[0_24px_64px_rgba(0,0,0,0.5)]">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="tamil text-3xl gradient-saffron font-bold mb-2">சொல்வுரை</div>
            <h1 className="text-2xl font-bold text-white font-body">
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="text-white/40 text-sm mt-1 tamil">
              {mode === 'login' ? 'உங்கள் கணக்கில் உள்நுழையவும்' : 'புதிய கணக்கு உருவாக்கவும்'}
            </p>
          </div>

          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-medium text-white/80 transition-all duration-200 mb-6 disabled:opacity-50"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
          >
            {googleLoading ? <Spinner /> : (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {googleLoading ? 'Signing in…' : 'Continue with Google'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <span className="text-white/30 text-xs tamil">அல்லது / or</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* Mode Toggle */}
          <div className="flex rounded-xl p-1 mb-6" style={{ background: 'rgba(255,255,255,0.04)' }}>
            {(['login', 'signup'] as Mode[]).map(m => (
              <button key={m} onClick={() => { setMode(m); setError('') }}
                className="flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                style={mode === m ? {
                  background: 'linear-gradient(135deg, #FF6B1A, #FFB830)',
                  color: 'white',
                } : { color: 'rgba(255,255,255,0.4)' }}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 px-4 py-3 rounded-xl text-sm text-red-300 bg-red-500/10 border border-red-500/20"
            >
              ⚠️ {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence>
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-xs text-white/40 mb-1.5">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="உங்கள் பெயர்"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-orange-500/50 transition-colors"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs text-white/40 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                placeholder="your@email.com"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-orange-500/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-white/40 mb-1.5">
                Password {mode === 'signup' && <span className="text-white/20">(min 6 characters)</span>}
              </label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                placeholder="••••••••"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-orange-500/50 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-saffron w-full py-3 rounded-xl text-sm font-semibold disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner />
                  <span>Please wait…</span>
                </span>
              ) : mode === 'login'
                ? 'உள்நுழை — Sign In'
                : 'கணக்கு உருவாக்கு — Sign Up'}
            </button>
          </form>

          <p className="text-center text-white/20 text-xs mt-6">
            By continuing, you agree to SolVurai&apos;s Terms &amp; Privacy Policy
          </p>
        </div>
      </motion.div>
    </div>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
      <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
    </svg>
  )
}
