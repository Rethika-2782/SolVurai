import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/hooks/useAuth'
import { ThemeProvider } from '@/hooks/useTheme'
import './globals.css'

export const metadata: Metadata = {
  title: 'SolVurai — AI Tamil Dialogue Platform | சொல்வுரை',
  description: 'AI-powered Tamil dialogue generation, style transformation, emotion engine and grammar analysis.',
  keywords: 'Tamil AI, Tamil dialogue, Tamil grammar, Tamil learning, Gemini Tamil',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ta" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <meta name="theme-color" content="#050508" />
      </head>
      <body className="bg-ink-950 text-white antialiased font-body">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: 'rgba(22,22,42,0.95)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.85)',
                  borderRadius: '12px',
                  fontSize: '13px',
                },
                success: { iconTheme: { primary: '#FF6B1A', secondary: 'white' } },
                error: { iconTheme: { primary: '#EF4444', secondary: 'white' } },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
