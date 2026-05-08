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

import { leadsService } from '@/services/leads.service'
import { Lead } from '@/types/lead'

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

    whatsapp: z
        .string()
        .min(6, 'WhatsApp number is required'),

    enterprise: z
        .string()
        .min(2, 'Enterprise name is required'),

    status: z.string(),

    contractValue: z
        .number()
        .min(0, 'Contract value must be positive'),

    estimatedValue: z
        .number()
        .min(0, 'Estimated value must be positive'),

    keyCustomerPainPoints: z
        .string()
        .min(5, 'Please describe key customer pain points'),

    companyAnalysis: z
        .string()
        .min(5, 'Please provide company analysis'),

    strategicMessage: z
        .string()
        .min(5, 'Please provide strategic message'),

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

interface AddLeadDialogProps {
    onAdded?: () => void
}

export function AddLeadDialog({ onAdded }: AddLeadDialogProps = {}) {
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
                whatsapp: '',
                enterprise: '',
                status: 'New Lead',
                contractValue: 0,
                estimatedValue: 0,
                keyCustomerPainPoints: '',
                companyAnalysis: '',
                strategicMessage: '',
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

            await leadsService.createLead(values as Lead)

            toast.success(
                'Lead created successfully'
            )

            form.reset()

            setOpen(false)

            onAdded?.()
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

            <DialogTrigger className={"rounded-xl"}>
                Add Lead
            </DialogTrigger>

            {/* CONTENT */}

            <DialogContent className="w-[95vw] sm:w-full sm:max-w-[900px] max-h-[90vh] flex flex-col rounded-2xl">
                <DialogHeader>
                    <DialogTitle>
                        Create New Lead
                    </DialogTitle>

                    <DialogDescription>
                        Add a new lead to your CRM
                        pipeline.
                    </DialogDescription>
                </DialogHeader>

                {/* FORM - SCROLLABLE */}

                <div className="overflow-y-auto flex-1 pr-4">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(
                                onSubmit
                            )}
                            className="space-y-4"
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

                        {/* EMAIL + WHATSAPP */}

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

                            {/* WHATSAPP */}

                            <FormField
                                form={form}
                                name="whatsapp"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            WhatsApp
                                        </FormLabel>

                                        <FormControl>
                                            <Input
                                                placeholder="+55 11 99999-9999"
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* ENTERPRISE */}

                        <FormField
                            form={form}
                            name="enterprise"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Enterprise
                                    </FormLabel>

                                    <FormControl>
                                        <Input
                                            placeholder="Company name"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* CONTRACT VALUE + ESTIMATED VALUE */}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* CONTRACT VALUE */}

                            <Controller
                                control={form.control}
                                name="contractValue"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Contract Value (R$)
                                        </FormLabel>

                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                step="0.01"
                                                {...field}
                                                onChange={(e: any) => field.onChange(parseFloat(e.target.value) || 0)}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* ESTIMATED VALUE */}

                            <Controller
                                control={form.control}
                                name="estimatedValue"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Estimated Value (R$)
                                        </FormLabel>

                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                step="0.01"
                                                {...field}
                                                onChange={(e: any) => field.onChange(parseFloat(e.target.value) || 0)}
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
                                                <SelectItem value="New Lead">
                                                    New Lead
                                                </SelectItem>

                                                <SelectItem value="Under Negotiation">
                                                    Under Negotiation
                                                </SelectItem>

                                                <SelectItem value="Closed/Won">
                                                    Closed/Won
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

                        {/* KEY CUSTOMER PAIN POINTS */}

                        <FormField
                            form={form}
                            name="keyCustomerPainPoints"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Key Customer Pain Points
                                    </FormLabel>

                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe the customer's pain points..."
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* COMPANY ANALYSIS */}

                        <FormField
                            form={form}
                            name="companyAnalysis"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Company Analysis
                                    </FormLabel>

                                    <FormControl>
                                        <Textarea
                                            placeholder="Provide analysis of the company..."
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* STRATEGIC MESSAGE */}

                        <FormField
                            form={form}
                            name="strategicMessage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Strategic Message
                                    </FormLabel>

                                    <FormControl>
                                        <Textarea
                                            placeholder="Provide the strategic message..."
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* FOOTER */}

                        <div className="flex justify-end gap-3 pt-4">
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
                </div>
            </DialogContent>
        </Dialog>
    )
}