export const SEMANTIC_TONES = {
  brand: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  blocked: 'bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300',
  consolidated: 'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  danger: 'bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-300',
  volume: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300',
  qr: 'bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300',
  neutral: 'bg-muted text-muted-foreground',
} as const

export type SemanticTone = keyof typeof SEMANTIC_TONES
