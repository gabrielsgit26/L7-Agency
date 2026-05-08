import { NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase/admin'

export async function GET(req: Request) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  console.log('List Users API Token:', token) // Debugging line
  try {
    const decoded = await adminAuth.verifyIdToken(token)
    const requesterUid = decoded.uid

    const requesterDoc = await adminDb.collection('users').doc(requesterUid).get()
    if (!requesterDoc.exists) {
      return NextResponse.json({ error: 'Requester not found' }, { status: 404 })
    }

    const requesterRole = requesterDoc.data()?.role
    if (requesterRole !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const salesSnapshot = await adminDb
      .collection('users')
      .where('role', '==', 'salesperson')
      .get()

    const users = salesSnapshot.docs.map((doc) => {
      const data = doc.data()

      return {
        uid: doc.id,
        name: data.name || '',
        email: data.email || '',
        role: data.role || 'salesperson',
        createdAt:
          data.createdAt?.toDate?.()?.toISOString?.() || null,
      }
    })

    return NextResponse.json({ success: true, users })
  } catch (error) {
    console.error('List Users API Error:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
