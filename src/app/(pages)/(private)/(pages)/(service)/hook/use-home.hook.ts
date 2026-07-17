import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  DOCUMENT_FORM_DEFAULTS,
  buildDocumentFormPayload,
  documentFormSchema,
  type DocumentFormValues,
} from '@/src/shared/lib/document-form'

export function useHomeHook() {
  const [loading, setLoading] = useState(false)

  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: DOCUMENT_FORM_DEFAULTS,
  })

  const onSubmit = async (data: DocumentFormValues) => {
    if (loading) return
    setLoading(true)

    try {
      const payload = buildDocumentFormPayload(form.getValues(), data)

      const response = await fetch('/api/generate-service-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => null)
        throw new Error(error?.error ?? 'Falha ao gerar Invoice de Serviço')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Invoice-Servico-${payload.invoiceNumber}.pdf`
      a.click()
      URL.revokeObjectURL(url)

      toast.success('Invoice de Serviço gerada com sucesso!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao gerar invoice de serviço')
    } finally {
      setLoading(false)
    }
  }

  return { form, loading, onSubmit }
}
