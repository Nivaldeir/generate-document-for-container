'use client'

import { useCallback } from 'react'
import { useFormContext } from 'react-hook-form'
import type { FormDocValues } from '../utils/home.utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/components/ui/select'
import { FormControl, FormItem, FormLabel } from '@/src/shared/components/ui/form'
import { trpc } from '@/src/shared/lib/trpc'

export function BrazilBiSelect() {
  const form = useFormContext<FormDocValues>()
  const { data: clients = [], isLoading } = trpc.clients.list.useQuery()

  const handleChange = useCallback(
    (value: string) => {
      const client = clients.find((c) => c.id === value)
      if (!client) return
      form.setValue('brazilBiName', client.name, { shouldDirty: true, shouldTouch: true })
      form.setValue('brazilBiCnpj', client.cnpj, { shouldDirty: true, shouldTouch: true })
      form.setValue('brazilBiAddress', client.address, { shouldDirty: true, shouldTouch: true })
    },
    [clients, form]
  )

  const disabled = isLoading || clients.length === 0

  return (
    <FormItem className="sm:col-span-2">
      <FormLabel>Perfil do agente (preencher automático)</FormLabel>
      <FormControl>
        <Select onValueChange={handleChange} disabled={disabled}>
          <SelectTrigger>
            <SelectValue
              placeholder={
                disabled ? 'Nenhum cliente cadastrado' : 'Selecione um cliente para preencher os dados'
              }
            />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name} — {client.cnpj}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormControl>
    </FormItem>
  )
}


