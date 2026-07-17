'use client'

import { useFormContext } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/shared/components/ui/card'
import { Input } from '@/src/shared/components/ui/input'
import { Textarea } from '@/src/shared/components/ui/textarea'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/shared/components/ui/form'
import { ConsigneeClientSelect } from './consignee-client-select'
import type { DocumentFormValues } from '@/src/shared/lib/document-form'

export function ConsigneeCard({ disabled }: { disabled?: boolean }) {
  const form = useFormContext<DocumentFormValues>()
  return (
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
                <Input disabled={disabled} {...field} />
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
                <Textarea disabled={disabled} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}
