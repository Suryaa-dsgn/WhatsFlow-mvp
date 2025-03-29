import './styles/globals.css'
import type { Metadata } from 'next'
import { Inter, Montserrat, Outfit } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'

// Load Montserrat font
const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

// Optional font for body text
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', weight: ['400', '500', '600', '700'] })

export const metadata: Metadata = {
  title: 'WhatsFlow - Build WhatsApp Automations with AI',
  description: 'Create AI-powered WhatsApp flows with natural language, customize with our visual editor, and deploy to WhatsApp Business API.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${inter.variable} ${outfit.variable} font-sans`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
} 