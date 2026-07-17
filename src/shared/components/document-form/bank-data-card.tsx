'use client'

import { useFormContext } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/shared/components/ui/card'
import { Input } from '@/src/shared/components/ui/input'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/shared/components/ui/form'
import type { DocumentFormValues } from '@/src/shared/lib/document-form'

const BANK_FIELDS: Array<{
  name: keyof DocumentFormValues
  label: string
  className?: string
}> = [
  { name: 'beneficiaryBank', label: 'Banco Beneficiário (opcional)' },
  { name: 'bankCode', label: 'Bank Code (opcional)' },
  { name: 'swiftCode', label: 'SWIFT Code (opcional)' },
  { name: 'swiftBic', label: 'SWIFT/BIC (opcional)' },
  { name: 'intermediaryBank', label: 'Intermediary Bank (opcional)' },
  { name: 'accountNumber', label: 'Número da Conta' },
  { name: 'routingNumber', label: 'Routing Number' },
  { name: 'branchCode', label: 'Branch Code (opcional)' },
  { name: 'beneficiaryAddress', label: 'Bank Add / Endereço do Banco (opcional)', className: 'sm:col-span-2' },
]

export function BankDataCard({ disabled }: { disabled?: boolean }) {
  const form = useFormContext<DocumentFormValues>()
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados Bancários</CardTitle>
        <CardDescription>Informações da conta beneficiária</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        {BANK_FIELDS.map(({ name, label, className }) => (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem className={className}>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Input
                    disabled={disabled}
                    {...field}
                    value={(field.value as string | undefined) ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </CardContent>
    </Card>
  )
}
