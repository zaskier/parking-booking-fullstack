import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Footer from '@/components/Footer/Footer'
import Navbar from '../components/Navbar/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Parking Booking',
  description: 'Parking Booking',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className="flex min-h-screen flex-col"
      >
        <Navbar />
        <main className="container flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
