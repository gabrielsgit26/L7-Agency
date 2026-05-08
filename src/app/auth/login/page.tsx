// ============================================
// FILE: src/app/(auth)/login/page.tsx
// ============================================

'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Controller, useForm } from 'react-hook-form'

import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { Loader2 } from 'lucide-react'

import { toast } from 'sonner'

import { loginUser } from '@/services/auth.service'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { Input } from '@/components/ui/input'

import { Button } from '@/components/ui/button'

// ============================================
// Validation Schema
// ============================================

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email'),

  password: z
    .string()
    .min(6, 'Minimum 6 characters'),
})

type LoginFormValues = z.infer<
  typeof loginSchema
>

// ============================================
// Page Component
// ============================================

export default function LoginPage() {
  const router = useRouter()

  const [loading, setLoading] =
    useState(false)

  // ============================================
  // Form Setup
  // ============================================

  const form =
    useForm<LoginFormValues>({
      resolver:
        zodResolver(loginSchema),

      defaultValues: {
        email: '',
        password: '',
      },
    })

  // ============================================
  // Submit Handler
  // ============================================

  async function onSubmit(
    values: LoginFormValues
  ) {
    try {
      setLoading(true)

      const response =
        await loginUser(
          values.email,
          values.password
        )

      if (!response.success) {
        toast.error(
          response.message ||
          'Invalid credentials'
        )

        return
      }

      toast.success(
        'Login successful'
      )

      // ========================================
      // Role-Based Redirect
      // ========================================
      console.log('User Role:', response)
      if (response.role === 'admin') {
        router.push('/dashboard/admin')
      } else {
        router.push(
          '/dashboard/salesperson'
        )
      }
    } catch (error) {
      console.error(error)

      toast.error(
        'Something went wrong'
      )
    } finally {
      setLoading(false)
    }
  }

  // ============================================
  // UI
  // ============================================

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-xl border-0">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">
            L7 Agency Login
          </CardTitle>

          <CardDescription>
            Sign in to access your
            dashboard
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(
                onSubmit
              )}
              className="space-y-5"
            >
              {/* EMAIL */}

              <Controller
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email
                    </FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        type="email"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PASSWORD */}

              <Controller
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Password
                    </FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Enter your password"
                        type="password"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* SUBMIT BUTTON */}

              <Button
                type="submit"
                className="w-full h-11 rounded-xl text-base"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />

                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </Form>

          {/* FOOTER */}

          <div className="mt-6 text-center text-sm text-slate-500">
            L7 Agency Management System
          </div>
        </CardContent>
      </Card>
    </div>
  )
}