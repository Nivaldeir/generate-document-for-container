'use client'

import { useFormContext } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/shared/components/ui/card'
import { Textarea } from '@/src/shared/components/ui/textarea'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/shared/components/ui/form'
import type { DocumentFormValues } from '@/src/shared/lib/document-form'

export function ServiceDescriptionCard({ disabled }: { disabled?: boolean }) {
  const form = useFormContext<DocumentFormValues>()
  return (
    <Card>
      <CardHeader>
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
                <Textarea disabled={disabled} rows={4} {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}
