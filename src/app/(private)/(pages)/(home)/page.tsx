'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/src/shared/components/ui/button'
import { Input } from '@/src/shared/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/shared/components/ui/card'
import { Textarea } from '@/src/shared/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/shared/components/ui/form'
import { FileText, Loader2 } from 'lucide-react'

const formDocSchema = z.object({
  shipperName: z.string(),
  shipperAddress: z.string(),
  shipperCnpj: z.string(),
  consigneeName: z.string(),
  consigneeAddress: z.string(),
  brazilBiName: z.string(),
  brazilBiAddress: z.string(),
  brazilBiCep: z.string().optional(),
  brazilBiCnpj: z.string(),
  bookingNo: z.string(),
  blNumber: z.string(),
  vessel: z.string(),
  portOfLoading: z.string(),
  portOfDischarge: z.string(),
  placeOfReceipt: z.string(),
  placeOfDelivery: z.string().optional(),
  containers: z.string(),
  containerType: z.string(),
  packages: z.string(),
  description: z.string(),
  ncm: z.string(),
  netWeight: z.string(),
  grossWeight: z.string(),
  measurement: z.string(),
  freightValue: z.string(),
  incoterm: z.enum(['FOB', 'CIF', 'CFR', 'EXW']),
  currency: z.enum(['USD', 'EUR', 'BRL']),
  beneficiaryBank: z.string(),
  beneficiaryAddress: z.string(),
  swiftCode: z.string(),
  accountNumber: z.string(),
  routingNumber: z.string(),
  correspondent: z.string(),
  invoiceNumber: z.string(),
  circular: z.string(),
  shippedOnBoardDate: z.string(),
  issueDate: z.string().optional(),
  paymentDate: z.string(),
  invoiceDate: z.string(),
  logoUrl: z.string().optional(),
  signatureUrl: z.string().optional(),
})

type FormDocValues = z.infer<typeof formDocSchema>

const defaultValues: FormDocValues = {
  shipperName: 'AGG ASSESSORIA LTDA',
  shipperAddress: 'R DOUTOR PAULO JOSE DE AZEVEDO BONAVIDES, 1008 - 11.445-490 - JARDIM ACAPULCO - GUARUJÁ - SP',
  shipperCnpj: '43.651.382/0001-26',
  consigneeName: 'Alto Products Corp.',
  consigneeAddress: 'One Alto Way, Atmore, AL 36502, USA',
  brazilBiName: 'BRAZIL BUSINESS INTELLIGENCE COMEX LTDA',
  brazilBiAddress: 'AV VEREADOR ABRAHAO JOAO FRANCISCO, 2957 SALA 03 BOX 88 - RESSACADA - ITAJAÍ - SC',
  brazilBiCep: '88302-102',
  brazilBiCnpj: '54.438.731/0001-42',
  bookingNo: 'MEDUOK815514001US',
  blNumber: 'MEDUOK815514001US',
  vessel: 'KURE - UA505A',
  portOfLoading: 'NORFOLK, VA',
  portOfDischarge: 'RIO DE JANEIRO',
  placeOfReceipt: 'N/M',
  placeOfDelivery: '',
  containers: 'MSNU6511543 (1998544), TRHU7731937 (1998545), BEAU5669022 (1998548), MSMU4729194 (1998546), MSNU9697853 (1998547), FFAU2515733 (1998543)',
  containerType: '06X40 HC',
  packages: '55 Package(s) of (PALLETS)',
  description: 'F8.0MM 110KSI UTS 3.1 STEEL WIRE',
  ncm: '7217',
  netWeight: '18916',
  grossWeight: '106,818.000',
  measurement: '67.040',
  freightValue: '17.494,26',
  incoterm: 'FOB',
  currency: 'USD',
  beneficiaryBank: 'United Bank',
  beneficiaryAddress: '200 E. Nashville Ave Atmore, AL 36502, USA',
  swiftCode: 'FRNAUS44',
  accountNumber: '1620036291',
  routingNumber: '062102098',
  correspondent: 'FNBB',
  invoiceNumber: 'ALTOUSA-240108',
  circular: 'DB97798451',
  shippedOnBoardDate: '02/10/2025',
  issueDate: '02/10/2025',
  paymentDate: '3 DE DEZEMBRO DE 2025',
  invoiceDate: 'DEZ 3 2025',
}

