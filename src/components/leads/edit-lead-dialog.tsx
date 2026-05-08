// ============================================
// FILE: src/components/leads/edit-lead-dialog.tsx
// ============================================

'use client'

import { useEffect, useState } from 'react'

import { useForm, Controller } from 'react-hook-form'

import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { Loader2, Pencil } from 'lucide-react'

import { toast } from 'sonner'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'

import { Input } from '@/components/ui/input'

import { Textarea } from '@/components/ui/textarea'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

import {
    updateLead,
} from '@/services/leads.service'
import { Lead } from '@/types/lead'


export interface LeadWithId extends Lead {
  id: string
}

// ============================================
// Validation Schema
// ============================================

const editLeadSchema = z.object({
    firstName: z
        .string()
        .min(2, 'First name is required'),

    lastName: z
        .string()
        .min(2, 'Last name is required'),

    email: z
        .string()
        .email('Invalid email'),

    phone: z
        .string()
        .min(6, 'Phone number is required'),

    status: z.string(),

    assignedTo: z.string(),

    notes: z.string().optional(),
})

type EditLeadFormValues = z.infer<
    typeof editLeadSchema
>

// ============================================
// Mock Salespeople
// Replace Later With Firestore
// ============================================

const salespeople = [
    {
        id: '1',
        name: 'Sarah Wilson',
    },

    {
        id: '2',
        name: 'David Brown',
    },

    {
        id: '3',
        name: 'Emma Johnson',
    },
]

// ============================================
// Props
// ============================================

interface EditLeadDialogProps {
    lead: Lead
}

// ============================================
// Component
// ============================================

export function EditLeadDialog({
    lead,
}: EditLeadDialogProps) {
    const [open, setOpen] =
        useState(false)

    const [loading, setLoading] =
        useState(false)

    // ============================================
    // Form Setup
    // ============================================

    const form = useForm<Lead>({
        defaultValues: {
            firstName: lead?.firstName || '',
            lastName: lead?.lastName || '',
            email: lead?.email || '',
            phone: lead?.phone || '',
            status: lead?.status || 'New', // ✅ matches LeadStatus
            assignedTo: lead?.assignedTo || '',
            notes: lead?.notes || '',
        },
    })
    // ============================================
    // Sync Form Values
    // ============================================

    useEffect(() => {
        form.reset({
            firstName:
                lead.firstName,

            lastName:
                lead.lastName,

            email: lead.email,

            phone: lead.phone,

            status: lead.status,

            assignedTo:
                lead.assignedTo,

            notes: lead.notes || '',
        })
    }, [lead, form])

    // ============================================
    // Submit Handler
    // ============================================

    async function onSubmit(
        values: Lead
    ) {
        try {
            setLoading(true)

            if (!lead.id) {
                toast.error(
                    'Lead ID missing'
                )

                return
            }

            const response =
                await updateLead(
                    lead.id,
                    values
                )

            if (!response.success) {
                toast.error(
                    response.message
                )

                return
            }

            toast.success(
                'Lead updated successfully'
            )

            setOpen(false)
        } catch (error) {
            console.error(error)

            toast.error(
                'Failed to update lead'
            )
        } finally {
            setLoading(false)
        }
    }

    // ============================================
    // UI
    // ============================================

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            {/* TRIGGER */}

            <DialogTrigger >
                <Button
                    variant="ghost"
                    className="w-full justify-start"
                >
                    <Pencil className="h-4 w-4 mr-2" />

                    Edit Lead
                </Button>
            </DialogTrigger>

            {/* CONTENT */}

            <DialogContent className="sm:max-w-2xl rounded-2xl">
                <DialogHeader>
                    <DialogTitle>
                        Edit Lead
                    </DialogTitle>

                    <DialogDescription>
                        Update lead information and
                        CRM status.
                    </DialogDescription>
                </DialogHeader>

                {/* FORM */}

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(
                            onSubmit
                        )}
                        className="space-y-6 mt-4"
                    >
                        {/* NAME */}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* FIRST NAME */}

                            <FormField
                                form={form}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            First Name
                                        </FormLabel>

                                        <FormControl>
                                            <Input
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* LAST NAME */}

                            <FormField
                                form={form}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Last Name
                                        </FormLabel>

                                        <FormControl>
                                            <Input
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* EMAIL + PHONE */}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* EMAIL */}

                            <FormField
                                form={form}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Email
                                        </FormLabel>

                                        <FormControl>
                                            <Input
                                                type="email"
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* PHONE */}

                            <FormField
                                form={form}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Phone
                                        </FormLabel>

                                        <FormControl>
                                            <Input
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* STATUS + ASSIGNED */}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* STATUS */}

                            <Controller
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Lead Status
                                        </FormLabel>

                                        <Select
                                            onValueChange={
                                                field.onChange
                                            }
                                            defaultValue={
                                                field.value
                                            }
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>

                                            <SelectContent>
                                                <SelectItem value="New">
                                                    New
                                                </SelectItem>

                                                <SelectItem value="Contacted">
                                                    Contacted
                                                </SelectItem>

                                                <SelectItem value="Qualified">
                                                    Qualified
                                                </SelectItem>

                                                <SelectItem value="Proposal Sent">
                                                    Proposal Sent
                                                </SelectItem>

                                                <SelectItem value="Negotiation">
                                                    Negotiation
                                                </SelectItem>

                                                <SelectItem value="Won">
                                                    Won
                                                </SelectItem>

                                                <SelectItem value="Lost">
                                                    Lost
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* ASSIGNED TO */}

                            <Controller
                                control={form.control}
                                name="assignedTo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Assigned To
                                        </FormLabel>

                                        <Select
                                            onValueChange={
                                                field.onChange
                                            }
                                            defaultValue={
                                                field.value
                                            }
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>

                                            <SelectContent>
                                                {salespeople.map(
                                                    (
                                                        salesperson
                                                    ) => (
                                                        <SelectItem
                                                            key={
                                                                salesperson.id
                                                            }
                                                            value={
                                                                salesperson.name
                                                            }
                                                        >
                                                            {
                                                                salesperson.name
                                                            }
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* NOTES */}

                        <Controller
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Notes
                                    </FormLabel>

                                    <FormControl>
                                        <Textarea
                                            className="min-h-[120px]"
                                            placeholder="Lead notes..."
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* FOOTER */}

                        <div className="flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    setOpen(false)
                                }
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="min-w-[150px]"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />

                                        Updating...
                                    </div>
                                ) : (
                                    'Update Lead'
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}