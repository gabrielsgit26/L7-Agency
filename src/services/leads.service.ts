'use client'

import { Lead } from '@/types/lead'
import { auth } from '@/lib/firebase/client'

interface CreateLeadDTO {
  firstName: string
  lastName: string
  email: string
  phone: string
  status: Lead['status']
  assignedTo: string
  notes?: string
}

interface UpdateLeadDTO {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  status?: Lead['status']
  assignedTo?: string
  notes?: string
}

// -----------------------------
// Helper: get Firebase ID Token
// -----------------------------
async function getAuthToken(): Promise<string> {
  const user = auth.currentUser
  if (!user) throw new Error('User not logged in')
  return await user.getIdToken()
}

// -----------------------------
// Leads Service
// -----------------------------
export const leadsService = {
  // Fetch leads (role filtered on server)
  async getLeads(): Promise<Lead[]> {
    const token = await getAuthToken()
    const res = await fetch('/api/leads', {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Failed to fetch leads')
    }

    const data = await res.json()
    return data.leads
  },

  // Create a new lead
  async createLead(lead: CreateLeadDTO): Promise<string> {
    const token = await getAuthToken()
    const res = await fetch('/api/leads/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(lead),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Failed to create lead')
    }

    const data = await res.json()
    return data.id
  },

  // Update a lead
  async updateLead(id: string, updates: UpdateLeadDTO): Promise<void> {
    const token = await getAuthToken()
    const res = await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Failed to update lead')
    }
  },

  // Delete a lead
  async deleteLead(id: string): Promise<void> {
    const token = await getAuthToken()
    const res = await fetch(`/api/leads/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Failed to delete lead')
    }
  },
}