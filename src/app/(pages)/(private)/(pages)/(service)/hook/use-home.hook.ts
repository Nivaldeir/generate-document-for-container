import { useState } from "react"
import { useForm } from "react-hook-form"
import { DEFAULT_VALUES, formDocSchema, FormDocValues } from "../utils/home.utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

export function useHomeHook() {
  const [loading, setLoading] = useState(false)

  const form = useForm<FormDocValues>({
    resolver: zodResolver(formDocSchema),
    defaultValues: DEFAULT_VALUES as FormDocValues,
  })

  const buildPayload = (data: FormDocValues) => {
    const current = form.getValues()
    return {
      ...current,
      ...data,
      logoUrl: current.logoUrl ?? data.logoUrl ?? '',
      signatureUrl: current.signatureUrl ?? data.signatureUrl ?? '',
    }
  }

  const onSubmit = async (data: FormDocValues) => {
    if (loading) return
    setLoading(true)

    try {
      const payload = buildPayload(data)

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

  return {
    form,
    loading,
    onSubmit,
  }
}
