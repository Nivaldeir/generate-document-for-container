'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Loader2, Plus } from 'lucide-react'

import { trpc } from '@/src/shared/lib/trpc'
import { Card, CardContent } from '@/src/shared/components/ui/card'
import { Button } from '@/src/shared/components/ui/button'

import { useClients, clientFormDefaultValues } from './hooks/use-clients.hook'
import {
  CLIENTS_PAGE_SIZE,
  buildClientPayload,
  clientToFormValues,
  filterClients,
  type ClientRow,
} from './utils/clients.utils'
import { ClientsToolbar } from './_components/clients-toolbar'
import { ClientsTable } from './_components/clients-table'
import { ClientFormDialog } from './_components/client-form-dialog'

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
  const invalidate = () => void utils.clients.list.invalidate()
  const { mutateAsync: createClient, isPending: isCreating } = trpc.clients.create.useMutation({ onSuccess: invalidate })
  const { mutateAsync: updateClient, isPending: isUpdating } = trpc.clients.update.useMutation({ onSuccess: invalidate })

  const isPending = isCreating || isUpdating
  const typedClients = clients as ClientRow[]

  const filteredClients = useMemo(() => filterClients(typedClients, search), [typedClients, search])
  const totalPages = Math.max(1, Math.ceil(filteredClients.length / CLIENTS_PAGE_SIZE))
  const pagedClients = useMemo(
    () => filteredClients.slice((page - 1) * CLIENTS_PAGE_SIZE, page * CLIENTS_PAGE_SIZE),
    [filteredClients, page],
  )

  useEffect(() => setPage(1), [search])

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
    [form],
  )

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!values.name.trim() || !values.cnpj.trim() || !values.address.trim()) return
    const payload = buildClientPayload(values)
    if (editingClient) {
      await updateClient({ id: editingClient.id, ...payload })
    } else {
      await createClient(payload)
    }
    setModalOpen(false)
    setEditingClient(null)
    form.reset(clientFormDefaultValues)
  })

  const hasClients = typedClients.length > 0
  const isSearching = search.trim().length > 0
  const showEmptyState = !isLoading && filteredClients.length === 0

  return (
    <Card className="overflow-hidden">
      <ClientsToolbar
        totalCount={typedClients.length}
        search={search}
        onSearchChange={setSearch}
        onCreate={openCreate}
        showSearch={hasClients}
      />
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
            <ClientsTable
              clients={pagedClients}
              page={page}
              totalPages={totalPages}
              totalItems={filteredClients.length}
              pageSize={CLIENTS_PAGE_SIZE}
              onPageChange={setPage}
              onEdit={openEdit}
            />
          )}
        </div>
      </CardContent>

      <ClientFormDialog
        open={modalOpen}
        onOpenChange={setModalOpen}
        form={form}
        isEditing={Boolean(editingClient)}
        isPending={isPending}
        uploadingLogo={uploadingLogo}
        uploadingSignature={uploadingSignature}
        handleLogoChange={handleLogoChange}
        handleSignatureChange={handleSignatureChange}
        onSubmit={handleSubmit}
      />
    </Card>
  )
}
