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
import type { DocumentFormValues } from '@/src/shared/lib/document-form'

const FIELDS: Array<{ name: keyof DocumentFormValues; label: string }> = [
  { name: 'packages', label: 'Pacotes' },
  { name: 'description', label: 'Descrição' },
  { name: 'ncm', label: 'NCM' },
  { name: 'netWeight', label: 'Peso Líquido (KGS)' },
  { name: 'grossWeight', label: 'Peso Bruto (KGS)' },
  { name: 'measurement', label: 'Medida (CBM)' },
]

export function CargoCard({ disabled }: { disabled?: boolean }) {
  const form = useFormContext<DocumentFormValues>()
  return (
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
                <Textarea disabled={disabled} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {FIELDS.map(({ name, label }) => (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Input disabled={disabled} {...field} value={(field.value as string | undefined) ?? ''} />
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
