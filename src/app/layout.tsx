import './globals.css'

import { Toaster } from 'sonner'

import { AuthProvider } from '@/context/auth-context'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}

          <Toaster richColors />
        </AuthProvider>
      </body>
    </html>
  )
}