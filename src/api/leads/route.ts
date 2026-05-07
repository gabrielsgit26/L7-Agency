// src/app/api/leads/route.ts
import { NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase/admin' // server-side Firebase Admin SDK
import { db } from '@/lib/firebase/client'
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'

export async function GET(req: Request) {
    // 1️⃣ Get user token from headers or cookies
    const token = req.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const decoded = await adminAuth.verifyIdToken(token)
        const uid = decoded.uid
        const role = decoded.role || 'salesperson'

        let q
        if (role === 'admin') {
            q = query(collection(db, 'leads')) // Admin sees all leads
        } else {
            q = query(collection(db, 'leads'), where('assignedTo', '==', uid)) // Salesperson sees only their leads
        }

        const snapshot = await getDocs(q)
        const leads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

        return NextResponse.json({ leads })
    } catch (error) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
}

export async function POST(req: Request) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const decoded = await adminAuth.verifyIdToken(token)
    const uid = decoded.uid
    const role = decoded.role || 'salesperson'

    const data = await req.json()
    const { firstName, lastName, email, phone, status, assignedTo, notes } = data

    // Salesperson can only create leads assigned to themselves
    if (role === 'salesperson' && assignedTo !== uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const docRef = await addDoc(collection(db, 'leads'), {
      firstName,
      lastName,
      email,
      phone,
      status,
      assignedTo,
      notes,
      createdAt: serverTimestamp(),
    })

    return NextResponse.json({ id: docRef.id })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create lead' }, { status: 500 })
  }
}


export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const decoded = await adminAuth.verifyIdToken(token)
    const uid = decoded.uid
    const role = decoded.role || 'salesperson'

    const leadRef = doc(db, 'leads', params.id)
    const leadSnap = await getDoc(leadRef)

    if (!leadSnap.exists()) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })

    const leadData = leadSnap.data()

    // Only admin or assigned salesperson can update
    if (role !== 'admin' && leadData.assignedTo !== uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const data = await req.json()
    await updateDoc(leadRef, data)

    return NextResponse.json({ message: 'Lead updated' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update lead' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const decoded = await adminAuth.verifyIdToken(token)
    const uid = decoded.uid
    const role = decoded.role || 'salesperson'

    const leadRef = doc(db, 'leads', params.id)
    const leadSnap = await getDoc(leadRef)

    if (!leadSnap.exists()) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })

    const leadData = leadSnap.data()

    // Only admin or assigned salesperson can delete
    if (role !== 'admin' && leadData.assignedTo !== uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await deleteDoc(leadRef)
    return NextResponse.json({ message: 'Lead deleted' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete lead' }, { status: 500 })
  }
}