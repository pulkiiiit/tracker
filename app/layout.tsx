import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '90-Day Fullstack Tracker',
  description: 'Track your 90-day journey to becoming unrejectable',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 dark:bg-gray-900">
        {children}
      </body>
    </html>
  )
}