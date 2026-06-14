'use client'

import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
      style={{
        background: isDark ? 'rgba(255,184,48,0.1)' : 'rgba(99,102,241,0.1)',
        border: isDark
          ? '1px solid rgba(255,184,48,0.3)'
          : '1px solid rgba(99,102,241,0.3)',
      }}
    >
      {isDark ? (
        <Sun size={15} className="text-yellow-400" />
      ) : (
        <Moon size={15} className="text-indigo-500" />
      )}
    </motion.button>
  )
}
