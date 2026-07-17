'use client'

import type { SubmitHandler } from 'react-hook-form'
import { FileText, Loader2 } from 'lucide-react'

import { Button } from '@/src/shared/components/ui/button'
import { Form } from '@/src/shared/components/ui/form'
import { BrazilBiCard } from '@/src/shared/components/document-form/brazil-bi-card'
import { ConsigneeCard } from '@/src/shared/components/document-form/consignee-card'
import { BankDataCard } from '@/src/shared/components/document-form/bank-data-card'
import { FinancialDataCard } from '@/src/shared/components/document-form/financial-data-card'
import { HiddenAssetFields } from '@/src/shared/components/document-form/hidden-asset-fields'
import type { DocumentFormValues } from '@/src/shared/lib/document-form'

import { useHomeHook } from './hook/use-home.hook'
import { ShipperCard } from './_components/shipper-card'
import { TransportCard } from './_components/transport-card'
import { CargoCard } from './_components/cargo-card'
import { GenerationSuccessBanner } from './_components/generation-success-banner'

export default function HomePage() {
  const { form, onSubmit, loading, processing, success } = useHomeHook()
  const isFormDisabled = loading || processing

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Formulário de Documentos</h1>
        <p className="text-sm text-muted-foreground mt-2">Preencha os dados para gerar os PDFs</p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit as SubmitHandler<DocumentFormValues>)}
          className="space-y-6"
        >
          <HiddenAssetFields />
          <BrazilBiCard disabled={isFormDisabled} />
          <ConsigneeCard disabled={isFormDisabled} />
          <BankDataCard disabled={isFormDisabled} />
          <FinancialDataCard disabled={isFormDisabled} />
          <ShipperCard disabled={isFormDisabled} />
          <TransportCard disabled={isFormDisabled} />
          <CargoCard disabled={isFormDisabled} />

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center max-w-md">
            <Button type="submit" size="lg" className="flex-1" disabled={isFormDisabled}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Enfileirando...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-5 w-5" />
                  Gerar Documentos de Frete
                </>
              )}
            </Button>
            {processing && (
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Gerando em segundo plano...
              </p>
            )}
          </div>
        </form>
      </Form>

      {success && <GenerationSuccessBanner />}
    </div>
  )
}
