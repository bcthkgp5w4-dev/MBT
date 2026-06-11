import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'MBT – Mind, Behavior & Therapy',
    template: '%s | MBT',
  },
  description: 'Understanding Autism, One Family at a Time. AI-powered autism support platform for parents, caregivers, and therapists.',
  keywords: ['autism', 'ASD', 'therapy', 'children', 'parents', 'caregivers', 'ABA', 'speech therapy'],
  authors: [{ name: 'MBT Team' }],
  openGraph: {
    title: 'MBT – Mind, Behavior & Therapy',
    description: 'Understanding Autism, One Family at a Time',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
