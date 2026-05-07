'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { trpc } from '@/src/shared/lib/trpc'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/src/shared/components/ui/card'
import { Button } from '@/src/shared/components/ui/button'
import { Input } from '@/src/shared/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/shared/components/ui/avatar'
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
import { Loader2, Users, Plus, Pencil, Search, MapPin, Landmark, X } from 'lucide-react'
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

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0][0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] ?? '' : ''
  return (first + last).toUpperCase()
}

export default function ClientsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<ClientRow | null>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

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

  const filteredClients = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return clients as ClientRow[]
    return (clients as ClientRow[]).filter((c) =>
      [c.name, c.cnpj, c.address, c.beneficiaryBank, c.swiftCode, c.swiftBic]
        .some((v) => (v ?? '').toLowerCase().includes(q))
    )
  }, [clients, search])

  const totalPages = Math.max(1, Math.ceil(filteredClients.length / PAGE_SIZE))
  const pagedClients = useMemo(
    () => filteredClients.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredClients, page]
  )

  useEffect(() => {
    setPage(1)
  }, [search])

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

  const hasClients = (clients as ClientRow[]).length > 0
  const isSearching = search.trim().length > 0
  const showEmptyState = !isLoading && filteredClients.length === 0

  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-4 border-b bg-muted/30">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Clientes
              {hasClients && (
                <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {(clients as ClientRow[]).length}
                </span>
              )}
            </CardTitle>
            <CardDescription>Cadastre e consulte clientes para usar nos documentos.</CardDescription>
          </div>
          <Button onClick={openCreate} className="sm:self-start">
            <Plus className="mr-2 h-4 w-4" />
            Criar novo
          </Button>
        </div>
        {hasClients && (
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, CNPJ, endereço, banco ou SWIFT..."
              className="pl-9 pr-9"
            />
            {isSearching && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Limpar busca"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="border rounded-md overflow-hidden">
          {isLoading ? (
            <div className="justify-center flex py-10">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : showEmptyState ? (
            <div className="py-12 text-center text-sm text-muted-foreground space-y-4">
              {isSearching ? (
                <>
                  <p>
                    Nenhum cliente encontrado para{' '}
                    <span className="font-medium text-foreground">&ldquo;{search}&rdquo;</span>.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setSearch('')}>
                    Limpar busca
                  </Button>
                </>
              ) : (
                <>
                  <p>Nenhum cliente cadastrado ainda.</p>
                  <Button variant="outline" onClick={openCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Criar novo cliente
                  </Button>
                </>
              )}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead className="hidden md:table-cell">Endereço</TableHead>
                    <TableHead className="hidden lg:table-cell">Banco</TableHead>
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
                      <TableCell className="py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar className="h-10 w-10 rounded-md border bg-muted/40">
                            {client.logoUrl ? (
                              <AvatarImage
                                src={client.logoUrl}
                                alt={client.name}
                                className="object-contain"
                              />
                            ) : null}
                            <AvatarFallback className="rounded-md text-xs font-medium">
                              {getInitials(client.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="font-medium truncate">{client.name}</div>
                            <div className="text-xs text-muted-foreground truncate">{client.cnpj}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-xs">
                        <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                          <span className="truncate" title={client.address}>
                            {client.address}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {client.beneficiaryBank ? (
                          <div className="flex items-center gap-1.5 text-sm">
                            <Landmark className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span className="truncate" title={client.beneficiaryBank}>
                              {client.beneficiaryBank}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(client)}
                          className="gap-1.5"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="hidden sm:inline">Editar</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                page={page}
                totalPages={totalPages}
                totalItems={filteredClients.length}
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
