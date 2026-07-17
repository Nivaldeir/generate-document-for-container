import * as React from 'react'
import { cn } from '@/src/shared/lib/utils'
import { Card } from './card'
import { SEMANTIC_TONES, type SemanticTone } from '@/src/shared/config/semantic-colors'

type KpiSize = 'hero' | 'compact'

type KpiCardProps = {
  label: string
  value: React.ReactNode
  caption?: React.ReactNode
  icon?: React.ReactNode
  tone?: SemanticTone
  size?: KpiSize
  className?: string
}

export function KpiCard({
  label,
  value,
  caption,
  icon,
  tone = 'neutral',
  size = 'hero',
  className,
}: KpiCardProps) {
  if (size === 'compact') {
    return (
      <Card className={cn('p-4', className)}>
        <div className="flex items-center gap-3">
          {icon && (
            <div className={cn('rounded-md p-2 shrink-0', SEMANTIC_TONES[tone])}>
              <span className="block h-4 w-4 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground truncate">{label}</p>
            <p className="text-lg font-semibold truncate">{value}</p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className={cn('p-6', className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-3xl font-semibold tracking-tight">{value}</p>
          {caption && <p className="text-xs text-muted-foreground">{caption}</p>}
        </div>
        {icon && (
          <div className={cn('rounded-md p-2 shrink-0', SEMANTIC_TONES[tone])}>
            <span className="block h-4 w-4 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
          </div>
        )}
      </div>
    </Card>
  )
}
