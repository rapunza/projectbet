import type { Metadata, Viewport } from 'next'
import { Providers } from './providers'
import { TestnetBanner } from './components/TestnetBanner'
import '@coinbase/onchainkit/styles.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bantah- Base Sepolia Testnet',
  description: 'Put your take on record. Prediction markets for Base posts.',
  applicationName: 'bant-A-bro',
  robots: {
    index: false, // Don't index testnet app
    follow: false,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </head>
      <body suppressHydrationWarning>
        <TestnetBanner />
        <div style={{ paddingTop: '28px' }}>
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  )
}


