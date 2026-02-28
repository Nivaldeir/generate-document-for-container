import { useSyncExternalStore, useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { DEFAULT_VALUES, formDocSchema, FormDocValues } from "../utils/home.utils"
import { zodResolver } from "@hookform/resolvers/zod"

const emptySubscribe = () => () => {}
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
  const [success, setSuccess] = useState(false)
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
    setLoading(true)
    setSuccess(false)
    const batchId =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`

    try {
      await generateAndSavePDF('bl', `BL-${data.blNumber}.pdf`, data, batchId, 'bl')
      await new Promise(resolve => setTimeout(resolve, 300))
      await generateAndSavePDF('payment', `Pagamento-Frete-${data.invoiceNumber}.pdf`, data, batchId, 'payment')
      await new Promise(resolve => setTimeout(resolve, 300))
      await generateAndSavePDF('invoice', `Invoice-${data.invoiceNumber}.pdf`, data, batchId, 'invoice')
      setSuccess(true)
    } catch (error) {
      console.error('[v0] Erro ao processar requisição:', error)
      alert('Erro ao processar requisição')
    } finally {
      setLoading(false)
    }
  }

  const generateAndSavePDF = async (type: string, filename: string, data: FormDocValues, batchId: string, kind: 'bl' | 'payment' | 'invoice') => {
    const response = await fetch('/api/download-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Falha ao gerar ${filename}: ${error.details || error.error}`)
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

      const blob = pdf.output('blob')
      const formData = new FormData()
      formData.append('file', blob, filename)
      formData.append('originalName', filename)
      formData.append('batchId', batchId)
      formData.append('kind', kind)
      await fetch('/api/documentos', { method: 'POST', body: formData })
    } finally {
      document.body.removeChild(tempDiv)
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
    success,
    onSubmit,
  }
}