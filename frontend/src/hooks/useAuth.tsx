'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider } from '@/lib/firebase'
import type { UserProfile } from '@/types'

interface AuthContextValue {
  user:         User | null
  profile:      UserProfile | null
  loading:      boolean
  signInGoogle: () => Promise<void>
  signInEmail:  (email: string, password: string) => Promise<void>
  signUpEmail:  (email: string, password: string, name: string) => Promise<void>
  logout:       () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (u) {
        try {
          const snap = await getDoc(doc(db, 'users', u.uid))
          if (snap.exists()) {
            setProfile(snap.data() as UserProfile)
          }
        } catch (e) {
          console.error('Profile fetch error:', e)
        }
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  async function upsertUser(u: User) {
    try {
      const ref  = doc(db, 'users', u.uid)
      const snap = await getDoc(ref)
      if (!snap.exists()) {
        await setDoc(ref, {
          uid:         u.uid,
          email:       u.email,
          displayName: u.displayName,
          photoURL:    u.photoURL,
          createdAt:   serverTimestamp(),
          stats: {
            totalGenerated:  0,
            totalSaved:      0,
            avgGrammarScore: 0,
            streak:          1,
          },
        })
      }
      const updated = await getDoc(ref)
      setProfile(updated.data() as UserProfile)
    } catch (e) {
      console.error('upsertUser error:', e)
    }
  }

  async function signInGoogle() {
    const result = await signInWithPopup(auth, googleProvider)
    await upsertUser(result.user)
  }

  async function signInEmail(email: string, password: string) {
    const result = await signInWithEmailAndPassword(auth, email, password)
    await upsertUser(result.user)
  }

  async function signUpEmail(email: string, password: string, name: string) {
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters')
    }
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(result.user, { displayName: name })
    // Reload user to get updated displayName
    await result.user.reload()
    await upsertUser(result.user)
  }

  async function logout() {
    await signOut(auth)
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{
      user, profile, loading,
      signInGoogle, signInEmail, signUpEmail, logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
