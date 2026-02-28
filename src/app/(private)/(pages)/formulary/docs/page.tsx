'use client'

import React, { useMemo, useState } from 'react'
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

  const { data: grupos = [], isLoading: listLoading } = trpc.documentos.list.useQuery()

  const gruposFiltrados = useMemo(() => {
    if (!grupos || grupos.length === 0) return []
    if (!searchQuery.trim()) return grupos
    const q = searchQuery.trim().toLowerCase()
    return grupos.filter((g: any) => {
      const parts: string[] = []
      if (g.bl?.originalName) parts.push(g.bl.originalName)
      if (g.invoice?.originalName) parts.push(g.invoice.originalName)
      if (g.payment?.originalName) parts.push(g.payment.originalName)
      return parts.some((p) => p.toLowerCase().includes(q))
    })
  }, [grupos, searchQuery])

  const totalDocumentos = grupos?.length ?? 0

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
          {!listLoading && totalDocumentos > 0 && (
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {totalDocumentos} {totalDocumentos === 1 ? 'lote de documentos' : 'lotes de documentos'}
            </span>
          )}
        </div>
        {!listLoading && totalDocumentos > 0 && (
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
        ) : totalDocumentos === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">Nenhum documento cadastrado</p>
            <p className="text-sm mt-1">Os arquivos gerados e salvos no servidor aparecerão aqui.</p>
          </div>
        ) : gruposFiltrados.length === 0 ? (
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
                  <TableHead className="font-semibold w-40">Data</TableHead>
                  <TableHead className="font-semibold">BL</TableHead>
                  <TableHead className="font-semibold">Invoice</TableHead>
                  <TableHead className="font-semibold">Pagamento</TableHead>
                  <TableHead className="hidden sm:table-cell font-semibold w-24 text-right">Tamanho total</TableHead>
                  <TableHead className="hidden md:table-cell font-semibold w-36">Enviado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gruposFiltrados.map((grupo: any) => {
                  const createdAt = new Date(grupo.createdAt)
                  const totalSize =
                    (grupo.bl?.sizeInBytes ?? 0) +
                    (grupo.invoice?.sizeInBytes ?? 0) +
                    (grupo.payment?.sizeInBytes ?? 0)

                  return (
                    <TableRow key={grupo.id} className="group">
                      <TableCell className="align-top whitespace-nowrap text-sm text-muted-foreground">
                        {createdAt.toLocaleDateString('pt-BR')}<br />
                        <span className="text-xs">
                          {createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </TableCell>
                      <TableCell className="align-top">
                        {grupo.bl ? (
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <Button variant="link" className="h-auto p-0 text-sm font-normal" asChild>
                              <Link
                                href={`/api/documentos/download?filename=${encodeURIComponent(grupo.bl.filename)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {grupo.bl.originalName || grupo.bl.filename}
                              </Link>
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="align-top">
                        {grupo.invoice ? (
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <Button variant="link" className="h-auto p-0 text-sm font-normal" asChild>
                              <Link
                                href={`/api/documentos/download?filename=${encodeURIComponent(grupo.invoice.filename)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {grupo.invoice.originalName || grupo.invoice.filename}
                              </Link>
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="align-top">
                        {grupo.payment ? (
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <Button variant="link" className="h-auto p-0 text-sm font-normal" asChild>
                              <Link
                                href={`/api/documentos/download?filename=${encodeURIComponent(grupo.payment.filename)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {grupo.payment.originalName || grupo.payment.filename}
                              </Link>
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell align-top text-right text-muted-foreground tabular-nums">
                        {totalSize ? formatBytes(totalSize) : '—'}
                      </TableCell>
                      <TableCell className="hidden md:table-cell align-top text-muted-foreground text-sm">
                        {formatDistanceToNow(createdAt, {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
