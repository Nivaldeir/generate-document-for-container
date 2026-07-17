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

export function BrazilBiCard({ disabled }: { disabled?: boolean }) {
  const form = useFormContext<DocumentFormValues>()
  return (
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
                <Input disabled={disabled} {...field} />
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
                <Input disabled={disabled} {...field} />
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
