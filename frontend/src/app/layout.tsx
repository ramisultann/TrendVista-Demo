import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ConditionalHeader from '@/components/ConditionalHeader'
import { AuthProvider } from '@/contexts/AuthContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TrendVista - Social Media Trend Analysis',
  description: 'Real-time insights about customer trends for local businesses',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ConditionalHeader />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
