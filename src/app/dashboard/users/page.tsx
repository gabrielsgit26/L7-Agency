'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

import { useAuth } from '@/context/auth-context'
import { getSalespersons } from '@/services/auth.service'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

interface Salesperson {
  uid: string
  name: string
  email: string
  role: string
  createdAt: string | null
}

export default function UsersPage() {
  const router = useRouter()
  const { role, loading } = useAuth()
  const [salespersons, setSalespersons] = useState<Salesperson[]>([])
  const [search, setSearch] = useState('')
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (role === 'salesperson') {
      router.push('/dashboard/leads')
    } else if (role === null && !loading) {
      router.push('/auth/login')
    }
  }, [role, loading, router])

  useEffect(() => {
    if (role === 'admin') {
      fetchSalespersons()
    }
  }, [role])

  async function fetchSalespersons() {
    setLoadingUsers(true)
    setError('')

    const result = await getSalespersons()
    if (!result.success) {
      setError(result.message || 'Unable to load salespersons.')
      setSalespersons([])
    } else {
      setSalespersons(result.users)
    }

    setLoadingUsers(false)
  }

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase()

    return salespersons.filter((user) => {
      return [user.name, user.email, user.role]
        .join(' ')
        .toLowerCase()
        .includes(query)
    })
  }, [salespersons, search])

  function formatDate(value: string | null) {
    if (!value) return '-'

    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value))
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* PAGE HEADER */}

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Salesperson Users
        </h1>

        <p className="text-sm text-slate-500 sm:text-base">
          View and manage all salesperson accounts in the CRM.
        </p>
      </div>

      {/* STATS + SEARCH */}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* STATS CARD */}

        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg">
              Salespersons
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold sm:text-4xl">
              {loadingUsers ? '...' : salespersons.length}
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Total salesperson users currently in the system.
            </p>
          </CardContent>
        </Card>

        {/* SEARCH CARD */}

        <Card className="rounded-2xl shadow-sm xl:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg">
              Search Users
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <Input
                placeholder="Search by name, email, or role"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                className="h-11 rounded-xl pl-10 text-sm sm:text-base"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DIRECTORY */}

      <Card className="overflow-hidden rounded-2xl shadow-sm">
        <CardHeader className="border-b px-4 py-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl">
            Salesperson Directory
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 sm:p-6">
          {/* ERROR */}

          {error ? (
            <div className="m-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {/* MOBILE VIEW */}

          <div className="block sm:hidden">
            {filteredUsers.length > 0 ? (
              <div className="space-y-3 p-4">
                {filteredUsers.map((user) => (
                  <div
                    key={user.uid}
                    className="rounded-2xl border bg-white p-4 shadow-sm"
                  >
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {user.name || user.uid}
                        </h3>

                        <p className="mt-1 break-all text-sm text-slate-500">
                          {user.email}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge className="bg-blue-100 text-blue-700">
                          {user.role}
                        </Badge>

                        <p className="text-xs text-slate-500">
                          {formatDate(user.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-40 items-center justify-center px-4 text-center text-sm text-slate-500">
                {loadingUsers
                  ? 'Loading salesperson users...'
                  : 'No salesperson users found.'}
              </div>
            )}
          </div>

          {/* DESKTOP TABLE */}

          <div className="hidden sm:block">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.uid}>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {user.name || user.uid}
                            </p>
                          </div>
                        </TableCell>

                        <TableCell>
                          {user.email}
                        </TableCell>

                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-700">
                            {user.role}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          {formatDate(user.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <div className="py-8 text-center text-sm text-slate-500">
                          {loadingUsers
                            ? 'Loading salesperson users...'
                            : 'No salesperson users found.'}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
