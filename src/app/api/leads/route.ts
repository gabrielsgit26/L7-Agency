// src/app/api/leads/route.ts
import { NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase/admin'
import { FieldValue } from 'firebase-admin/firestore'

export async function GET(req: Request) {
  // 1️⃣ Get user token from headers or cookies
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const decoded = await adminAuth.verifyIdToken(token)
    const uid = decoded.uid

    // Fetch user role from Firestore
    const userDoc = await adminDb.collection('users').doc(uid).get()
    const role = userDoc.data()?.role || 'salesperson'

    let query
    if (role === 'admin') {
      query = adminDb.collection('leads')
    } else {
      query = adminDb.collection('leads').where('assignedTo', '==', uid)
    }

    const snapshot = await query.get()
    const leads = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))

    return NextResponse.json({ leads })
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function POST(req: Request) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    console.log('Create Lead API Token:', token) // Debugging line
    const decoded = await adminAuth.verifyIdToken(token)
    const uid = decoded.uid

    const data = await req.json()
    const {
      firstName,
      lastName,
      email,
      whatsapp,
      enterprise,
      status,
      contractValue,
      estimatedValue,
      keyCustomerPainPoints,
      companyAnalysis,
      strategicMessage,
      assignedTo,
      notes
    } = data
    console.log('Create Lead Data:', data) // Debugging line

    const docRef = await adminDb.collection('leads').add({
      firstName,
      lastName,
      email,
      whatsapp,
      enterprise,
      status,
      contractValue,
      estimatedValue,
      keyCustomerPainPoints,
      companyAnalysis,
      strategicMessage,
      assignedTo: assignedTo || uid, // Default to self if not assigned
      notes,
      createdAt: FieldValue.serverTimestamp(),
    })

    return NextResponse.json({ id: docRef.id })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create lead' }, { status: 500 })
  }
}


export async function PATCH(req: Request) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const decoded = await adminAuth.verifyIdToken(token)
    const uid = decoded.uid

    // Fetch user role from Firestore
    const userDoc = await adminDb.collection('users').doc(uid).get()
    const role = userDoc.data()?.role || 'salesperson'
    const data = await req.json()

    const leadRef = adminDb.collection('leads').doc(data.id)
    const leadSnap = await leadRef.get()

    if (!leadSnap.exists) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })

    const leadData = leadSnap.data()

    // Only admin or assigned salesperson can update
    if (role !== 'admin' && leadData?.assignedTo !== uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await leadRef.update(data)

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

    // Fetch user role from Firestore
    const userDoc = await adminDb.collection('users').doc(uid).get()
    const role = userDoc.data()?.role || 'salesperson'

    const leadRef = adminDb.collection('leads').doc(params.id)
    const leadSnap = await leadRef.get()

    if (!leadSnap.exists) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })

    const leadData = leadSnap.data()

    // Only admin or assigned salesperson can delete
    if (role !== 'admin' && leadData?.assignedTo !== uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await leadRef.delete()
    return NextResponse.json({ message: 'Lead deleted' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete lead' }, { status: 500 })
  }
}