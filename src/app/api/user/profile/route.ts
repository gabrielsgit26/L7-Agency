// src/api/user/profile/route.ts
import { NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase/admin'

export async function GET(req: Request) {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const decoded = await adminAuth.verifyIdToken(token)
        const requesterUid = decoded.uid
        console.log('Decoded Token:', decoded) // Debugging line
        // Get requester's role
        const requesterDoc = await adminDb.collection('users').doc(requesterUid).get()
        if (!requesterDoc.exists) return NextResponse.json({ error: 'Requester not found' }, { status: 404 })
        const requesterRole = requesterDoc.data()?.role

        const url = new URL(req.url)
        const uid = url.searchParams.get('uid')
        if (!uid) return NextResponse.json({ error: 'Missing uid parameter' }, { status: 400 })

        // Check permissions: only owner or admin
        if (uid !== requesterUid && requesterRole !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // Fetch user profile
        const userDoc = await adminDb.collection('users').doc(uid).get()
        if (!userDoc.exists) return NextResponse.json({ error: 'User not found' }, { status: 404 })

        const userData = userDoc.data()
        return NextResponse.json({ success: true, data: userData })
    } catch (error) {
        console.error('Profile API Error:', error)
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
}