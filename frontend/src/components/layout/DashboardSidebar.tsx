'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles, ArrowLeftRight, Heart, BookOpen, History, LogOut, ChevronRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import ThemeToggle from '@/components/ui/ThemeToggle'

const NAV = [
  { href: '/dashboard',             icon: Sparkles,       label: 'Generator',     tamil: 'உருவாக்கி' },
  { href: '/dashboard/transformer', icon: ArrowLeftRight, label: 'Style Transform', tamil: 'நடை மாற்றம்' },
  { href: '/dashboard/emotion',     icon: Heart,          label: 'Emotion Engine', tamil: 'உணர்ச்சி' },
  { href: '/dashboard/grammar',     icon: BookOpen,       label: 'Grammar AI',    tamil: 'இலக்கணம்' },
  { href: '/dashboard/history',     icon: History,        label: 'History',       tamil: 'வரலாறு' },
]

export default function DashboardSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const router = useRouter()

  async function handleLogout() {
    await logout()
    toast.success('போய் வாருங்கள்! See you soon 🙏')
    router.push('/')
  }

  return (
    <aside className="flex flex-col w-64 h-screen sticky top-0 glass border-r"
      style={{ borderColor: 'rgba(255,255,255,0.06)' }}>

      {/* Logo */}
      <div className="px-4 py-5 border-b flex items-center justify-between"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #FF6B1A, #FFB830)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 21h6M12 3C8.686 3 6 5.686 6 9c0 2.21 1.196 4.14 2.979 5.196L10 15h4l1.021-0.804C16.804 13.14 18 11.21 18 9c0-3.314-2.686-6-6-6z"
                stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M10 15v3h4v-3" stroke="white" strokeWidth="1.8" />
            </svg>
          </div>
          <div>
            <div className="font-display text-base font-bold gradient-saffron">SolVurai</div>
            <div className="tamil text-[10px] text-white/30">சொல்வுரை</div>
          </div>
        </Link>
        <ThemeToggle />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] uppercase tracking-widest text-white/20 px-3 mb-3">
          Features — அம்சங்கள்
        </p>
        {NAV.map(({ href, icon: Icon, label, tamil }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href}>
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 group"
                style={active ? {
                  background: 'linear-gradient(135deg, rgba(255,107,26,0.2), rgba(124,58,237,0.15))',
                  border: '1px solid rgba(255,107,26,0.3)',
                } : { border: '1px solid transparent' }}
              >
                <Icon size={16} className={active ? 'text-orange-400' : 'text-white/30 group-hover:text-white/60'} />
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${active ? 'text-white' : 'text-white/50 group-hover:text-white/80'}`}>
                    {label}
                  </div>
                  <div className="tamil text-[10px] text-white/20">{tamil}</div>
                </div>
                {active && <ChevronRight size={12} className="text-orange-400" />}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="px-3 pb-4 border-t pt-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="avatar" className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #FF6B1A, #7C3AED)' }}>
              {(user?.displayName || user?.email || 'U')[0].toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-sm text-white/80 truncate">{user?.displayName || 'User'}</div>
            <div className="text-[10px] text-white/30 truncate">{user?.email}</div>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150 text-sm">
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
