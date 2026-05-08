// ============================================
// FILE: src/lib/firebase/admin.ts
// ============================================

import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

// Initialize Firebase Admin only once
const adminApp =
  getApps().length === 0
    ? initializeApp({
        credential: cert({
          projectId:
            process.env.FIREBASE_PROJECT_ID,

          clientEmail:
            process.env.FIREBASE_CLIENT_EMAIL,

          privateKey:
            process.env.FIREBASE_PRIVATE_KEY?.replace(
              /\\n/g,
              '\n'
            ),
        }),
      })
    : getApps()[0]

// Admin Services
export const adminAuth = getAuth(adminApp)

export const adminDb =
  getFirestore(adminApp)

export default adminApp