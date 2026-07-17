'use client'

import { Card, CardDescription, CardHeader, CardTitle } from '@/src/shared/components/ui/card'

export function GenerationSuccessBanner() {
  return (
    <Card className="mt-8 border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="text-green-900">Documentos gerados com sucesso</CardTitle>
        <CardDescription className="text-green-700">
          Os 3 documentos (BL com lista de B/Ls, Pagamento de Frete e Invoice) foram gerados e salvos.
          Acesse &quot;Listar Documentos&quot; no menu para visualizar ou baixar.
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
