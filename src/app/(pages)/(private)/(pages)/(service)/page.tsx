'use client'

import type { SubmitHandler } from 'react-hook-form'
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
import type { FormDocValues } from './utils/home.utils'
import { useHomeHook } from './hook/use-home.hook'
import { BlNumbersField } from './_components/bl-numbers-field'
import { ConsigneeClientSelect } from './_components/consignee-client-select'

export default function HomePage() {
  const {
    form,
    onSubmit,
    loading,
  } = useHomeHook()

  const isFormDisabled = loading

  return (
    <div className="p-4 sm:p-8">
      <div className="">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Formulário de Documentos</h1>
          <p className="text-slate-600 mt-2">Preencha os dados para gerar os PDFs</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit as SubmitHandler<FormDocValues>)} className="space-y-6">
            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => <Input type="hidden" {...field} value={field.value ?? ''} />}
            />
            <FormField
              control={form.control}
              name="signatureUrl"
              render={({ field }) => <Input type="hidden" {...field} value={field.value ?? ''} />}
            />

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
                        <Input disabled={isFormDisabled} {...field} />
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
                        <Input disabled={isFormDisabled} {...field} />
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
                        <Textarea disabled={isFormDisabled} {...field} />
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
                <CardDescription>Importador / destinatário da carga</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <ConsigneeClientSelect />
                <FormField
                  control={form.control}
                  name="consigneeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input disabled={isFormDisabled} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="consigneeAddress"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Textarea disabled={isFormDisabled} {...field} />
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
                      <FormLabel>Banco Beneficiário (opcional)</FormLabel>
                      <FormControl>
                        <Input disabled={isFormDisabled} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bankCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Code (opcional)</FormLabel>
                      <FormControl>
                        <Input disabled={isFormDisabled} {...field} />
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
                      <FormLabel>SWIFT Code (opcional)</FormLabel>
                      <FormControl>
                        <Input disabled={isFormDisabled} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="swiftBic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SWIFT/BIC (opcional)</FormLabel>
                      <FormControl>
                        <Input disabled={isFormDisabled} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="intermediaryBank"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Intermediary Bank (opcional)</FormLabel>
                      <FormControl>
                        <Input disabled={isFormDisabled} {...field} />
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
                        <Input disabled={isFormDisabled} {...field} />
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
                        <Input disabled={isFormDisabled} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="branchCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch Code (opcional)</FormLabel>
                      <FormControl>
                        <Input disabled={isFormDisabled} {...field} />
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
                      <FormLabel>Bank Add / Endereço do Banco (opcional)</FormLabel>
                      <FormControl>
                        <Input disabled={isFormDisabled} {...field} />
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
                  name="documentDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data</FormLabel>
                      <FormControl>
                        <Input disabled={isFormDisabled} placeholder="ex: 02/10/2025" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="templateGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grupo de Template</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="group-1">Grupo 1</SelectItem>
                          <SelectItem value="group-2">Grupo 2</SelectItem>
                          <SelectItem value="group-3">Grupo 3</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                        <Input disabled={isFormDisabled} {...field} />
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
                      <Select disabled={isFormDisabled} onValueChange={field.onChange} value={field.value}>
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
                        <Input disabled={isFormDisabled} {...field} />
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
                        <Input disabled={isFormDisabled} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
<<<<<<< HEAD
                <CardTitle>B/L(s)</CardTitle>
                <CardDescription>
                  Informe um ou mais B/Ls. Ao adicionar mais de um, informe o valor de cada BL — o total da invoice será a soma desses valores.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <BlNumbersField />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
=======
>>>>>>> e21d9274791a5edf073a4c6c141e17ae9c08ffb7
                <CardTitle>Descrição do Serviço</CardTitle>
                <CardDescription>Texto que aparecerá no topo da Invoice de serviço.</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="serviceDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição detalhada</FormLabel>
                      <FormControl>
                        <Textarea disabled={isFormDisabled} rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center max-w-md">
              <Button
                type="submit"
                size="lg"
                className="flex-1"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-5 w-5" />
                    Gerar Invoice de Serviço
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
