import { useSyncExternalStore, useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { DEFAULT_VALUES, formDocSchema, FormDocValues } from "../utils/home.utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

const emptySubscribe = () => () => { }
function getStoredLogo(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem('form-logo')
}
function getStoredSignature(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem('form-signature')
}

export function useHomeHook() {
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingSignature, setUploadingSignature] = useState(false)
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [serviceLoading, setServiceLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [trackingOpen, setTrackingOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const storedLogo = useSyncExternalStore(
    emptySubscribe,
    () => (mounted ? getStoredLogo() : null),
    () => null
  )
  const storedSignature = useSyncExternalStore(
    emptySubscribe,
    () => (mounted ? getStoredSignature() : null),
    () => null
  )

  const form = useForm<FormDocValues>({
    resolver: zodResolver(formDocSchema),
    defaultValues: DEFAULT_VALUES as FormDocValues,
  })

  useEffect(() => {
    if (storedLogo) form.setValue('logoUrl', storedLogo)
    if (storedSignature) form.setValue('signatureUrl', storedSignature)
  }, [storedLogo, storedSignature, form])

  const logoPreview = storedLogo
  const signaturePreview = storedSignature

  const handleAssetChange = async (event: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'signature') => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return

    if (type === 'logo') setUploadingLogo(true)
    else setUploadingSignature(true)
    try {
      const formData = new FormData()
      formData.append('type', type)
      formData.append('file', file)
      const res = await fetch('/api/upload-asset', { method: 'POST', body: formData })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Falha no upload')
      }
      const { url } = await res.json()
      if (url) {
        if (type === 'logo') {
          form.setValue('logoUrl', url)
          if (typeof window !== 'undefined') window.localStorage.setItem('form-logo', url)
        } else {
          form.setValue('signatureUrl', url)
          if (typeof window !== 'undefined') window.localStorage.setItem('form-signature', url)
        }
      }
    } catch (e) {
      console.error(e)
      alert(e instanceof Error ? e.message : 'Erro ao enviar arquivo')
    } finally {
      if (type === 'logo') setUploadingLogo(false)
      else setUploadingSignature(false)
    }
  }

  const onSubmit = async (data: FormDocValues) => {
    if (loading) return
    setLoading(true)
    setSuccess(false)
    try {
      const task = (async () => {
        const payload = {
          ...data,
          logoUrl: data.logoUrl ?? form.getValues('logoUrl') ?? '',
          signatureUrl: data.signatureUrl ?? form.getValues('signatureUrl') ?? '',
        }
        const enqueueRes = await fetch('/api/generate-pdfs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!enqueueRes.ok) {
          const err = await enqueueRes.json().catch(() => null)
          throw new Error(err?.message ?? err?.error ?? 'Falha ao enfileirar geração de PDFs')
        }

        await enqueueRes.json().catch(() => null)

        let attempts = 0
        let lastError: string | undefined

        while (attempts < 5) {
          const workerRes = await fetch('/api/worker/process-pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          })

          if (!workerRes.ok) {
            const err = await workerRes.json().catch(() => null)
            lastError = err?.error ?? 'Falha ao processar geração de PDFs'
            break
          }

          const workerJson = await workerRes.json().catch(() => null)
          if (workerJson?.error) {
            lastError = workerJson.error as string
            break
          }

          if (!workerJson?.processed) {
            attempts += 1
            await new Promise((resolve) => setTimeout(resolve, 500))
            continue
          }

          break
        }

        if (lastError) {
          throw new Error(lastError)
        }
      })()

      const minDelay = new Promise((resolve) => setTimeout(resolve, 2000))

      await Promise.all([
        toast.promise(task, {
          loading: 'Gerando PDFs...',
          success: 'PDFs gerados com sucesso!',
          error: 'Erro ao gerar PDFs',
        }),
        minDelay,
      ])
      setSuccess(true)
    } catch (error) {
      console.error('[home] Erro ao processar requisição:', error)
      alert(error instanceof Error ? error.message : 'Erro ao processar requisição')
    } finally {
      setLoading(false)
    }
  }

  const onGenerateServiceInvoice = async (data: FormDocValues) => {
    if (serviceLoading) return
    setServiceLoading(true)
    try {
      const payload = { ...data, invoiceType: 'service' as const }
      const response = await fetch('/api/download-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'invoice-service', data: payload }),
      })
      if (!response.ok) {
        const error = await response.json().catch(() => null)
        throw new Error(error?.details ?? error?.error ?? 'Falha ao gerar Invoice de Serviço')
      }
      const { html } = await response.json()
      const { default: jsPDF } = await import('jspdf')
      const html2canvas = (await import('html2canvas')).default

      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = html
      tempDiv.style.position = 'absolute'
      tempDiv.style.left = '-9999px'
      tempDiv.style.width = '210mm'
      document.body.appendChild(tempDiv)

      try {
        const canvas = await html2canvas(tempDiv, {
          scale: 2,
          useCORS: true,
          logging: false,
        })
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
        const imgWidth = 210
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
        const filename = `Invoice-Servico-${payload.invoiceNumber}.pdf`
        pdf.save(filename)
      } finally {
        document.body.removeChild(tempDiv)
      }
    } catch (error) {
      console.error('[home] Erro ao gerar invoice de serviço:', error)
      alert(error instanceof Error ? error.message : 'Erro ao gerar invoice de serviço')
    } finally {
      setServiceLoading(false)
    }
  }

  return {
    form,
    handleAssetChange,
    uploadingLogo,
    uploadingSignature,
    logoPreview,
    signaturePreview,
    loading,
    processing,
    serviceLoading,
    success,
    onSubmit,
    onGenerateServiceInvoice,
    trackingOpen,
    setTrackingOpen,
  }
}