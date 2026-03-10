'use client'

import { useFormContext } from 'react-hook-form'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/src/shared/components/ui/card'
import { Input } from '@/src/shared/components/ui/input'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/shared/components/ui/form'
import type { ClientFormValues } from '../hooks/use-clients.hook'

type ClientFormFieldsProps = {
  handleLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSignatureChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  uploadingLogo: boolean
  uploadingSignature: boolean
}

export function ClientFormFields({
  handleLogoChange,
  handleSignatureChange,
  uploadingLogo,
  uploadingSignature,
}: ClientFormFieldsProps) {
  const form = useFormContext<ClientFormValues>()
  const logoPreview = form.watch('logoUrl')
  const signaturePreview = form.watch('signatureUrl')

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome do cliente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cnpj"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CNPJ</FormLabel>
              <FormControl>
                <Input placeholder="00.000.000/0000-00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input placeholder="Endereço completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="logoUrl"
          render={() => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Logo (opcional)</FormLabel>
              {logoPreview && (
                <div className="flex items-center gap-2 mb-2">
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
                  onChange={handleLogoChange}
                  disabled={uploadingLogo}
                  className="text-sm"
                />
              </FormControl>
              {uploadingLogo && <p className="text-xs text-muted-foreground mt-1">Enviando...</p>}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="signatureUrl"
          render={() => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Assinatura (opcional)</FormLabel>
              {signaturePreview && (
                <div className="flex items-center gap-2 mb-2">
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
                  onChange={handleSignatureChange}
                  disabled={uploadingSignature}
                  className="text-sm"
                />
              </FormControl>
              {uploadingSignature && <p className="text-xs text-muted-foreground mt-1">Enviando...</p>}
            </FormItem>
          )}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados Bancários</CardTitle>
          <CardDescription>Informações da conta beneficiária (opcional)</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 pt-0">
          <FormField
            control={form.control}
            name="beneficiaryBank"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Banco Beneficiário (opcional)</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>SWIFT Code (opcional)</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <Input {...field} />
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
                <FormLabel>Número da Conta (opcional)</FormLabel>
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
                <FormLabel>Routing Number (opcional)</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>Bank Add / Endereço do Banco (opcional)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  )
}
