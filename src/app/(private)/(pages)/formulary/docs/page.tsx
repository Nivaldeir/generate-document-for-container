'use client'

import React, { useState } from 'react'
import Link from 'next/link'  
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { trpc } from '@/src/shared/lib/trpc'
import { Button } from '@/src/shared/components/ui/button'
import { Input } from '@/src/shared/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/shared/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/shared/components/ui/table'
import { FileText, Loader2, List, ExternalLink, Search } from 'lucide-react'

function formatBytes(bytes: number | null): string {
  if (bytes == null) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function FormularyDocsPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const { data: documentos = [], isLoading: listLoading } = trpc.documentos.list.useQuery()


  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-4 border-b bg-muted/30">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <List className="h-5 w-5" />
              Documentos salvos
            </CardTitle>
            <CardDescription className="mt-1">
              Listagem dos arquivos em /upload. Clique no link para abrir ou baixar.
            </CardDescription>
          </div>
          {!listLoading && documentos.length > 0 && (
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {documentos.length} {documentos.length === 1 ? 'documento' : 'documentos'}
            </span>
          )}
        </div>
        {!listLoading && documentos.length > 0 && (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por nome ou arquivo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-9 bg-background"
              />
            </div>
            {searchQuery && (
              <Button type="button" variant="secondary" size="sm" onClick={() => setSearchQuery('')}>
                Limpar
              </Button>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {listLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : documentos.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">Nenhum documento cadastrado</p>
            <p className="text-sm mt-1">Os arquivos gerados e salvos no servidor aparecerão aqui.</p>
          </div>
        ) : documentos.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">Nenhum resultado para &quot;{searchQuery}&quot;</p>
            <p className="text-sm mt-1">Tente outro termo ou limpe a pesquisa.</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => setSearchQuery('')}>
              Limpar pesquisa
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold">Nome / Arquivo</TableHead>
                  <TableHead className="hidden sm:table-cell font-semibold w-24">Tamanho</TableHead>
                  <TableHead className="hidden md:table-cell font-semibold w-36">Enviado</TableHead>
                  <TableHead className="w-14 font-semibold"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documentos.map((doc) => (
                  <TableRow key={doc.id} className="group">
                    <TableCell>
                      <div className="flex min-w-0 items-center gap-2">
                        <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="min-w-0">
                          <span className="font-medium truncate block">
                            {doc.originalName || doc.filename}
                          </span>
                          {doc.originalName && doc.originalName !== doc.filename && (
                            <span className="block text-xs text-muted-foreground truncate">
                              {doc.filename}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground tabular-nums">
                      {formatBytes(doc.sizeInBytes)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                      {formatDistanceToNow(new Date(doc.createdAt), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link
                          href={`/upload/${doc.filename}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Abrir arquivo"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
