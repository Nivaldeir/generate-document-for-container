'use client'

import { useFormContext } from 'react-hook-form'
import { Input } from '@/src/shared/components/ui/input'
import { FormField } from '@/src/shared/components/ui/form'
import type { DocumentFormValues } from '@/src/shared/lib/document-form'

export function HiddenAssetFields() {
  const form = useFormContext<DocumentFormValues>()
  return (
    <>
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
    </>
  )
}
