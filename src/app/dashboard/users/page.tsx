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
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Salesperson Users
        </h1>

        <p className="text-slate-500">
          View and manage all salesperson accounts in the CRM.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Salespersons</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-4xl font-bold">
              {loadingUsers ? '...' : salespersons.length}
            </p>

            <p className="text-sm text-slate-500 mt-2">
              Total salesperson users currently in the system.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm xl:col-span-2">
          <CardHeader>
            <CardTitle>Search Users</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search by name, email, or role"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Salesperson Directory</CardTitle>
        </CardHeader>

        <CardContent>
          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="mt-4">
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

                      <TableCell>{user.email}</TableCell>

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
                      <div className="py-6 text-center text-sm text-slate-500">
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
        </CardContent>
      </Card>
    </div>
  )
}
