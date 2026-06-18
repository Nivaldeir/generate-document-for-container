export function parseLocaleNumber(value: string | undefined | null): number {
  if (!value) return 0
  const trimmed = value.trim()
  if (!trimmed) return 0
  const hasCommaDecimal = /,\d{1,2}$/.test(trimmed)
  const normalized = hasCommaDecimal
    ? trimmed.replace(/\./g, '').replace(',', '.')
    : trimmed.replace(/,/g, '')
  const num = parseFloat(normalized)
  return Number.isFinite(num) ? num : 0
}

export function formatLocaleNumber(value: number): string {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
