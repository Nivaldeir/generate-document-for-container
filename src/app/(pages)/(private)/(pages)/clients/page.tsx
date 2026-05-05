'use client'

import { useState, useCallback, useMemo } from 'react'
import { trpc } from '@/src/shared/lib/trpc'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/src/shared/components/ui/card'
import { Button } from '@/src/shared/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/shared/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/src/shared/components/ui/dialog'
import { Form } from '@/src/shared/components/ui/form'
import { Loader2, Users, Plus, Pencil } from 'lucide-react'
import { useClients, clientFormDefaultValues } from './hooks/use-clients.hook'
import type { ClientFormValues } from './hooks/use-clients.hook'
import { ClientFormFields } from './_components/client-form-fields'
import { TablePagination } from '@/src/shared/components/ui/table-pagination'

const PAGE_SIZE = 10

type ClientRow = {
  id: string
  name: string
  cnpj: string
  address: string
  logoUrl?: string | null
  signatureUrl?: string | null
  beneficiaryBank?: string | null
  bankCode?: string | null
  branchCode?: string | null
  swiftCode?: string | null
  swiftBic?: string | null
  intermediaryBank?: string | null
  accountNumber?: string | null
  routingNumber?: string | null
  beneficiaryAddress?: string | null
}

function clientToFormValues(c: ClientRow): ClientFormValues {
  return {
    name: c.name,
    cnpj: c.cnpj,
    address: c.address,
    logoUrl: c.logoUrl ?? '',
    signatureUrl: c.signatureUrl ?? '',
    beneficiaryBank: c.beneficiaryBank ?? '',
    bankCode: c.bankCode ?? '',
    branchCode: c.branchCode ?? '',
    swiftCode: c.swiftCode ?? '',
    swiftBic: c.swiftBic ?? '',
    intermediaryBank: c.intermediaryBank ?? '',
    accountNumber: c.accountNumber ?? '',
    routingNumber: c.routingNumber ?? '',
    beneficiaryAddress: c.beneficiaryAddress ?? '',
  }
}

export default function ClientsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<ClientRow | null>(null)
  const [page, setPage] = useState(1)

  const {
    form,
    uploadingLogo,
    uploadingSignature,
    handleLogoChange,
    handleSignatureChange,
  } = useClients()

  const utils = trpc.useUtils()
  const { data: clients = [], isLoading } = trpc.clients.list.useQuery()
  const { mutateAsync: createClient, isPending: isCreating } = trpc.clients.create.useMutation({
    onSuccess: () => {
      void utils.clients.list.invalidate()
    },
  })
  const { mutateAsync: updateClient, isPending: isUpdating } = trpc.clients.update.useMutation({
    onSuccess: () => {
      void utils.clients.list.invalidate()
    },
  })

  const isPending = isCreating || isUpdating

  const totalPages = Math.ceil((clients as ClientRow[]).length / PAGE_SIZE)
  const pagedClients = useMemo(
    () => (clients as ClientRow[]).slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [clients, page]
  )

  const openCreate = useCallback(() => {
    setEditingClient(null)
    form.reset(clientFormDefaultValues)
    setModalOpen(true)
  }, [form])

  const openEdit = useCallback(
    (client: ClientRow) => {
      setEditingClient(client)
      form.reset(clientToFormValues(client))
      setModalOpen(true)
    },
    [form]
  )

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!values.name.trim() || !values.cnpj.trim() || !values.address.trim()) return
    const payload = {
      name: values.name.trim(),
      cnpj: values.cnpj.trim(),
      address: values.address.trim(),
      logoUrl: values.logoUrl || undefined,
      signatureUrl: values.signatureUrl || undefined,
      beneficiaryBank: values.beneficiaryBank || undefined,
      bankCode: values.bankCode || undefined,
      branchCode: values.branchCode || undefined,
      swiftCode: values.swiftCode || undefined,
      swiftBic: values.swiftBic || undefined,
      intermediaryBank: values.intermediaryBank || undefined,
      accountNumber: values.accountNumber || undefined,
      routingNumber: values.routingNumber || undefined,
      beneficiaryAddress: values.beneficiaryAddress || undefined,
    }
    if (editingClient) {
      await updateClient({ id: editingClient.id, ...payload })
    } else {
      await createClient(payload)
    }
    setModalOpen(false)
    setEditingClient(null)
    form.reset(clientFormDefaultValues)
  })

  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-2 border-b bg-muted/30">
        <div className="flex items-center justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Clientes
            </CardTitle>
            <CardDescription>Cadastre e consulte clientes para usar nos documentos.</CardDescription>
          </div>
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Criar novo
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="border rounded-md overflow-hidden">
          {isLoading ? (
            <div className="justify-center flex py-10">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : clients.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground space-y-4">
              <p>Nenhum cliente cadastrado ainda.</p>
              <Button variant="outline" onClick={openCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Criar novo cliente
              </Button>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>CNPJ</TableHead>
                    <TableHead>Endereço</TableHead>
                    <TableHead className="w-[100px] text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagedClients.map((client) => (
                    <TableRow
                      key={client.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => openEdit(client)}
                    >
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>{client.cnpj}</TableCell>
                      <TableCell>{client.address}</TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(client)}
                          className="gap-1.5"
                        >
                          <Pencil className="h-4 w-4" />
                          Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                page={page}
                totalPages={totalPages}
                totalItems={(clients as ClientRow[]).length}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
                itemLabel="clientes"
              />
            </>
          )}
        </div>
      </CardContent>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingClient ? 'Editar cliente' : 'Novo cliente'}</DialogTitle>
            <DialogDescription>
              {editingClient
                ? 'Altere os dados do cliente e salve.'
                : 'Preencha os dados do novo cliente.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <ClientFormFields
                handleLogoChange={handleLogoChange}
                handleSignatureChange={handleSignatureChange}
                uploadingLogo={uploadingLogo}
                uploadingSignature={uploadingSignature}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                >
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
    </Card>
  )
}
