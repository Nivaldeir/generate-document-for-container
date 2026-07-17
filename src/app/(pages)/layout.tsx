import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'

import { AuthProvider } from '@/src/shared/components/auth-provider'
import { TRPCProvider } from '@/src/shared/components/trpc-provider'
import '../globals.css'
import { ModalProvider } from '../../shared/contexts/modal-context'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
})

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
    <html lang="pt-BR" className={poppins.variable}>
      <body className="font-sans antialiased">
        <ModalProvider>
          <AuthProvider>
            <TRPCProvider>{children}</TRPCProvider>
          </AuthProvider>
        </ModalProvider>
      </body>
    </html>
  )
}
