import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'
export const metadata: Metadata = {
  title: 'Invoice Physics - Fraud Detection System',
  description: 'A fraud detection system that checks invoices against physical reality before any money is released.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 overflow-x-hidden flex flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}
