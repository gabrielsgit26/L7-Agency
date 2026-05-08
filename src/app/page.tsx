
'use client'

import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  ShieldCheck,
  Users,
  Briefcase,
  CheckCircle2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
} from '@/components/ui/card'

const features = [
  {
    title: 'Lead Management',
    description:
      'Manage, organize, and track your leads with a modern CRM workflow.',
    icon: Users,
  },
  {
    title: 'Sales Analytics',
    description:
      'Visualize performance metrics, conversion rates, and revenue growth.',
    icon: BarChart3,
  },
  {
    title: 'Role-Based Access',
    description:
      'Secure admin and salesperson dashboards with protected access control.',
    icon: ShieldCheck,
  },
  {
    title: 'Contract Management',
    description:
      'Upload contracts, manage client documents, and organize files securely.',
    icon: Briefcase,
  },
]

const benefits = [
  'Modern CRM dashboard',
  'Firebase authentication',
  'Realtime lead tracking',
  'Secure cloud storage',
  'Salesperson management',
  'Performance analytics',
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* HEADER */}
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold">
              L7
            </div>

            <div>
              <h1 className="text-lg font-bold leading-none">
                L7 Agency
              </h1>
              <p className="text-xs text-muted-foreground">
                CRM & Sales Management Platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="outline">
                Login
              </Button>
            </Link>

            <Link href="/auth/signup">
              <Button>
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />

        <div className="container relative mx-auto px-6 py-24 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium text-muted-foreground backdrop-blur">
              Powerful CRM Solution for Modern Sales Teams
            </div>

            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              Grow Your Business With
              <span className="block bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                L7 Agency CRM
              </span>
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              Streamline your sales pipeline, manage leads, track team
              performance, and scale your agency using a modern,
              secure, cloud-based CRM platform.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/signup">
                <Button size="lg" className="h-12 px-8 text-base">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 text-base"
                >
                  Login to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container mx-auto px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight">
            Everything Your Agency Needs
          </h2>

          <p className="mt-4 text-lg text-muted-foreground">
            Built for admins, sales managers, and salespeople to manage
            leads efficiently and close more deals.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon

            return (
              <Card
                key={feature.title}
                className="border bg-card/50 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <CardContent className="p-6">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>

                  <h3 className="text-xl font-semibold">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* BENEFITS */}
      <section className="border-y bg-muted/30 py-20">
        <div className="container mx-auto grid items-center gap-12 px-6 lg:grid-cols-2">
          <div>
            <h2 className="text-4xl font-bold tracking-tight">
              Designed for High-Performance Sales Teams
            </h2>

            <p className="mt-6 text-lg text-muted-foreground">
              L7 Agency CRM gives your team the tools they need to
              manage leads, improve communication, and close more deals
              faster.
            </p>

            <div className="mt-8 space-y-4">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-base font-medium">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl border bg-card p-8 shadow-2xl">
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Leads
                  </p>
                  <h3 className="mt-2 text-4xl font-bold">
                    1,248
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border p-5">
                    <p className="text-sm text-muted-foreground">
                      Closed Deals
                    </p>
                    <h4 className="mt-2 text-2xl font-bold">
                      324
                    </h4>
                  </div>

                  <div className="rounded-2xl border p-5">
                    <p className="text-sm text-muted-foreground">
                      Revenue
                    </p>
                    <h4 className="mt-2 text-2xl font-bold">
                      $82K
                    </h4>
                  </div>
                </div>

                <div className="rounded-2xl border p-5">
                  <p className="text-sm text-muted-foreground">
                    Team Performance
                  </p>

                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-[78%] rounded-full bg-primary" />
                  </div>

                  <p className="mt-3 text-sm text-muted-foreground">
                    78% Monthly Conversion Rate
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 py-24">
        <div className="rounded-3xl border bg-primary px-8 py-16 text-center text-primary-foreground shadow-2xl">
          <h2 className="text-4xl font-bold tracking-tight">
            Ready to Scale Your Agency?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-primary-foreground/80">
            Start managing leads, teams, contracts, and analytics with a
            modern CRM platform built for growth.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup">
              <Button
                size="lg"
                variant="secondary"
                className="h-12 px-8 text-base"
              >
                Get Started
              </Button>
            </Link>

            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="h-12 border-white/30 bg-transparent px-8 text-base text-white hover:bg-white hover:text-black"
              >
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 text-sm text-muted-foreground md:flex-row">
          <p>
            © {new Date().getFullYear()} L7 Agency. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-foreground">
              Login
            </Link>

            <Link href="/signup" className="hover:text-foreground">
              Get Started
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}