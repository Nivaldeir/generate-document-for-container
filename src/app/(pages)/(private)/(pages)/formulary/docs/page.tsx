'use client'

import { useEffect, useMemo, useState } from 'react'
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
import { FileText, Loader2, List, Search } from 'lucide-react'
import { TablePagination } from '@/src/shared/components/ui/table-pagination'

const PAGE_SIZE = 10

type JobRow = {
  id: string
  batchId: string | null
  createdAt: string | Date
  invoiceNumber: string
  blLabel: string
  invoiceType: string
}

function DownloadLink({ jobId, kind, label }: { jobId: string; kind: 'bl' | 'invoice' | 'payment'; label: string }) {
  return (
    <Button variant="link" className="h-auto p-0 text-sm font-normal" asChild>
      <a
        href={`/api/download-pdf?jobId=${encodeURIComponent(jobId)}&kind=${kind}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <FileText className="h-4 w-4 mr-1.5 text-muted-foreground" />
        {label}
      </a>
    </Button>
  )
}

export default function FormularyDocsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)

  const { data: jobs = [], isLoading } = trpc.documentos.list.useQuery()

  const filtered = useMemo(() => {
    const rows = (jobs as JobRow[]) ?? []
    if (!searchQuery.trim()) return rows
    const q = searchQuery.trim().toLowerCase()
    return rows.filter((j) =>
      [j.invoiceNumber, j.blLabel].some((s) => s.toLowerCase().includes(q))
    )
  }, [jobs, searchQuery])

  useEffect(() => { setPage(1) }, [searchQuery])

  const total = jobs.length
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  )

  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-4 border-b bg-muted/30">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <List className="h-5 w-5" />
              Documentos gerados
            </CardTitle>
            <CardDescription className="mt-1">
              Os PDFs são gerados sob demanda a partir dos dados salvos. Clique em cada tipo para baixar.
            </CardDescription>
          </div>
          {!isLoading && total > 0 && (
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {total} {total === 1 ? 'geração' : 'gerações'}
            </span>
          )}
        </div>
        {!isLoading && total > 0 && (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por invoice ou BL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background"
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
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : total === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">Nenhum documento gerado</p>
            <p className="text-sm mt-1">Gere documentos em &quot;Serviços&quot; ou &quot;Fretes&quot; para vê-los aqui.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">Nenhum resultado para &quot;{searchQuery}&quot;</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold w-40">Data</TableHead>
                  <TableHead className="font-semibold">Invoice #</TableHead>
                  <TableHead className="font-semibold">BLs</TableHead>
                  <TableHead className="font-semibold">Downloads</TableHead>
                  <TableHead className="hidden md:table-cell font-semibold w-36">Gerado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((job) => {
                  const createdAt = new Date(job.createdAt)
                  return (
                    <TableRow key={job.id} className="group">
                      <TableCell className="align-top whitespace-nowrap text-sm text-muted-foreground">
                        {createdAt.toLocaleDateString('pt-BR')}<br />
                        <span className="text-xs">
                          {createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </TableCell>
                      <TableCell className="align-top text-sm">{job.invoiceNumber || '—'}</TableCell>
                      <TableCell className="align-top text-sm">{job.blLabel || '—'}</TableCell>
                      <TableCell className="align-top">
                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                          <DownloadLink jobId={job.id} kind="bl" label="BL" />
                          <DownloadLink jobId={job.id} kind="invoice" label="Invoice" />
                          <DownloadLink jobId={job.id} kind="payment" label="Pagamento" />
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell align-top text-muted-foreground text-sm">
                        {formatDistanceToNow(createdAt, { addSuffix: true, locale: ptBR })}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            <TablePagination
              page={page}
              totalPages={totalPages}
              totalItems={filtered.length}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
              itemLabel="gerações"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
