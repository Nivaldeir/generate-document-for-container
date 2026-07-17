'use client'

import { CardDescription, CardHeader, CardTitle } from '@/src/shared/components/ui/card'
import { Button } from '@/src/shared/components/ui/button'
import { Input } from '@/src/shared/components/ui/input'
import { Plus, Search, Users, X } from 'lucide-react'

type ClientsToolbarProps = {
  totalCount: number
  search: string
  onSearchChange: (value: string) => void
  onCreate: () => void
  showSearch: boolean
}

export function ClientsToolbar({
  totalCount,
  search,
  onSearchChange,
  onCreate,
  showSearch,
}: ClientsToolbarProps) {
  const isSearching = search.trim().length > 0
  return (
    <CardHeader className="space-y-4 border-b bg-muted/30">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Clientes
            {totalCount > 0 && (
              <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {totalCount}
              </span>
            )}
          </CardTitle>
          <CardDescription>Cadastre e consulte clientes para usar nos documentos.</CardDescription>
        </div>
        <Button onClick={onCreate} className="sm:self-start">
          <Plus className="mr-2 h-4 w-4" />
          Criar novo
        </Button>
      </div>
      {showSearch && (
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nome, CNPJ, endereço, banco ou SWIFT..."
            className="pl-9 pr-9"
          />
          {isSearching && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Limpar busca"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}
    </CardHeader>
  )
}
