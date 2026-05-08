'use client'

import React, { useState } from 'react'
import { doc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { Lead } from '@/types/lead'
import { toast } from 'sonner'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

interface DeleteLeadDialogProps {
  lead: Lead
  onDeleted?: () => void
}

export const DeleteLeadDialog: React.FC<DeleteLeadDialogProps> = ({
  lead,
  onDeleted,
}) => {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!lead.id) return
    setLoading(true)
    try {
      const leadRef = doc(db, 'leads', lead.id)
      await deleteDoc(leadRef)
      toast.success('Lead deleted successfully!')
      onDeleted?.()
    } catch (error) {
      console.error(error)
      toast.error('Failed to delete lead.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger >
        <Button variant="destructive" size="sm">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Delete Lead</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{lead.firstName} {lead.lastName}</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => { /* Dialog closes automatically */ }}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}