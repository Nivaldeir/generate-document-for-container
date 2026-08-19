import { useState } from "react"
import { useForm } from "react-hook-form"
import { DEFAULT_VALUES, formDocSchema, FormDocValues } from "../utils/home.utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

const POLL_INTERVAL_MS = 1_500
const POLL_TIMEOUT_MS = 60_000

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function pollJobUntilDone(jobId: string): Promise<void> {
  const deadline = Date.now() + POLL_TIMEOUT_MS

  while (Date.now() < deadline) {
    const res = await fetch(`/api/generate-pdfs/${jobId}`)
    if (!res.ok) throw new Error('Falha ao consultar status do job')

    const job = await res.json()

    if (job.status === 'COMPLETED') return
    if (job.status === 'FAILED') throw new Error(job.error ?? 'Falha na geração dos PDFs')

    await sleep(POLL_INTERVAL_MS)
  }

  throw new Error('Timeout: a geração demorou mais que o esperado. Verifique os documentos gerados.')
}

export function useHomeHook() {
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [lastJobId, setLastJobId] = useState<string | null>(null)

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
    if (loading || processing) return
    setLoading(true)
    setSuccess(false)

    try {
      const payload = buildPayload(data)

      const enqueueRes = await fetch('/api/generate-pdfs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!enqueueRes.ok) {
        const err = await enqueueRes.json().catch(() => null)
        throw new Error(err?.message ?? err?.error ?? 'Falha ao enfileirar geração de PDFs')
      }
      const { jobId } = await enqueueRes.json()
      setLastJobId(jobId)

      setLoading(false)
      setProcessing(true)

      const workerRes = await fetch('/api/worker/process-pdf', { method: 'POST' })
      if (!workerRes.ok) {
        throw new Error('Falha ao iniciar o processamento dos PDFs. Tente novamente.')
      }

      const pollPromise = pollJobUntilDone(jobId)
      toast.promise(pollPromise, {
        loading: 'Gerando PDFs...',
        success: 'PDFs gerados com sucesso!',
        error: (err) => err?.message ?? 'Erro ao gerar PDFs',
      })
      await pollPromise

      setSuccess(true)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao processar requisição')
    } finally {
      setLoading(false)
      setProcessing(false)
    }
  }

  return {
    form,
    loading,
    processing,
    success,
    lastJobId,
    onSubmit,
  }
}
