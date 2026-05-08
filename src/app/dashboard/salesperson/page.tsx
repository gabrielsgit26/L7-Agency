// ============================================
// FILE: src/app/dashboard/salesperson/page.tsx
// ============================================

'use client'

import {
  Users,
  DollarSign,
  Briefcase,
  TrendingUp,
} from 'lucide-react'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import { useEffect } from 'react'

// ============================================
// MOCK DATA
// Replace later with Firestore data
// ============================================

const revenueData = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 3000 },
  { month: 'Mar', revenue: 5000 },
  { month: 'Apr', revenue: 7000 },
  { month: 'May', revenue: 6000 },
]

const pipelineData = [
  { name: 'New', value: 20 },
  { name: 'Qualified', value: 15 },
  { name: 'Negotiation', value: 10 },
  { name: 'Won', value: 8 },
]

const COLORS = [
  '#2563EB',
  '#7C3AED',
  '#D97706',
  '#16A34A',
]

// ============================================
// Dashboard Page
// ============================================

export default function SalesDashboardPage() {

  const router = useRouter()
  const { user, role } = useAuth()
  useEffect(() => {
    if (role !== 'salesperson') {
      router.push('/dashboard/admin')
    } else if (!user) {
      router.push('/')
    }
  }, [role, user])


  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Sales Dashboard
        </h1>

        <p className="text-slate-500">
          Overview of your CRM system
          performance.
        </p>
      </div>

      {/* ANALYTICS CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* TOTAL LEADS */}

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Total Leads
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  1,240
                </h2>
              </div>

              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CLOSED DEALS */}

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Closed Deals
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  320
                </h2>
              </div>

              <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* REVENUE */}

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Revenue
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  $92,000
                </h2>
              </div>

              <div className="h-12 w-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GROWTH */}

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Growth
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  +18%
                </h2>
              </div>

              <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CHARTS */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* REVENUE CHART */}

        <Card className="xl:col-span-2 rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>
              Monthly Revenue
            </CardTitle>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer
              width="100%"
              height={350}
            >
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="revenue"
                  fill="#2563EB"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* PIPELINE CHART */}

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>
              Sales Pipeline
            </CardTitle>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer
              width="100%"
              height={350}
            >
              <PieChart>
                <Pie
                  data={pipelineData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label
                >
                  {pipelineData.map(
                    (_, index) => (
                      <Cell
                        key={index}
                        fill={
                          COLORS[index]
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}