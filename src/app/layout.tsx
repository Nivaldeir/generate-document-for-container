import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'

import { TRPCProvider } from '@/src/shared/components/trpc-provider'
import './globals.css'

const _poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

export const metadata: Metadata = {
  title: 'Gerenciador de Containers',  
  description: 'Sistema de gerenciamento de documentos',
  generator: 'Nivaldeir',  
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={_poppins.className}>
      <body className="font-sans antialiased">
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  )
}
