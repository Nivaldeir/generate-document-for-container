'use client'

import { useCallback, useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/src/shared/components/ui/button'
import { Input } from '@/src/shared/components/ui/input'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/shared/components/ui/form'
import { useBlTracker } from '@/src/shared/hooks/use-bl-tracker'
import type { DocumentFormValues } from '@/src/shared/lib/document-form'

export function BlNumbersField() {
  const form = useFormContext<DocumentFormValues>()
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'blNumbers' as never,
  })
  const { trackBl, openUsedBlModal } = useBlTracker()
  const [trackingIndex, setTrackingIndex] = useState<number | null>(null)

  const handleBlur = useCallback(
    async (index: number) => {
      const value = form.getValues(`blNumbers.${index}`)?.trim()
      if (!value) return
      setTrackingIndex(index)
      try {
        const response = await trackBl(value)
        const initialCount = response?.numberContainer ?? 0
        if (response?.existed) {
          openUsedBlModal(
            value,
            initialCount,
            (n) =>
              form.setValue('containerCount', n, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              }),
            response?.destination ?? '',
          )
        } else {
          form.setValue('containerCount', 1, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          })
        }
      } catch (error) {
        console.error(error)
      } finally {
        setTrackingIndex(null)
      }
    },
    [form, trackBl, openUsedBlModal],
  )

  return (
    <div className="sm:col-span-2 lg:col-span-3 space-y-3">
      <FormLabel>B/L Number(s)</FormLabel>
      {fields.map((field, i) => (
        <FormField
          key={field.id}
          control={form.control}
          name={`blNumbers.${i}`}
          render={({ field: f }) => (
            <FormItem>
              <FormControl>
                <div className="flex gap-2 items-center">
                  <div className="relative flex-1">
                    <Input
                      {...f}
                      disabled={trackingIndex !== null}
                      className="pr-10"
                      placeholder={`BL #${i + 1}`}
                      onBlur={() => {
                        f.onBlur()
                        handleBlur(i)
                      }}
                    />
                    {trackingIndex === i && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={fields.length <= 1}
                    onClick={() => remove(i)}
                    aria-label="Remover BL"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append('')}
        disabled={trackingIndex !== null}
      >
        <Plus className="h-4 w-4 mr-2" />
        Adicionar BL
      </Button>
      {!form.watch('containerCount') && (
        <FormField
          control={form.control}
          name="containerCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Qtd. Containers</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  disabled={trackingIndex !== null}
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) =>
                    field.onChange(e.target.value ? Number(e.target.value) : undefined)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  )
}
