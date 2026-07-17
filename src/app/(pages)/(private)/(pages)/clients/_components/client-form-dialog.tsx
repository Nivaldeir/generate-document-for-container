'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/shared/components/ui/dialog'
import { Form } from '@/src/shared/components/ui/form'
import { Button } from '@/src/shared/components/ui/button'
import { Loader2 } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import type { ClientFormValues } from '../hooks/use-clients.hook'
import { ClientFormFields } from './client-form-fields'

type ClientFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  form: UseFormReturn<ClientFormValues>
  isEditing: boolean
  isPending: boolean
  uploadingLogo: boolean
  uploadingSignature: boolean
  handleLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSignatureChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: () => void
}

export function ClientFormDialog({
  open,
  onOpenChange,
  form,
  isEditing,
  isPending,
  uploadingLogo,
  uploadingSignature,
  handleLogoChange,
  handleSignatureChange,
  onSubmit,
}: ClientFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar cliente' : 'Novo cliente'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Altere os dados do cliente e salve.'
              : 'Preencha os dados do novo cliente.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            <ClientFormFields
              handleLogoChange={handleLogoChange}
              handleSignatureChange={handleSignatureChange}
              uploadingLogo={uploadingLogo}
              uploadingSignature={uploadingSignature}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
