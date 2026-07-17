'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/src/shared/components/ui/avatar'
import { Button } from '@/src/shared/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/shared/components/ui/table'
import { TablePagination } from '@/src/shared/components/ui/table-pagination'
import { Landmark, MapPin, Pencil } from 'lucide-react'
import type { ClientRow } from '../utils/clients.utils'
import { getInitials } from '../utils/clients.utils'

type ClientsTableProps = {
  clients: ClientRow[]
  page: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
  onEdit: (client: ClientRow) => void
}

export function ClientsTable({
  clients,
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onEdit,
}: ClientsTableProps) {
  return (
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
          {clients.map((client) => (
            <TableRow
              key={client.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onEdit(client)}
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
                  onClick={() => onEdit(client)}
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
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={onPageChange}
        itemLabel="clientes"
      />
    </>
  )
}
