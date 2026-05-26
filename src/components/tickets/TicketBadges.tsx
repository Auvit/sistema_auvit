import { PRIORITY_COLORS, PRIORITY_LABELS, STATUS_COLORS, STATUS_LABELS } from '@/lib/ticket-labels'
import type { TicketPriority, TicketStatus } from '@/types/ticket'
import { cn } from '@/lib/utils'

export function StatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
        STATUS_COLORS[status]
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}

export function PriorityLabel({ priority }: { priority: TicketPriority }) {
  return (
    <span className={cn('text-sm', PRIORITY_COLORS[priority])}>
      {PRIORITY_LABELS[priority]}
    </span>
  )
}
