import type { Metadata } from 'next'
import { Providers } from './providers'
import { SplashScreen } from './components/SplashScreen'
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
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
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
        <SplashScreen />
        <div style={{ paddingTop: '28px' }}>
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  )
}


