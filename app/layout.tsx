import { Manrope } from 'next/font/google'

import '../global.css'
import {
  DynamicContextProvider,
  DynamicWagmiConnector,
  EthereumWalletConnectors,
} from '../lib/dynamic'

export const metadata = {
  title: 'Fleek PWA Template',
  description: 'Fleek PWA Template',
}

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: false,
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* PWA config */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Fleek PWA" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/manifest/flk-256.png" />
      <meta name="theme-color" content="#C9FF57" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />

      <body className={manrope.className}>
        <DynamicContextProvider
          settings={{
            walletConnectors: [EthereumWalletConnectors],
            environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID!,
            appName: 'Fleek PWA Template',
            appLogoUrl: '/manifest/flk-256.png',
          }}
        >
          <DynamicWagmiConnector>{children}</DynamicWagmiConnector>
        </DynamicContextProvider>
      </body>
    </html>
  )
}
