/**
 * Firestore Service — Fixed history saving
 * No orderBy (avoids composite index), sorts client-side
 */

import {
  collection, addDoc, getDocs, deleteDoc,
  doc, query, where, serverTimestamp,
  updateDoc, increment, getDoc, setDoc,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { SavedDialogue } from '@/types'

const COL = 'dialogues'

export async function saveDialogue(data: Omit<SavedDialogue, 'id' | 'createdAt'>) {
  try {
    const ref = await addDoc(collection(db, COL), {
      userId:     data.userId,
      title:      data.title,
      rawText:    data.rawText,
      lines:      data.lines,
      scenario:   data.scenario,
      emotion:    data.emotion,
      style:      data.style,
      difficulty: data.difficulty,
      topic:      data.topic || 'General',
      createdAt:  serverTimestamp(),
    })

    // Update user stats safely
    try {
      const userRef  = doc(db, 'users', data.userId)
      const userSnap = await getDoc(userRef)
      if (userSnap.exists()) {
        await updateDoc(userRef, { 'stats.totalSaved': increment(1) })
      } else {
        await setDoc(userRef, {
          uid:   data.userId,
          email: '',
          stats: {
            totalGenerated:  0,
            totalSaved:      1,
            avgGrammarScore: 0,
            streak:          1,
          },
        })
      }
    } catch {
      // Stats update failed silently — dialogue still saved
    }

    return ref.id
  } catch (e: any) {
    throw new Error('Failed to save: ' + e.message)
  }
}

export async function getUserDialogues(userId: string): Promise<SavedDialogue[]> {
  try {
    const q    = query(collection(db, COL), where('userId', '==', userId))
    const snap = await getDocs(q)
    const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as SavedDialogue))

    // Sort newest first — client side (no Firestore index needed)
    docs.sort((a, b) => {
      const aTime = a.createdAt?.seconds ?? 0
      const bTime = b.createdAt?.seconds ?? 0
      return bTime - aTime
    })

    return docs
  } catch (e: any) {
    console.error('getUserDialogues error:', e)
    return []
  }
}

export async function deleteDialogue(id: string, userId: string) {
  try {
    await deleteDoc(doc(db, COL, id))
    try {
      await updateDoc(doc(db, 'users', userId), {
        'stats.totalSaved': increment(-1),
      })
    } catch {
      // Silent
    }
  } catch (e: any) {
    throw new Error('Failed to delete: ' + e.message)
  }
}

export async function incrementGenerated(userId: string) {
  try {
    const userRef  = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)
    if (userSnap.exists()) {
      await updateDoc(userRef, { 'stats.totalGenerated': increment(1) })
    }
  } catch {
    // Silent
  }
}