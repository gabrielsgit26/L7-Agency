// types/lead.ts

import { Timestamp } from 'firebase/firestore'

// types/lead.ts
export type LeadStatus =
  | "New"
  | "Contacted"
  | "Qualified"
  | "Proposal Sent"
  | "Negotiation"
  | "Won"
  | "Lost"

export interface Lead {
  id: any           // ✅ add this
  firstName: string
  lastName: string
  email: string
  phone: string
  status?: LeadStatus
  assignedTo: string
  notes?: string
}