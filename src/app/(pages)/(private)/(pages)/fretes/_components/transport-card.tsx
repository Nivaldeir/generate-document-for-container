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
import { BlNumbersField } from '@/src/shared/components/document-form/bl-numbers-field'
import type { DocumentFormValues } from '@/src/shared/lib/document-form'

const FIELDS: Array<{ name: keyof DocumentFormValues; label: string }> = [
  { name: 'bookingNo', label: 'Booking No.' },
  { name: 'vessel', label: 'Navio/Viagem' },
  { name: 'portOfLoading', label: 'Porto de Embarque' },
  { name: 'portOfDischarge', label: 'Porto de Descarga' },
  { name: 'shippedOnBoardDate', label: 'Data de Embarque' },
]

export function TransportCard({ disabled }: { disabled?: boolean }) {
  const form = useFormContext<DocumentFormValues>()
  return (
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
                <Input disabled={disabled} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <BlNumbersField />
        {FIELDS.slice(1).map(({ name, label }) => (
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
