import type { ClientFormValues } from '../hooks/use-clients.hook'

export type ClientRow = {
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

export function clientToFormValues(c: ClientRow): ClientFormValues {
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

const OPTIONAL_FIELDS = [
  'logoUrl',
  'signatureUrl',
  'beneficiaryBank',
  'bankCode',
  'branchCode',
  'swiftCode',
  'swiftBic',
  'intermediaryBank',
  'accountNumber',
  'routingNumber',
  'beneficiaryAddress',
] as const

export type ClientPayload = {
  name: string
  cnpj: string
  address: string
} & Partial<Record<(typeof OPTIONAL_FIELDS)[number], string | undefined>>

export function buildClientPayload(values: ClientFormValues): ClientPayload {
  const payload: ClientPayload = {
    name: values.name.trim(),
    cnpj: values.cnpj.trim(),
    address: values.address.trim(),
  }
  for (const field of OPTIONAL_FIELDS) {
    const v = values[field]
    if (v) payload[field] = v
  }
  return payload
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0][0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] ?? '' : ''
  return (first + last).toUpperCase()
}

export function filterClients(clients: ClientRow[], query: string): ClientRow[] {
  const q = query.trim().toLowerCase()
  if (!q) return clients
  return clients.filter((c) =>
    [c.name, c.cnpj, c.address, c.beneficiaryBank, c.swiftCode, c.swiftBic]
      .some((v) => (v ?? '').toLowerCase().includes(q)),
  )
}

export const CLIENTS_PAGE_SIZE = 10
