// ============================================
// FILE: src/app/dashboard/leads/page.tsx
// ============================================

'use client'

import { useMemo, useState } from 'react'

import {
    Plus,
    Search,
    MoreHorizontal,
} from 'lucide-react'

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table'

import { Input } from '@/components/ui/input'

import { Button } from '@/components/ui/button'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Badge } from '@/components/ui/badge'
import { AddLeadDialog } from '@/components/leads/add-lead-dialog'
import { EditLeadDialog } from '@/components/leads/edit-lead-dialog'
import { DeleteLeadDialog } from '@/components/leads/delete-lead-dialog'

// ============================================
// Lead Type
// ============================================

type LeadStatus =
    | 'New'
    | 'Contacted'
    | 'Qualified'
    | 'Proposal Sent'
    | 'Negotiation'
    | 'Won'
    | 'Lost'

interface Lead {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    status: LeadStatus
    assignedTo: string
}

// ============================================
// Mock Data
// Replace later with Firestore
// ============================================

const leadsData: Lead[] = [
    {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1 555 123 456',
        status: 'New',
        assignedTo: 'Sarah',
    },

    {
        id: '2',
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'michael@example.com',
        phone: '+1 555 222 111',
        status: 'Negotiation',
        assignedTo: 'David',
    },

    {
        id: '3',
        firstName: 'Emma',
        lastName: 'Wilson',
        email: 'emma@example.com',
        phone: '+1 555 987 654',
        status: 'Won',
        assignedTo: 'Sarah',
    },
]

// ============================================
// Status Badge Styles
// ============================================

function getStatusVariant(
    status: LeadStatus
) {
    switch (status) {
        case 'New':
            return 'bg-blue-100 text-blue-700'

        case 'Contacted':
            return 'bg-cyan-100 text-cyan-700'

        case 'Qualified':
            return 'bg-purple-100 text-purple-700'

        case 'Proposal Sent':
            return 'bg-orange-100 text-orange-700'

        case 'Negotiation':
            return 'bg-yellow-100 text-yellow-700'

        case 'Won':
            return 'bg-green-100 text-green-700'

        case 'Lost':
            return 'bg-red-100 text-red-700'

        default:
            return ''
    }
}

// ============================================
// Leads Page
// ============================================

export default function LeadsPage() {
    const [search, setSearch] =
        useState('')

    // ============================================
    // Filtered Data
    // ============================================

    const filteredData = useMemo(() => {
        return leadsData.filter((lead) => {
            const fullName =
                `${lead.firstName} ${lead.lastName}`.toLowerCase()

            return (
                fullName.includes(
                    search.toLowerCase()
                ) ||
                lead.email.includes(
                    search.toLowerCase()
                )
            )
        })
    }, [search])

    // ============================================
    // Table Columns
    // ============================================

    const columns: ColumnDef<Lead>[] = [
        {
            accessorKey: 'firstName',

            header: 'Name',

            cell: ({ row }) => (
                <div>
                    <p className="font-medium">
                        {row.original.firstName}{' '}
                        {row.original.lastName}
                    </p>

                    <p className="text-sm text-slate-500">
                        {row.original.email}
                    </p>
                </div>
            ),
        },

        {
            accessorKey: 'phone',

            header: 'Phone',
        },

        {
            accessorKey: 'status',

            header: 'Status',

            cell: ({ row }) => (
                <Badge
                    className={getStatusVariant(
                        row.original.status
                    )}
                >
                    {row.original.status}
                </Badge>
            ),
        },

        {
            accessorKey: 'assignedTo',

            header: 'Assigned To',
        },

        {
            id: 'actions',

            header: 'Actions',

            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger >
                        <Button
                            size="icon"
                            variant="ghost"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                            View Lead
                        </DropdownMenuItem>

                        <EditLeadDialog lead={row.original} />

                        <DeleteLeadDialog
                            lead={row.original}
                            onDeleted={() => { }} // optional refresh function
                        />
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ]

    // ============================================
    // Table Setup
    // ============================================

    const table = useReactTable({
        data: filteredData,
        columns,

        getCoreRowModel:
            getCoreRowModel(),

        getPaginationRowModel:
            getPaginationRowModel(),
    })

    // ============================================
    // UI
    // ============================================

    return (
        <div className="space-y-6">
            {/* PAGE HEADER */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">
                        Leads
                    </h1>

                    <p className="text-slate-500 mt-1">
                        Manage all CRM leads.
                    </p>
                </div>

                <AddLeadDialog />
            </div>

            {/* SEARCH */}

            <Card className="rounded-2xl shadow-sm">
                <CardContent className="p-4">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <Input
                            placeholder="Search leads..."
                            className="pl-10 rounded-xl"
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />
                    </div>
                </CardContent>
            </Card>

            {/* LEADS TABLE */}

            <Card className="rounded-2xl shadow-sm">
                <CardHeader>
                    <CardTitle>
                        Leads List
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="rounded-xl border overflow-x-auto">
                        <Table>
                            <TableHeader>
                                {table
                                    .getHeaderGroups()
                                    .map(
                                        (
                                            headerGroup
                                        ) => (
                                            <TableRow
                                                key={
                                                    headerGroup.id
                                                }
                                            >
                                                {headerGroup.headers.map(
                                                    (
                                                        header
                                                    ) => (
                                                        <TableHead
                                                            key={
                                                                header.id
                                                            }
                                                        >
                                                            {flexRender(
                                                                header
                                                                    .column
                                                                    .columnDef
                                                                    .header,
                                                                header.getContext()
                                                            )}
                                                        </TableHead>
                                                    )
                                                )}
                                            </TableRow>
                                        )
                                    )}
                            </TableHeader>

                            <TableBody>
                                {table
                                    .getRowModel()
                                    .rows.length ? (
                                    table
                                        .getRowModel()
                                        .rows.map(
                                            (row) => (
                                                <TableRow
                                                    key={
                                                        row.id
                                                    }
                                                >
                                                    {row
                                                        .getVisibleCells()
                                                        .map(
                                                            (
                                                                cell
                                                            ) => (
                                                                <TableCell
                                                                    key={
                                                                        cell.id
                                                                    }
                                                                >
                                                                    {flexRender(
                                                                        cell
                                                                            .column
                                                                            .columnDef
                                                                            .cell,
                                                                        cell.getContext()
                                                                    )}
                                                                </TableCell>
                                                            )
                                                        )}
                                                </TableRow>
                                            )
                                        )
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={
                                                columns.length
                                            }
                                            className="h-32 text-center"
                                        >
                                            No leads found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* PAGINATION */}

                    <div className="flex items-center justify-end gap-2 mt-6">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                table.previousPage()
                            }
                            disabled={
                                !table.getCanPreviousPage()
                            }
                        >
                            Previous
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                table.nextPage()
                            }
                            disabled={
                                !table.getCanNextPage()
                            }
                        >
                            Next
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}