export default function HomePage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null)

  const form = useForm<FormDocValues>({
    resolver: zodResolver(formDocSchema),
    defaultValues,
  })

  const handleLogoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result
      if (typeof result !== 'string') return
      setLogoPreview(result)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('form-logo', result)
      }
      form.setValue('logoUrl', result)
    }
    reader.readAsDataURL(file)
  }

  const handleSignatureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result
      if (typeof result !== 'string') return
      setSignaturePreview(result)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('form-signature', result)
      }
      form.setValue('signatureUrl', result)
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    const storedLogo = window.localStorage.getItem('form-logo')
    if (storedLogo) {
      setLogoPreview(storedLogo)
      form.setValue('logoUrl', storedLogo)
    }
    const storedSignature = window.localStorage.getItem('form-signature')
    if (storedSignature) {
      setSignaturePreview(storedSignature)
      form.setValue('signatureUrl', storedSignature)
    }
  }, [form])

  const generateAndSavePDF = async (
    type: string,
    filename: string,
    data: FormDocValues,
    batchId: string,
    kind: 'bl' | 'payment' | 'invoice',
  ) => {
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

  return (
    <div className="p-4 sm:p-8">
      <div className="">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Formulário de Documentos</h1>
          <p className="text-slate-600 mt-2">Preencha os dados para gerar os PDFs</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Identidade visual (opcional)</CardTitle>
              <CardDescription>
                Logo da empresa e assinatura digital que serão usados nos documentos gerados.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <FormLabel>Logo da empresa</FormLabel>
                {logoPreview && (
                  <div className="flex items-center gap-4">
                    <div className="border rounded-md bg-white p-2">
                      <img
                        src={logoPreview}
                        alt="Logo atual"
                        className="h-16 w-auto object-contain"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Logo atual. Envie outro arquivo se quiser trocar.
                    </p>
                  </div>
                )}
                <div className="space-y-2">
                  <FormControl>
                    <Input type="file" accept="image/*" onChange={handleLogoChange} />
                  </FormControl>
                </div>
              </div>

              <div className="space-y-4">
                <FormLabel>Assinatura (imagem)</FormLabel>
                {signaturePreview && (
                  <div className="flex items-center gap-4">
                    <div className="border rounded-md bg-white p-2">
                      <img
                        src={signaturePreview}
                        alt="Assinatura atual"
                        className="h-12 w-auto object-contain"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Assinatura atual. Envie outra imagem se quiser trocar.
                    </p>
                  </div>
                )}
                <div className="space-y-2">
                  <FormControl>
                    <Input type="file" accept="image/*" onChange={handleSignatureChange} />
                  </FormControl>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Dados do Shipper/Exportador</CardTitle>
              <CardDescription>Informações do remetente da carga</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="shipperName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shipperCnpj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNPJ</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shipperAddress"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Endereço Completo</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dados do Consignee</CardTitle>
              <CardDescription>Informações do destinatário</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="consigneeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="consigneeAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Brazil Business Intelligence</CardTitle>
              <CardDescription>Dados do agente no Brasil</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="brazilBiName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brazilBiCnpj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNPJ</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brazilBiAddress"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dados de Transporte</CardTitle>
              <CardDescription>Informações do BL e embarcação</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="bookingNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Booking No.</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="blNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>B/L Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vessel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Navio/Viagem</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="portOfLoading"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Porto de Embarque</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="portOfDischarge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Porto de Descarga</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shippedOnBoardDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Embarque</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dados da Carga</CardTitle>
              <CardDescription>Descrição e quantidades</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="containers"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Containers</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="packages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pacotes</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ncm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NCM</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="netWeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso Líquido (KGS)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="grossWeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso Bruto (KGS)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="measurement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medida (CBM)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dados Financeiros</CardTitle>
              <CardDescription>Valores e condições de pagamento</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Moeda</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="BRL">BRL</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="freightValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor do Frete</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="incoterm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Incoterm</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="FOB">FOB</SelectItem>
                        <SelectItem value="CIF">CIF</SelectItem>
                        <SelectItem value="CFR">CFR</SelectItem>
                        <SelectItem value="EXW">EXW</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="invoiceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número da Invoice</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="circular"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Circular</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dados Bancários</CardTitle>
              <CardDescription>Informações da conta beneficiária</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="beneficiaryBank"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banco Beneficiário</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="swiftCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SWIFT Code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número da Conta</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="routingNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Routing Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="beneficiaryAddress"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Endereço do Banco</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" size="lg" className="flex-1" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Gerando PDFs...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-5 w-5" />
                  Gerar Documentos
                </>
              )}
            </Button>
          </div>
          </form>
        </Form>

        {success && (
          <Card className="mt-8 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-900">Documentos gerados com sucesso</CardTitle>
              <CardDescription className="text-green-700">
                Os 3 documentos (BL, Pagamento de Frete e Invoice) foram gerados e salvos. Acesse &quot;Listar Documentos&quot; no menu para visualizar ou baixar.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  )
}
