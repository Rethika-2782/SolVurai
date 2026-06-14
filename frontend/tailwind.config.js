/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // SolVurai brand palette — deep saffron + dark ink
        brand: {
          saffron:  '#FF6B1A',
          gold:     '#FFB830',
          kumkum:   '#C8102E',
          indigo:   '#4F46E5',
          violet:   '#7C3AED',
          glow:     '#A855F7',
        },
        ink: {
          950: '#050508',
          900: '#0A0A14',
          800: '#10101E',
          700: '#16162A',
          600: '#1E1E38',
          500: '#2A2A4A',
        },
        surface: {
          DEFAULT: 'rgba(255,255,255,0.04)',
          hover:   'rgba(255,255,255,0.08)',
          border:  'rgba(255,255,255,0.08)',
        },
      },
      fontFamily: {
        tamil:   ['Noto Sans Tamil', 'serif'],
        display: ['Cinzel Decorative', 'serif'],
        body:    ['DM Sans', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'saffron-radial': 'radial-gradient(ellipse at top, #FF6B1A22 0%, transparent 70%)',
        'violet-radial':  'radial-gradient(ellipse at bottom right, #7C3AED22 0%, transparent 70%)',
        'gold-glow':      'radial-gradient(circle, #FFB83040 0%, transparent 60%)',
        'hero-mesh':      `
          radial-gradient(at 20% 30%, #FF6B1A18 0px, transparent 50%),
          radial-gradient(at 80% 10%, #7C3AED20 0px, transparent 50%),
          radial-gradient(at 50% 80%, #FFB83015 0px, transparent 50%)
        `,
      },
      animation: {
        'fade-in':      'fadeIn 0.6s ease forwards',
        'slide-up':     'slideUp 0.5s ease forwards',
        'glow-pulse':   'glowPulse 2s ease-in-out infinite',
        'float':        'float 3s ease-in-out infinite',
        'shimmer':      'shimmer 2s linear infinite',
        'type-cursor':  'typeCursor 1s step-end infinite',
        'kolam-spin':   'kolamSpin 20s linear infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        glowPulse: { '0%,100%': { opacity: '0.6' }, '50%': { opacity: '1' } },
        float:     { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        shimmer:   { from: { backgroundPosition: '-200% 0' }, to: { backgroundPosition: '200% 0' } },
        typeCursor:{ '0%,100%': { opacity: '1' }, '50%': { opacity: '0' } },
        kolamSpin: { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
      },
      boxShadow: {
        'saffron': '0 0 30px rgba(255,107,26,0.3)',
        'violet':  '0 0 30px rgba(124,58,237,0.3)',
        'gold':    '0 0 20px rgba(255,184,48,0.4)',
        'glass':   '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
      },
    },
  },
  plugins: [],
}
