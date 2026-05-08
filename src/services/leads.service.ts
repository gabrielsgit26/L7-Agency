// ============================================
// FILE: src/services/leads.service.ts
// ============================================

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'

import { db } from '@/lib/firebase/client'
import { Lead } from '@/types/lead'

// ============================================
// Types
// ============================================


// ============================================
// COLLECTION REFERENCE
// ============================================

const leadsCollection =
  collection(db, 'leads')

// ============================================
// CREATE LEAD
// ============================================

export async function createLead(
  data: Lead
) {
  try {
    const response = await addDoc(
      leadsCollection,
      {
        ...data,

        createdAt:
          serverTimestamp(),
      }
    )

    return {
      success: true,
      id: response.id,
    }
  } catch (error: any) {
    console.error(
      'Create Lead Error:',
      error
    )

    return {
      success: false,
      message:
        error.message ||
        'Failed to create lead.',
    }
  }
}

// ============================================
// GET ALL LEADS
// ADMIN USE
// ============================================

export async function getAllLeads() {
  try {
    const q = query(
      leadsCollection,
      orderBy('createdAt', 'desc')
    )

    const snapshot =
      await getDocs(q)

    const leads: Lead[] =
      snapshot.docs.map((doc) => ({
        ...(doc.data() as Lead),
      }))

    return {
      success: true,
      data: leads,
    }
  } catch (error: any) {
    console.error(
      'Get Leads Error:',
      error
    )

    return {
      success: false,
      message:
        error.message ||
        'Failed to fetch leads.',
    }
  }
}

// ============================================
// GET USER LEADS
// SALESPERSON USE
// ============================================

export async function getUserLeads(
  userId: string
) {
  try {
    const q = query(
      leadsCollection,

      where(
        'assignedTo',
        '==',
        userId
      ),

      orderBy('createdAt', 'desc')
    )

    const snapshot =
      await getDocs(q)

    const leads: Lead[] =
      snapshot.docs.map((doc) => ({
        ...(doc.data() as Lead),
      }))

    return {
      success: true,
      data: leads,
    }
  } catch (error: any) {
    console.error(
      'Get User Leads Error:',
      error
    )

    return {
      success: false,
      message:
        error.message ||
        'Failed to fetch user leads.',
    }
  }
}

// ============================================
// UPDATE LEAD
// ============================================

export async function updateLead(
  leadId: string,
  data: Partial<Lead>
) {
  try {
    const leadRef = doc(
      db,
      'leads',
      leadId
    )

    await updateDoc(leadRef, {
      ...data,
    })

    return {
      success: true,
    }
  } catch (error: any) {
    console.error(
      'Update Lead Error:',
      error
    )

    return {
      success: false,
      message:
        error.message ||
        'Failed to update lead.',
    }
  }
}

// ============================================
// DELETE LEAD
// ============================================

export async function deleteLead(
  leadId: string
) {
  try {
    const leadRef = doc(
      db,
      'leads',
      leadId
    )

    await deleteDoc(leadRef)

    return {
      success: true,
    }
  } catch (error: any) {
    console.error(
      'Delete Lead Error:',
      error
    )

    return {
      success: false,
      message:
        error.message ||
        'Failed to delete lead.',
    }
  }
}

// ============================================
// REALTIME LEADS LISTENER
// ============================================

export function subscribeToLeads(
  callback: (leads: Lead[]) => void
) {
  const q = query(
    leadsCollection,
    orderBy('createdAt', 'desc')
  )

  return onSnapshot(q, (snapshot) => {
    const leads: Lead[] =
      snapshot.docs.map((doc) => ({
        ...(doc.data() as Lead),
      }))

    callback(leads)
  })
}

// ============================================
// REALTIME USER LEADS LISTENER
// ============================================

export function subscribeToUserLeads(
  userId: string,
  callback: (leads: Lead[]) => void
) {
  const q = query(
    leadsCollection,

    where(
      'assignedTo',
      '==',
      userId
    ),

    orderBy('createdAt', 'desc')
  )

  return onSnapshot(q, (snapshot) => {
    const leads: Lead[] =
      snapshot.docs.map((doc) => ({
        ...(doc.data() as Lead),
      }))

    callback(leads)
  })
}