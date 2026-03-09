'use client'

import { useState } from 'react'
import { trpc } from '@/src/shared/lib/trpc'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/src/shared/components/ui/card'
import { Input } from '@/src/shared/components/ui/input'
import { Button } from '@/src/shared/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/shared/components/ui/table'
import { Loader2, Users } from 'lucide-react'

export default function ClientsPage() {
  const [name, setName] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [address, setAddress] = useState('')

  const utils = trpc.useUtils()
  const { data: clients = [], isLoading } = trpc.clients.list.useQuery()
  const { mutateAsync: createClient, isPending } = trpc.clients.create.useMutation({
    onSuccess: () => {
      void utils.clients.list.invalidate()
    },
  })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!name.trim() || !cnpj.trim() || !address.trim()) return
    await createClient({ name: name.trim(), cnpj: cnpj.trim(), address: address.trim() })
    setName('')
    setCnpj('')
    setAddress('')
  }

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
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-[2fr_1.5fr]">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600">Nome</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome do cliente"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600">CNPJ</label>
              <Input
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                placeholder="00.000.000/0000-00"
              />
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600">Endereço</label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Endereço completo"
              />
            </div>
            <div className="flex justify-end pt-1">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar cliente'
                )}
              </Button>
            </div>
          </div>
        </form>

        <div className="border rounded-md overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : clients.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Nenhum cliente cadastrado ainda.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead>Endereço</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client: { id: string; name: string; cnpj: string; address: string }) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.cnpj}</TableCell>
                    <TableCell>{client.address}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

