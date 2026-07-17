'use client'

import { useCallback } from 'react'
import { useFormContext } from 'react-hook-form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/components/ui/select'
import { FormControl, FormItem, FormLabel } from '@/src/shared/components/ui/form'
import { trpc } from '@/src/shared/lib/trpc'
import type { DocumentFormValues } from '@/src/shared/lib/document-form'

export function ConsigneeClientSelect() {
  const form = useFormContext<DocumentFormValues>()
  const { data: clients = [], isLoading } = trpc.clients.list.useQuery()

  const handleChange = useCallback(
    (value: string) => {
      const client = clients.find((c) => c.id === value)
      if (!client) return
      const opts = { shouldDirty: true, shouldTouch: true } as const
      form.setValue('consigneeName', client.name, opts)
      form.setValue('consigneeAddress', client.address, opts)
      form.setValue('beneficiaryBank', client.beneficiaryBank ?? '', opts)
      form.setValue('bankCode', client.bankCode ?? '', opts)
      form.setValue('branchCode', client.branchCode ?? '', opts)
      form.setValue('swiftCode', client.swiftCode ?? '', opts)
      form.setValue('swiftBic', client.swiftBic ?? '', opts)
      form.setValue('intermediaryBank', client.intermediaryBank ?? '', opts)
      form.setValue('accountNumber', client.accountNumber ?? '', opts)
      form.setValue('routingNumber', client.routingNumber ?? '', opts)
      form.setValue('beneficiaryAddress', client.beneficiaryAddress ?? '', opts)
      form.setValue('logoUrl', client.logoUrl ?? '', opts)
      form.setValue('signatureUrl', client.signatureUrl ?? '', opts)
    },
    [clients, form],
  )

  const disabled = isLoading || clients.length === 0

  return (
    <FormItem className="sm:col-span-2">
      <FormLabel>Cliente (preencher Dados do Consignee)</FormLabel>
      <FormControl>
        <Select onValueChange={handleChange} disabled={disabled}>
          <SelectTrigger>
            <SelectValue
              placeholder={
                disabled
                  ? 'Nenhum cliente cadastrado'
                  : 'Selecione um cliente para preencher o Consignee'
              }
            />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormControl>
    </FormItem>
  )
}
