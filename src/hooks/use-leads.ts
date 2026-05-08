// ============================================
// FILE: src/hooks/use-leads.ts
// ============================================

'use client'

import { useEffect, useState } from 'react'

import {
  subscribeToLeads,
  subscribeToUserLeads,
} from '@/services/leads.service'

import { useAuth } from '@/context/auth-context'
import { Lead } from '@/types/lead'

// ============================================
// Hook Return Type
// ============================================

interface UseLeadsReturn {
  leads: Lead[]

  loading: boolean

  error: string | null
}

// ============================================
// useLeads Hook
// ============================================

export function useLeads(): UseLeadsReturn {
  const { user, role } =
    useAuth()

  // ============================================
  // State
  // ============================================

  const [leads, setLeads] =
    useState<Lead[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  // ============================================
  // Realtime Subscription
  // ============================================

  useEffect(() => {
    if (!user) {
      setLoading(false)

      return
    }

    let unsubscribe: (() => void) | undefined

    try {
      // ========================================
      // ADMIN → ALL LEADS
      // ========================================

      if (role === 'admin') {
        unsubscribe =
          subscribeToLeads(
            (data) => {
              setLeads(data)

              setLoading(false)
            }
          )
      }

      // ========================================
      // SALESPERSON → OWN LEADS
      // ========================================

      else {
        unsubscribe =
          subscribeToUserLeads(
            user.uid,
            (data) => {
              setLeads(data)

              setLoading(false)
            }
          )
      }
    } catch (err: any) {
      console.error(err)

      setError(
        err.message ||
          'Failed to fetch leads.'
      )

      setLoading(false)
    }

    // ============================================
    // Cleanup Listener
    // ============================================

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [user, role])

  // ============================================
  // Return
  // ============================================

  return {
    leads,
    loading,
    error,
  }
}