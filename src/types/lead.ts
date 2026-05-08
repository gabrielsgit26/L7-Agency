// types/lead.ts

import { Timestamp } from 'firebase/firestore'

// types/lead.ts
export type LeadStatus =
  | "New Lead"
  | "Under Negotiation"
  | "Closed/Won"

export interface Lead {
  id?: any
  // Contact Information
  firstName: string
  lastName: string
  email: string
  whatsapp: string
  enterprise: string
  
  // Lead Status & Value
  status?: LeadStatus
  contractValue: number
  estimatedValue: number
  
  // Lead Details
  keyCustomerPainPoints: string
  companyAnalysis: string
  strategicMessage: string
  
  // Assignment
  assignedTo: string
  assignedToName?: string // For admin view
  notes?: string
}

