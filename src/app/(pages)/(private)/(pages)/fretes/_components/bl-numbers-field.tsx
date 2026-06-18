'use client'

import { useState, useCallback } from 'react'
import { useFormContext, useFieldArray } from 'react-hook-form'
import { Button } from '@/src/shared/components/ui/button'
import { Input } from '@/src/shared/components/ui/input'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/shared/components/ui/form'
import { Plus, Trash2 } from 'lucide-react'
import { Loader2 } from 'lucide-react'
import { useHomeAction } from '../hook/use-home.action'
import type { FormDocValues } from '../utils/home.utils'

export function BlNumbersField() {
  const form = useFormContext<FormDocValues>()
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'blNumbers' as never,
  })
<<<<<<< HEAD
  const { append: appendValue, remove: removeValue } = useFieldArray({
    control: form.control,
    name: 'blValues' as never,
  })
  const { trackBl, handleOpenUsedModal } = useHomeAction()
  const [trackingIndex, setTrackingIndex] = useState<number | null>(null)
  const showValuePerBl = fields.length > 1
=======
  const { trackBl, handleOpenUsedModal } = useHomeAction()
  const [trackingIndex, setTrackingIndex] = useState<number | null>(null)
>>>>>>> e21d9274791a5edf073a4c6c141e17ae9c08ffb7

  const handleBlur = useCallback(
    async (index: number) => {
      const value = form.getValues(`blNumbers.${index}`)?.trim()
      if (!value) return
      setTrackingIndex(index)
      try {
        const response = await trackBl(value)
        const initialCount = response?.numberContainer ?? 0
        if (response?.existed) {
          handleOpenUsedModal(
            value,
            initialCount,
            (number) =>
              form.setValue('containerCount', number, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              }),
            response?.destination ?? ''
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
    [form, trackBl, handleOpenUsedModal]
  )

  return (
    <div className="sm:col-span-2 lg:col-span-3 space-y-3">
      <FormLabel>B/L Number(s)</FormLabel>
      {fields.map((field, i) => (
<<<<<<< HEAD
        <div key={field.id} className="flex gap-2 items-start">
          <FormField
            control={form.control}
            name={`blNumbers.${i}`}
            render={({ field: f }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <div className="relative">
=======
        <FormField
          key={field.id}
          control={form.control}
          name={`blNumbers.${i}`}
          render={({ field: f }) => (
            <FormItem>
              <FormControl>
                <div className="flex gap-2 items-center">
                  <div className="relative flex-1">
>>>>>>> e21d9274791a5edf073a4c6c141e17ae9c08ffb7
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
<<<<<<< HEAD
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {showValuePerBl && (
            <FormField
              control={form.control}
              name={`blValues.${i}`}
              render={({ field: f }) => (
                <FormItem className="w-36">
                  <FormControl>
                    <Input
                      {...f}
                      value={f.value ?? ''}
                      disabled={trackingIndex !== null}
                      placeholder={`Valor BL #${i + 1}`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={fields.length <= 1}
            onClick={() => {
              remove(i)
              removeValue(i)
            }}
            aria-label="Remover BL"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
=======
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
>>>>>>> e21d9274791a5edf073a4c6c141e17ae9c08ffb7
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
<<<<<<< HEAD
        onClick={() => {
          append('')
          appendValue('')
        }}
=======
        onClick={() => append('')}
>>>>>>> e21d9274791a5edf073a4c6c141e17ae9c08ffb7
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
                    field.onChange(
                      e.target.value ? Number(e.target.value) : undefined
                    )
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
