'use client'

import { useMemo, useState, useEffect } from 'react'

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
import { useAuth } from '@/context/auth-context'
import { leadsService } from '@/services/leads.service'
import { getUserProfile } from '@/services/auth.service'
import { Lead, LeadStatus } from '@/types/lead'

// ============================================
// Lead Type
// ============================================



// ============================================
// Status Badge Styles
// ============================================

function getStatusVariant(
    status: LeadStatus
) {
    switch (status) {
        case 'New Lead':
            return 'bg-blue-100 text-blue-700'

        case 'Under Negotiation':
            return 'bg-yellow-100 text-yellow-700'

        case 'Closed/Won':
            return 'bg-green-100 text-green-700'

        default:
            return ''
    }
}

// ============================================
// Leads Page
// ============================================

export default function LeadsPage() {
    const { user, role } = useAuth()
    const [leads, setLeads] = useState<Lead[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    // ============================================
    // Fetch Leads
    // ============================================

    const fetchLeads = async () => {
        setLoading(true)
        try {
            const fetchedLeads = await leadsService.getLeads()

            // For admin, fetch assignedTo names
            if (role === 'admin') {
                const leadsWithNames = await Promise.all(
                    fetchedLeads.map(async (lead) => {
                        const profile = await getUserProfile(lead.assignedTo)
                        return {
                            ...lead,
                            assignedToName: profile.success ? profile.data.name : 'Unknown'
                        }
                    })
                )
                setLeads(leadsWithNames)
            } else {
                setLeads(fetchedLeads)
            }
        } catch (error) {
            console.error('Failed to fetch leads:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user && role) {
            fetchLeads()
        }
    }, [user, role])

    // ============================================
    // Filtered Data
    // ============================================

    const filteredData = useMemo(() => {
        return leads.filter((lead) => {
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
    }, [search, leads])

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
            accessorKey: 'whatsapp',

            header: 'WhatsApp',
        },

        {
            accessorKey: 'contractValue',

            header: 'Contract Value',

            cell: ({ row }) => (
                <div className="text-right">
                    R$ {row.original.contractValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                </div>
            ),
        },

        {
            accessorKey: 'status',

            header: 'Status',

            cell: ({ row }) => (
                <Badge
                    className={getStatusVariant(
                        row.original.status || 'New Lead'
                    )}
                >
                    {row.original.status}
                </Badge>
            ),
        },

        {
            accessorKey: 'assignedTo',

            header: 'Assigned To',

            cell: ({ row }) => (
                <div>
                    {role === 'admin' ? row.original.assignedToName || 'Unknown' : 'You'}
                </div>
            ),
        },

        {
            id: 'actions',

            header: 'Actions',

            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger className={"cursor-pointer hover:bg-muted"} >
                        <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <EditLeadDialog lead={row.original} onUpdated={fetchLeads} />

                        <DeleteLeadDialog
                            lead={row.original}
                            onDeleted={fetchLeads}
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
        columns: columns.filter((col: any) => {
            // Salesperson should not see 'Assigned To' column
            if (col.accessorKey === 'assignedTo' && role !== 'admin') {
                return false;
            }
            return true;
        }),

        getCoreRowModel:
            getCoreRowModel(),

        getPaginationRowModel:
            getPaginationRowModel(),
    })

    // ============================================
    // UI
    // ============================================

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* PAGE HEADER */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        Leads
                    </h1>

                    <p className="text-sm text-slate-500 sm:text-base">
                        Manage all CRM leads.
                    </p>
                </div>

                <div className="w-full sm:w-auto">
                    <AddLeadDialog onAdded={fetchLeads} />
                </div>
            </div>

            {/* SEARCH */}

            <Card className="rounded-2xl shadow-sm">
                <CardContent className="p-3 sm:p-4">
                    <div className="relative w-full sm:max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <Input
                            placeholder="Search leads..."
                            className="h-11 rounded-xl pl-10 text-sm sm:text-base"
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />
                    </div>
                </CardContent>
            </Card>

            {/* LEADS TABLE */}

            <Card className="overflow-hidden rounded-2xl shadow-sm">
                <CardHeader className="border-b px-4 py-4 sm:px-6">
                    <CardTitle className="text-lg sm:text-xl">
                        Leads List
                    </CardTitle>
                </CardHeader>

                <CardContent className="p-0 sm:p-6">
                    {/* MOBILE VIEW */}

                    <div className="block sm:hidden">
                        {loading ? (
                            <div className="flex h-40 items-center justify-center text-sm text-slate-500">
                                Loading leads...
                            </div>
                        ) : table.getRowModel().rows.length ? (
                            <div className="space-y-3 p-4">
                                {table
                                    .getRowModel()
                                    .rows.map((row) => {
                                        const lead =
                                            row.original

                                        return (
                                            <div
                                                key={row.id}
                                                className="rounded-2xl border bg-white p-4 shadow-sm"
                                            >
                                                <div className="space-y-3">
                                                    <div>
                                                        <h3 className="font-semibold text-slate-900">
                                                            {
                                                                lead.firstName
                                                            }{' '}
                                                            {
                                                                lead.lastName
                                                            }
                                                        </h3>

                                                        <p className="text-sm text-slate-500">
                                                            {
                                                                lead.email
                                                            }
                                                        </p>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                                        <div>
                                                            <p className="text-slate-500">
                                                                WhatsApp
                                                            </p>

                                                            <p className="font-medium">
                                                                {
                                                                    lead.whatsapp
                                                                }
                                                            </p>
                                                        </div>

                                                        <div>
                                                            <p className="text-slate-500">
                                                                Status
                                                            </p>

                                                            <p className="font-medium">
                                                                {
                                                                    lead.status
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-end gap-2 pt-2">
                                                        {/* ACTIONS */}
                                                        {row
                                                            .getVisibleCells()
                                                            .slice(
                                                                -1
                                                            )
                                                            .map(
                                                                (
                                                                    cell
                                                                ) => (
                                                                    <div
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
                                                                    </div>
                                                                )
                                                            )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                            </div>
                        ) : (
                            <div className="flex h-40 items-center justify-center text-sm text-slate-500">
                                No leads found.
                            </div>
                        )}
                    </div>

                    {/* DESKTOP TABLE */}

                    <div className="hidden sm:block">
                        <div className="overflow-x-auto rounded-xl border">
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
                                    {loading ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={
                                                    columns.length
                                                }
                                                className="h-32 text-center"
                                            >
                                                Loading leads...
                                            </TableCell>
                                        </TableRow>
                                    ) : table
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
                    </div>

                    {/* PAGINATION */}

                    <div className="flex flex-col gap-3 border-t px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-0 sm:pt-6">
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full sm:w-auto"
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
                            className="w-full sm:w-auto"
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