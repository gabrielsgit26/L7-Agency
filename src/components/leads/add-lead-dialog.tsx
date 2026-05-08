// ============================================
// FILE: src/components/leads/add-lead-dialog.tsx
// ============================================

'use client'

import { useState } from 'react'

import { useForm, Controller } from 'react-hook-form'

import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { Loader2 } from 'lucide-react'

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

import { Textarea } from '@/components/ui/textarea'

// ============================================
// Validation Schema
// ============================================

const leadSchema = z.object({
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

type LeadFormValues = z.infer<
    typeof leadSchema
>

// ============================================
// Mock Salespeople
// Replace Later From Firestore
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
// Component
// ============================================

export function AddLeadDialog() {
    const [open, setOpen] =
        useState(false)

    const [loading, setLoading] =
        useState(false)

    // ============================================
    // Form Setup
    // ============================================

    const form =
        useForm<LeadFormValues>({
            resolver:
                zodResolver(leadSchema),

            defaultValues: {
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                status: 'New',
                assignedTo: '',
                notes: '',
            },
        })

    // ============================================
    // Submit Handler
    // ============================================

    async function onSubmit(
        values: LeadFormValues
    ) {
        try {
            setLoading(true)

            // ========================================
            // TODO:
            // Replace with Firebase createLead()
            // ========================================

            console.log(values)

            await new Promise((resolve) =>
                setTimeout(resolve, 1500)
            )

            toast.success(
                'Lead created successfully'
            )

            form.reset()

            setOpen(false)
        } catch (error) {
            console.error(error)

            toast.error(
                'Failed to create lead'
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

            <DialogTrigger {...({ asChild: true } as any)}>
                <Button className="rounded-xl">
                    Add Lead
                </Button>
            </DialogTrigger>

            {/* CONTENT */}

            <DialogContent className="sm:max-w-2xl rounded-2xl">
                <DialogHeader>
                    <DialogTitle>
                        Create New Lead
                    </DialogTitle>

                    <DialogDescription>
                        Add a new lead to your CRM
                        pipeline.
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
                        {/* NAME ROW */}

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
                                                placeholder="John"
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
                                                placeholder="Doe"
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
                                                placeholder="john@email.com"
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
                                                placeholder="+1 555 123 456"
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
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
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
                                                    <SelectValue placeholder="Select salesperson" />
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
                                            placeholder="Additional lead information..."
                                            className="min-h-[120px]"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* FOOTER */}

                        <div className="flex justify-end gap-3 pt-2">
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
                                className="min-w-[140px]"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />

                                        Creating...
                                    </div>
                                ) : (
                                    'Create Lead'
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}