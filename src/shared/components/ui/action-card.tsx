import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/src/shared/lib/utils'
import { Card } from './card'
import { Badge } from './badge'

type ActionCardProps = {
  title: string
  description?: React.ReactNode
  icon?: React.ReactNode
  badge?: string
  href?: string
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export function ActionCard({
  title,
  description,
  icon,
  badge,
  href,
  onClick,
  disabled,
  className,
}: ActionCardProps) {
  const interactive = !disabled && (href || onClick)
  const content = (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-base font-semibold truncate">{title}</p>
          {badge && (
            <Badge
              variant="outline"
              className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] uppercase tracking-wide dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900"
            >
              {badge}
            </Badge>
          )}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground truncate">{description}</p>
        )}
      </div>
      {icon && (
        <span className="shrink-0 text-muted-foreground [&>svg]:h-4 [&>svg]:w-4">
          {icon}
        </span>
      )}
    </div>
  )

  const card = (
    <Card
      className={cn(
        'p-4 transition-colors',
        interactive && 'hover:bg-muted/40 cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
    >
      {content}
    </Card>
  )

  if (href && !disabled) {
    return <Link href={href}>{card}</Link>
  }
  if (onClick && !disabled) {
    return (
      <button type="button" onClick={onClick} className="text-left w-full">
        {card}
      </button>
    )
  }
  return card
}
