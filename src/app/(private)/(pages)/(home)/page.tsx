'use client'

import type { SubmitHandler } from 'react-hook-form'
import { useState } from 'react'
import { Button } from '@/src/shared/components/ui/button'
import { Input } from '@/src/shared/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/shared/components/ui/card'
import { Textarea } from '@/src/shared/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/shared/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/shared/components/ui/form'
import { FileText, Loader2 } from 'lucide-react'
import type { FormDocValues } from './utils/home.utils'
import { useHomeHook } from './hook/use-home.hook'

export default function HomePage() {
  const { form, handleAssetChange, uploadingLogo, uploadingSignature, logoPreview, signaturePreview, onSubmit, loading, success } = useHomeHook()
  const [containerModalOpen, setContainerModalOpen] = useState(false)
  const [containerCountInput, setContainerCountInput] = useState('')

  return (
    <div className="p-4 sm:p-8">
      <div className="">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Formulário de Documentos</h1>
          <p className="text-slate-600 mt-2">Preencha os dados para gerar os PDFs</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit as SubmitHandler<FormDocValues>)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Identidade visual (opcional)</CardTitle>
                <CardDescription>
                  Logo da empresa e assinatura digital que serão usados nos documentos gerados.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <FormLabel className="text-sm">Logo</FormLabel>
                    {logoPreview && (
                      <div className="flex items-center gap-2">
                        <div className="border rounded bg-white p-1.5 shrink-0">
                          <img src={logoPreview} alt="Logo" className="h-10 w-auto object-contain" />
                        </div>
                        <span className="text-xs text-muted-foreground">Substitua enviando outro arquivo.</span>
                      </div>
                    )}
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleAssetChange(e, 'logo')}
                        disabled={uploadingLogo}
                        className="text-sm"
                      />
                    </FormControl>
                    {uploadingLogo && <p className="text-xs text-muted-foreground">Enviando...</p>}
                  </div>
                  <div className="space-y-2">
                    <FormLabel className="text-sm">Assinatura</FormLabel>
                    {signaturePreview && (
                      <div className="flex items-center gap-2">
                        <div className="border rounded bg-white p-1.5 shrink-0">
                          <img src={signaturePreview} alt="Assinatura" className="h-8 w-auto object-contain" />
                        </div>
                        <span className="text-xs text-muted-foreground">Substitua enviando outra imagem.</span>
                      </div>
                    )}
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleAssetChange(e, 'signature')}
                        disabled={uploadingSignature}
                        className="text-sm"
                      />
                    </FormControl>
                    {uploadingSignature && <p className="text-xs text-muted-foreground">Enviando...</p>}
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
                        <Input
                          {...field}
                          onBlur={(e) => {
                            field.onBlur()
                            const value = form.getValues('blNumber')?.trim()
                            if (value) {
                              const current = form.getValues('containerCount')
                              setContainerCountInput(current != null ? String(current) : '')
                              setContainerModalOpen(true)
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="containerCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Qtd. Containers</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
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

        <Dialog open={containerModalOpen} onOpenChange={setContainerModalOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Quantidade de containers</DialogTitle>
              <DialogDescription>
                Informe quantos containers existem para o B/L {form.watch('blNumber') || ''}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Número de containers</label>
                <Input
                  type="number"
                  min={1}
                  value={containerCountInput}
                  onChange={(e) => setContainerCountInput(e.target.value)}
                  placeholder="Ex: 6"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setContainerModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={() => {
                  const n = parseInt(containerCountInput, 10)
                  if (!Number.isNaN(n) && n >= 1) {
                    form.setValue('containerCount', n)
                    setContainerModalOpen(false)
                  }
                }}
              >
                Confirmar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
